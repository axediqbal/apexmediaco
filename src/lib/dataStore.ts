import { connectToDatabase } from './db';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { Cart } from '@/models/Cart';
import { SEED_PRODUCTS } from '@/data/seedData';
import { ProductItem, OrderRecord, CartRecord, CartItemRecord } from '@/types';

/**
 * In-memory fallback stores (active when MONGODB_URI is absent or offline).
 * Pre-seeded with realistic APEX MEDIA CO agency collateral kits.
 */
let inMemoryProducts: ProductItem[] = [...SEED_PRODUCTS];
const inMemoryOrders: OrderRecord[] = [];
const inMemoryCarts: Map<string, CartRecord> = new Map();

/**
 * seedProducts — Seeds or re-seeds the catalog with APEX collateral kits.
 * 
 * KIYA HORAHA HAI (WHAT IT DOES):
 * - Checks if the database or in-memory store contains products; if empty (or if force=true), inserts seed products.
 * 
 * KESE HORAHA HAI (HOW IT DOES IT):
 * 1. Checks active database connection mode via connectToDatabase().
 * 2. In MongoDB mode: uses Mongoose Product.countDocuments() and insertMany().
 * 3. In fallback mode: populates inMemoryProducts array.
 */
export async function seedProducts(force: boolean = false): Promise<{ count: number; mode: string }> {
  const { isConnected, mode } = await connectToDatabase();

  if (isConnected && mode === 'mongodb') {
    const existingCount = await Product.countDocuments();
    if (existingCount === 0 || force) {
      if (force) {
        await Product.deleteMany({});
      }
      const docs = SEED_PRODUCTS.map((p) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...rest } = p;
        return rest;
      });
      await Product.insertMany(docs);
      const count = await Product.countDocuments();
      return { count, mode: 'mongodb' };
    }
    return { count: existingCount, mode: 'mongodb' };
  } else {
    if (inMemoryProducts.length === 0 || force) {
      inMemoryProducts = [...SEED_PRODUCTS];
    }
    return { count: inMemoryProducts.length, mode: 'in-memory-fallback' };
  }
}

/**
 * fetchProducts — Retrieves products with optional filtering and sorting.
 */
export async function fetchProducts(filters?: {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
  skip?: number;
}): Promise<ProductItem[]> {
  const { isConnected, mode } = await connectToDatabase();

  let products: ProductItem[] = [];

  if (isConnected && mode === 'mongodb') {
    try {
      const query: Record<string, unknown> = {};
      if (filters?.category && filters.category !== 'All') {
        query.category = filters.category;
      }
      if (filters?.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { tagline: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { sku: { $regex: filters.search, $options: 'i' } }
        ];
      }

      let mongoQuery = Product.find(query);

      if (filters?.sort === 'price-asc') {
        mongoQuery = mongoQuery.sort({ price: 1 });
      } else if (filters?.sort === 'price-desc') {
        mongoQuery = mongoQuery.sort({ price: -1 });
      } else if (filters?.sort === 'rating') {
        mongoQuery = mongoQuery.sort({ rating: -1 });
      } else {
        mongoQuery = mongoQuery.sort({ featured: -1, createdAt: -1 });
      }

      if (filters?.skip) {
        mongoQuery = mongoQuery.skip(filters.skip);
      }
      if (filters?.limit) {
        mongoQuery = mongoQuery.limit(filters.limit);
      }

      const results = await mongoQuery.lean();
      if (results.length > 0) {
        products = results.map((doc: any) => ({
          ...doc,
          id: doc._id?.toString() || doc.id || doc.sku
        }));
      } else if (!filters?.search && (!filters?.category || filters.category === 'All')) {
        // Auto-seed if database is completely empty on initial connect
        await seedProducts();
        const recheck = await Product.find(query).lean();
        products = recheck.map((doc: any) => ({
          ...doc,
          id: doc._id?.toString() || doc.id || doc.sku
        }));
      }
    } catch (err) {
      console.warn('[APEX DB] MongoDB query failed, falling back to in-memory store', err);
      products = [...inMemoryProducts];
    }
  } else {
    products = [...inMemoryProducts];
  }

  // Fallback memory filtering for resilience
  if (products.length === 0 && !filters?.search) {
    products = [...SEED_PRODUCTS];
    inMemoryProducts = [...SEED_PRODUCTS];
  }

  if (filters?.category && filters.category !== 'All') {
    products = products.filter((p) => p.category === filters.category);
  }

  if (filters?.search) {
    const s = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.tagline.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s)
    );
  }

  if (filters?.sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (filters?.sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (filters?.sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  }

  return products;
}

/**
 * fetchProductById — Finds a single product by ID, slug, or SKU.
 */
export async function fetchProductById(idOrSlug: string): Promise<ProductItem | null> {
  const { isConnected, mode } = await connectToDatabase();

  if (isConnected && mode === 'mongodb') {
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
      const query = isObjectId ? { _id: idOrSlug } : { $or: [{ slug: idOrSlug }, { id: idOrSlug }, { sku: idOrSlug }] };
      const doc = await Product.findOne(query).lean();
      if (doc) {
        const item = doc as any;
        return {
          ...item,
          id: item._id?.toString() || item.id || item.sku
        };
      }
    } catch (err) {
      console.warn('[APEX DB] Failed to fetch product from MongoDB, trying memory store', err);
    }
  }

  const found = inMemoryProducts.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug || p.sku === idOrSlug
  );
  return found || null;
}

/**
 * createProduct — Creates a new product in MongoDB or memory fallback.
 */
export async function createProduct(productData: Omit<ProductItem, 'id'>): Promise<ProductItem> {
  const { isConnected, mode } = await connectToDatabase();

  if (isConnected && mode === 'mongodb') {
    const doc = await Product.create(productData);
    const item = doc.toJSON() as any;
    return {
      ...item,
      id: doc._id.toString()
    };
  }

  const newProduct: ProductItem = {
    ...productData,
    id: `prod_${Date.now()}`
  };
  inMemoryProducts.push(newProduct);
  return newProduct;
}

/**
 * submitOrder — Persists an enterprise collateral order.
 */
export async function submitOrder(orderInput: {
  customer: OrderRecord['customer'];
  items: OrderRecord['items'];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: OrderRecord['shippingMethod'];
  paymentMethod: OrderRecord['paymentMethod'];
  notes?: string;
}): Promise<OrderRecord> {
  const { isConnected, mode } = await connectToDatabase();

  const orderNumber = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  const newOrder: OrderRecord = {
    id: `ord_${Date.now()}`,
    orderNumber,
    createdAt: now,
    customer: orderInput.customer,
    items: orderInput.items,
    subtotal: orderInput.subtotal,
    shipping: orderInput.shipping,
    tax: orderInput.tax,
    total: orderInput.total,
    shippingMethod: orderInput.shippingMethod,
    status: 'Processing',
    paymentMethod: orderInput.paymentMethod,
    notes: orderInput.notes
  };

  if (isConnected && mode === 'mongodb') {
    try {
      const doc = await Order.create({
        orderNumber,
        customer: orderInput.customer,
        items: orderInput.items,
        subtotal: orderInput.subtotal,
        shipping: orderInput.shipping,
        tax: orderInput.tax,
        total: orderInput.total,
        shippingMethod: orderInput.shippingMethod,
        status: 'Processing',
        paymentMethod: orderInput.paymentMethod,
        notes: orderInput.notes
      });
      newOrder.id = doc._id.toString();
    } catch (err) {
      console.warn('[APEX DB] MongoDB order insert failed, saving to in-memory store', err);
      inMemoryOrders.unshift(newOrder);
    }
  } else {
    inMemoryOrders.unshift(newOrder);
  }

  return newOrder;
}

/**
 * fetchOrders — Retrieves orders with optional email or status filter.
 */
export async function fetchOrders(filter?: { email?: string; status?: string; limit?: number }): Promise<OrderRecord[]> {
  const { isConnected, mode } = await connectToDatabase();

  if (isConnected && mode === 'mongodb') {
    try {
      const query: Record<string, unknown> = {};
      if (filter?.email) {
        query['customer.workEmail'] = filter.email.toLowerCase();
      }
      if (filter?.status) {
        query.status = filter.status;
      }

      let mongoQuery = Order.find(query).sort({ createdAt: -1 });
      if (filter?.limit) {
        mongoQuery = mongoQuery.limit(filter.limit);
      }

      const docs = await mongoQuery.lean();
      return docs.map((d: any) => ({
        ...d,
        id: d._id?.toString() || d.id
      }));
    } catch (err) {
      console.warn('[APEX DB] Failed to query orders from MongoDB, using memory', err);
    }
  }

  let results = [...inMemoryOrders];
  if (filter?.email) {
    results = results.filter((o) => o.customer.workEmail.toLowerCase() === filter.email?.toLowerCase());
  }
  if (filter?.status) {
    results = results.filter((o) => o.status === filter.status);
  }
  if (filter?.limit) {
    results = results.slice(0, filter.limit);
  }
  return results;
}

/**
 * fetchOrderById — Retrieves a single order by orderNumber or ID.
 */
export async function fetchOrderById(idOrNumber: string): Promise<OrderRecord | null> {
  const { isConnected, mode } = await connectToDatabase();

  if (isConnected && mode === 'mongodb') {
    try {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrNumber);
      const query = isObjectId ? { _id: idOrNumber } : { orderNumber: idOrNumber };
      const doc = await Order.findOne(query).lean();
      if (doc) {
        const item = doc as any;
        return {
          ...item,
          id: item._id?.toString() || item.id
        };
      }
    } catch (err) {
      console.warn('[APEX DB] Failed to fetch order by ID from MongoDB, checking memory', err);
    }
  }

  const found = inMemoryOrders.find((o) => o.id === idOrNumber || o.orderNumber === idOrNumber);
  return found || null;
}

/**
 * getCart — Fetches persistent cart by sessionId.
 */
export async function getCart(sessionId: string): Promise<CartRecord> {
  const { isConnected, mode } = await connectToDatabase();

  if (isConnected && mode === 'mongodb') {
    try {
      const doc = await Cart.findOne({ sessionId }).lean();
      if (doc) {
        const c = doc as any;
        return {
          id: c._id?.toString(),
          sessionId: c.sessionId,
          items: c.items || [],
          subtotal: c.subtotal || 0,
          itemCount: c.itemCount || 0,
          updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('[APEX DB] Failed to fetch cart from MongoDB, using memory', err);
    }
  }

  const memoryCart = inMemoryCarts.get(sessionId);
  if (memoryCart) {
    return memoryCart;
  }

  return {
    sessionId,
    items: [],
    subtotal: 0,
    itemCount: 0,
    updatedAt: new Date().toISOString()
  };
}

/**
 * saveCart — Upserts persistent cart items by sessionId.
 */
export async function saveCart(sessionId: string, items: CartItemRecord[]): Promise<CartRecord> {
  const { isConnected, mode } = await connectToDatabase();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const now = new Date().toISOString();

  const updatedCart: CartRecord = {
    sessionId,
    items,
    subtotal,
    itemCount,
    updatedAt: now
  };

  if (isConnected && mode === 'mongodb') {
    try {
      const doc = await Cart.findOneAndUpdate(
        { sessionId },
        { items, subtotal, itemCount },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      if (doc) {
        const c = doc as any;
        updatedCart.id = c._id?.toString();
      }
    } catch (err) {
      console.warn('[APEX DB] Failed to upsert cart in MongoDB, using memory', err);
      inMemoryCarts.set(sessionId, updatedCart);
    }
  } else {
    inMemoryCarts.set(sessionId, updatedCart);
  }

  return updatedCart;
}

/**
 * clearCart — Empties cart for a session.
 */
export async function clearCart(sessionId: string): Promise<boolean> {
  const { isConnected, mode } = await connectToDatabase();

  if (isConnected && mode === 'mongodb') {
    try {
      await Cart.deleteOne({ sessionId });
      return true;
    } catch (err) {
      console.warn('[APEX DB] Failed to clear cart in MongoDB', err);
    }
  }

  inMemoryCarts.delete(sessionId);
  return true;
}
