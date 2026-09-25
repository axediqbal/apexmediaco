import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; mode: 'mongodb' | 'in-memory-fallback' }> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return { isConnected: false, mode: 'in-memory-fallback' };
  }

  if (cached.conn) {
    return { isConnected: true, mode: 'mongodb' };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: true, mode: 'mongodb' };
  } catch (error) {
    cached.promise = null;
    console.warn('[APEX DB] MongoDB connection failed or timed out. Falling back to high-fidelity in-memory store.', error);
    return { isConnected: false, mode: 'in-memory-fallback' };
  }
}
