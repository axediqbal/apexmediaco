import mongoose, { Schema, Document, Model } from 'mongoose';
import { WaitlistEntry } from '@/types';

export interface IWaitlistDocument extends Omit<WaitlistEntry, 'id'>, Document {
  id?: string;
}

const WaitlistSchema = new Schema<IWaitlistDocument>(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: function (_, ret: Record<string, any>) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        ret.createdAt = ret.createdAt ? new Date(ret.createdAt).toISOString() : ret.createdAt;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// One waitlist spot per email per product.
WaitlistSchema.index({ productId: 1, email: 1 }, { unique: true });

export const WaitlistEntryModel: Model<IWaitlistDocument> =
  mongoose.models.WaitlistEntry ||
  mongoose.model<IWaitlistDocument>('WaitlistEntry', WaitlistSchema);

export default WaitlistEntryModel;
