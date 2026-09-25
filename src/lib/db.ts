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

export interface DbConnectionResult {
  isConnected: boolean;
  mode: 'mongodb' | 'in-memory-fallback';
  databaseName?: string;
  host?: string;
  error?: string;
}

/**
 * connectToDatabase — Manages resilient singleton connection to MongoDB.
 * 
 * KIYA HORAHA HAI (WHAT IT DOES):
 * - Establishes and caches a connection to MongoDB via Mongoose.
 * - If MONGODB_URI is absent or the connection attempt fails/times out, seamlessly returns
 *   a fallback signal so higher-level stores switch to in-memory mode without throwing uncaught exceptions.
 * 
 * KESE HORAHA HAI (HOW IT DOES IT):
 * 1. Checks Node global cache to prevent connection leakage across Next.js API reloads.
 * 2. Connects with configured connection pooling (maxPoolSize: 10, serverSelectionTimeoutMS: 3000ms).
 * 3. Binds standard diagnostic event listeners for connection monitoring.
 */
export async function connectToDatabase(): Promise<DbConnectionResult> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return { 
      isConnected: false, 
      mode: 'in-memory-fallback' 
    };
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return { 
      isConnected: true, 
      mode: 'mongodb',
      databaseName: cached.conn.connection.name,
      host: cached.conn.connection.host
    };
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 3500,
      socketTimeoutMS: 45000,
    };

    mongoose.connection.on('connected', () => {
      console.log('[APEX DB] MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.warn('[APEX DB] MongoDB connection error:', err?.message || err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('[APEX DB] MongoDB connection disconnected');
    });

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return { 
      isConnected: true, 
      mode: 'mongodb',
      databaseName: cached.conn.connection.name,
      host: cached.conn.connection.host
    };
  } catch (error: any) {
    cached.promise = null;
    cached.conn = null;
    console.warn('[APEX DB] MongoDB connection failed or timed out. Operating in high-fidelity in-memory mode.', error?.message || error);
    return { 
      isConnected: false, 
      mode: 'in-memory-fallback',
      error: error?.message || String(error)
    };
  }
}

/**
 * getConnectionStatus — Returns current connection readiness state without initiating a new connection.
 */
export function getConnectionStatus(): { readyState: number; isConnected: boolean; mode: 'mongodb' | 'in-memory-fallback' } {
  const readyState = mongoose.connection.readyState;
  const isConnected = readyState === 1;
  return {
    readyState,
    isConnected,
    mode: isConnected ? 'mongodb' : 'in-memory-fallback'
  };
}
