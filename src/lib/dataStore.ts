import { connectToDatabase } from './db';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { SEED_PRODUCTS } from '@/data/seedData';
import { ProductItem, OrderRecord } from '@/types';

// In-memory fallback stores (active when MONGODB_URI is absent or offline)
let inMemoryProducts: ProductItem[] = [...SEED_PRODUCTS];
const inMemoryOrders: OrderRecord[] = [];

export async function seedProducts(force: boolean = false): Promise<{ count: number; mode: string }> {
  const { isConnected, mode } = await connectToDatabase();

  if (isConnected && mode === 'mongodb') {
    const existingCount = await Product.countDocuments();
    if (existingCount === 0 || force) {
      if (force) {
        await Product.deleteMany({});
      }
      // Insert seed products mapping id to sku or custom identifier
      const docs = SEED_PRODUCTS.map((p) => ({
        ...p,
        _id: undefined
      }));
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

export async function fetchProducts(filters?: {
  category?: string;
  search?: string;
  sort?: string;
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
          { description: { $regex: filters.search, $options: 'i' } }
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

      const results = await mongoQuery.lean();
      if (results.length > 0) {
        products = results.map((doc: any) => ({
          ...doc,
          id: doc._id?.toString() || doc.id || doc.sku
        }));
      } else {
        // Auto-seed if empty
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

  // Filter in memory if needed (for fallback or double-check)
  if (products.length === 0) {
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
        p.description.toLowerCase().includes(s)
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

export async function submitOrder(orderInput: {
  customer: OrderRecord['customer'];
  items: OrderRecord['items'];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingMethod: OrderRecord['shippingMethod'];
  paymentMethod: OrderRecord['paymentMethod'];
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
    paymentMethod: orderInput.paymentMethod
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
        paymentMethod: orderInput.paymentMethod
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
