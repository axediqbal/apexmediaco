import mongoose, { Schema, Document, Model } from 'mongoose';
import { CartRecord, CartItemRecord } from '@/types';

export interface ICartDocument extends Omit<CartRecord, 'id'>, Document {
  id?: string;
}

const CartItemSchema = new Schema<CartItemRecord>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  selectedVariants: { type: Map, of: String, default: {} }
}, { _id: false });

const CartSchema = new Schema<ICartDocument>({
  sessionId: { type: String, required: true, unique: true, index: true },
  items: [CartItemSchema],
  subtotal: { type: Number, required: true, default: 0, min: 0 },
  itemCount: { type: Number, required: true, default: 0, min: 0 }
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

// Auto-calculate subtotal and itemCount before saving if modified
CartSchema.pre('save', async function () {
  if (this.items) {
    this.subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    this.itemCount = this.items.reduce((acc, item) => acc + item.quantity, 0);
  }
});

export const Cart: Model<ICartDocument> = 
  mongoose.models.Cart || mongoose.model<ICartDocument>('Cart', CartSchema);

export default Cart;
