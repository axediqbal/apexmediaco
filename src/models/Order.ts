import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderRecord } from '@/types';

export interface IOrderDocument extends Omit<OrderRecord, 'id'>, Document {
  id?: string;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  selectedVariants: { type: Map, of: String, default: {} }
}, { _id: false });

const CustomerInfoSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  workEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  suite: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, default: 'United States' },
  deliveryInstructions: { type: String, trim: true }
}, { _id: false });

const OrderSchema = new Schema<IOrderDocument>({
  orderNumber: { type: String, required: true, unique: true, index: true },
  customer: { type: CustomerInfoSchema, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  shipping: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  shippingMethod: { 
    type: String, 
    enum: ['standard', 'express', 'white-glove'], 
    default: 'standard' 
  },
  status: { 
    type: String, 
    enum: ['Processing', 'Production', 'Dispatched', 'Delivered'], 
    default: 'Processing',
    index: true
  },
  paymentMethod: { 
    type: String, 
    enum: ['invoice', 'corporate-card'], 
    default: 'invoice' 
  },
  notes: { type: String }
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

// Compound index for querying customer order history sorted by time
OrderSchema.index({ 'customer.workEmail': 1, createdAt: -1 });

export const Order: Model<IOrderDocument> = 
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
