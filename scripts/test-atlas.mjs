import fs from 'fs';
import mongoose from 'mongoose';

const env = fs.readFileSync('.env.local', 'utf-8');
const match = env.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error('No MONGODB_URI found!');
  process.exit(1);
}

const uri = match[1].trim();
console.log('Testing connection to MongoDB Atlas...');

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
  });
  console.log('✅ Connected successfully to MongoDB Atlas!');
  console.log('Database name:', mongoose.connection.name);
  console.log('ReadyState:', mongoose.connection.readyState);
  
  const adminDb = mongoose.connection.db.admin();
  const pingResult = await adminDb.ping();
  console.log('Ping result:', pingResult);
  
  await mongoose.disconnect();
  console.log('Disconnected cleanly.');
  process.exit(0);
} catch (err) {
  console.error('❌ MongoDB Atlas Connection Error:');
  console.error(err.message);
  if (err.name === 'MongoServerSelectionError' || err.message.includes('authentication')) {
    console.error('\nNOTE: If you see "bad auth" or "IP not whitelisted", check:');
    console.error('1. Atlas Network Access -> Allow Access from Anywhere (0.0.0.0/0)');
    console.error('2. Database Access -> verify username and password');
  }
  process.exit(1);
}
