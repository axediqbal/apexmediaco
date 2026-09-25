import fs from 'fs';
import mongoose from 'mongoose';

const env = fs.readFileSync('.env.local', 'utf-8');
const match = env.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error('No MONGODB_URI found');
  process.exit(1);
}

const uri = match[1].trim();

try {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const updateResult = await db.collection('products').updateOne(
    { slug: 'vip-client-onboarding-vault' },
    { $set: { 'images.0': '/images/vault-gold.jpg' } }
  );

  console.log('Update result matched:', updateResult.matchedCount, 'modified:', updateResult.modifiedCount);

  const updatedDoc = await db.collection('products').findOne({ slug: 'vip-client-onboarding-vault' });
  console.log('Verified Atlas product first image:', updatedDoc?.images?.[0]);

  await mongoose.disconnect();
  console.log('Done.');
} catch (err) {
  console.error('Failed to update Atlas:', err);
}
