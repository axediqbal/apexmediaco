#!/usr/bin/env node
/**
 * API integration tests for ApexMediaCo.
 *
 * Covers the security-critical behaviors from the 2026-09-28 remediation:
 *  - admin endpoints fail closed without x-admin-key (401)
 *  - order totals are re-priced server-side (client tampering ignored)
 *  - request validation (email, items, product existence, quantities)
 *  - newsletter + waitlist validation and idempotency
 *
 * Usage:
 *   npm run build && npm run test:api
 *
 * The script boots `next start` on port 3100 itself, waits for readiness,
 * runs the suite, then tears the server down. No dependencies beyond node.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const PORT = 3100;
const BASE = `http://127.0.0.1:${PORT}`;

const results = [];
let productId = null;

function check(name, condition, detail = '') {
  results.push({ name, ok: !!condition, detail });
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail && !condition ? ` — ${detail}` : ''}`);
}

async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }
  return { status: res.status, json };
}

const CUSTOMER = {
  firstName: 'QA',
  lastName: 'Bot',
  companyName: 'Apex QA Labs',
  workEmail: 'qa-bot@apexmediaco.test',
  phone: '+1-555-010-2030',
  address: '500 Howard Street',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94105',
  country: 'United States',
};

function orderPayload(overrides = {}) {
  return {
    customer: CUSTOMER,
    items: [{ productId, quantity: 1, price: 1 }],
    subtotal: 1,
    shipping: 1,
    tax: 1,
    total: 1,
    shippingMethod: 'standard',
    paymentMethod: 'invoice',
    ...overrides,
  };
}

async function runSuite() {
  // --- admin endpoints fail closed -------------------------------------
  {
    const r = await api('GET', '/api/orders');
    check('GET /api/orders without admin key → 401', r.status === 401, `got ${r.status}`);
  }
  {
    const r = await api('GET', '/api/seed');
    check('GET /api/seed without admin key → 401', r.status === 401, `got ${r.status}`);
  }
  {
    const r = await api('POST', '/api/seed', {});
    check('POST /api/seed without admin key → 401', r.status === 401, `got ${r.status}`);
  }

  // --- grab a real product for order tests ------------------------------
  {
    const r = await api('GET', '/api/products?limit=1');
    const list = r.json?.data ?? r.json;
    productId = Array.isArray(list) && list[0] ? list[0].id : null;
    check('GET /api/products returns a product', !!productId, `got ${JSON.stringify(r.json)?.slice(0, 80)}`);
    if (!productId) return;
  }
  const catalogPrice = (await api('GET', '/api/products?limit=1')).json?.data?.[0]?.price
    ?? (await api('GET', '/api/products?limit=1')).json?.[0]?.price;

  // --- total tampering is ignored ---------------------------------------
  {
    const r = await api('POST', '/api/orders', orderPayload({ items: [{ productId, quantity: 2, price: 1 }], total: 1 }));
    const expectedSubtotal = catalogPrice * 2;
    const expectedShipping = expectedSubtotal >= 1500 ? 0 : 45;
    const expectedTotal = expectedSubtotal + expectedShipping + Math.round(expectedSubtotal * 0.0825);
    const ok =
      r.status === 201 &&
      r.json?.success === true &&
      r.json?.data?.total === expectedTotal &&
      r.json?.data?.items?.[0]?.price === catalogPrice;
    check(
      'POST /api/orders ignores client totals (server re-prices)',
      ok,
      `status=${r.status} total=${r.json?.data?.total} expected=${expectedTotal}`
    );
  }

  // --- validation --------------------------------------------------------
  {
    const r = await api('POST', '/api/orders', orderPayload({
      customer: { ...CUSTOMER, workEmail: 'not-an-email' },
    }));
    check('POST /api/orders invalid email → 400', r.status === 400, `got ${r.status}`);
  }
  {
    const r = await api('POST', '/api/orders', orderPayload({ items: [] }));
    check('POST /api/orders empty cart → 400', r.status === 400, `got ${r.status}`);
  }
  {
    const r = await api('POST', '/api/orders', orderPayload({
      items: [{ productId: 'nope-not-real', quantity: 1, price: 1 }],
    }));
    check('POST /api/orders unknown product → 400', r.status === 400, `got ${r.status}`);
  }
  {
    const r = await api('POST', '/api/orders', orderPayload({
      items: [{ productId, quantity: 500, price: 1 }],
    }));
    check('POST /api/orders quantity > 99 → 400', r.status === 400, `got ${r.status}`);
  }

  // --- newsletter ---------------------------------------------------------
  {
    const r = await api('POST', '/api/newsletter', { email: 'bad' });
    check('POST /api/newsletter invalid email → 400', r.status === 400, `got ${r.status}`);
  }
  {
    const email = `qa-${Date.now()}@apexmediaco.test`;
    const r1 = await api('POST', '/api/newsletter', { email });
    const r2 = await api('POST', '/api/newsletter', { email });
    check(
      'POST /api/newsletter subscribe → 201, re-subscribe → 200 (idempotent)',
      r1.status === 201 && r2.status === 200,
      `got ${r1.status}/${r2.status}`
    );
  }

  // --- waitlist ------------------------------------------------------------
  {
    const r = await api('POST', '/api/waitlist', { productId, email: 'bad' });
    check('POST /api/waitlist invalid email → 400', r.status === 400, `got ${r.status}`);
  }
  {
    const r = await api('POST', '/api/waitlist', { productId: 'nope-not-real', email: 'qa@apexmediaco.test' });
    check('POST /api/waitlist unknown product → 404', r.status === 404, `got ${r.status}`);
  }
  {
    const email = `wl-${Date.now()}@apexmediaco.test`;
    const r1 = await api('POST', '/api/waitlist', { productId, email });
    const r2 = await api('POST', '/api/waitlist', { productId, email });
    check(
      'POST /api/waitlist join → 201, re-join → 200 (idempotent)',
      r1.status === 201 && r2.status === 200,
      `got ${r1.status}/${r2.status}`
    );
  }
}

async function waitForServer(server) {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE + '/api/products?limit=1');
      if (res.ok) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

async function main() {
  if (!existsSync('.next')) {
    console.error('No .next build found. Run `npm run build` first.');
    process.exit(2);
  }

  const server = spawn('npx', ['next', 'start', '--port', String(PORT)], {
    stdio: 'ignore',
    env: { ...process.env, PORT: String(PORT) },
  });
  const kill = () => {
    try {
      server.kill('SIGTERM');
    } catch {
      /* already dead */
    }
  };
  process.on('exit', kill);
  process.on('SIGINT', () => {
    kill();
    process.exit(130);
  });

  try {
    if (!(await waitForServer(server))) {
      console.error('Server did not become ready in time.');
      process.exit(2);
    }
    await runSuite();
  } finally {
    kill();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
