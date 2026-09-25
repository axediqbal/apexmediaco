import mongoose, { Schema, Document, Model } from 'mongoose';
import { ProductItem } from '@/types';

export interface IProductDocument extends Omit<ProductItem, 'id'>, Document {
  id?: string;
}

const VariantSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  options: [{ type: String, required: true }]
}, { _id: false });

const ProductSchema = new Schema<IProductDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { 
    type: String, 
    required: true, 
    enum: ['Apparel', 'Event & Signage', 'VIP Kits', 'Digital Systems'] 
  },
  images: [{ type: String, required: true }],
  variants: [VariantSchema],
  features: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  badge: { type: String },
  sku: { type: String, required: true, unique: true },
  leadTime: { type: String, default: '3-5 Business Days' }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (_, ret: Record<string, any>) {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Guard against model recompilation in Next.js hot-reloading
export const Product: Model<IProductDocument> = 
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
