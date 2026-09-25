import mongoose, { Schema, Document, Model } from 'mongoose';
import { OrderRecord } from '@/types';

export interface IOrderDocument extends Omit<OrderRecord, 'id'>, Document {
  id?: string;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  selectedVariants: { type: Map, of: String }
}, { _id: false });

const CustomerInfoSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: { type: String, required: true },
  workEmail: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  suite: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'United States' },
  deliveryInstructions: { type: String }
}, { _id: false });

const OrderSchema = new Schema<IOrderDocument>({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: CustomerInfoSchema, required: true },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  shippingMethod: { 
    type: String, 
    enum: ['standard', 'express', 'white-glove'], 
    default: 'standard' 
  },
  status: { 
    type: String, 
    enum: ['Processing', 'Production', 'Dispatched', 'Delivered'], 
    default: 'Processing' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['invoice', 'corporate-card'], 
    default: 'invoice' 
  }
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

export const Order: Model<IOrderDocument> = 
  mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
