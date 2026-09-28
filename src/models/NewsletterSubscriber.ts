import mongoose, { Schema, Document, Model } from 'mongoose';
import { NewsletterSubscription } from '@/types';

export interface INewsletterDocument extends Omit<NewsletterSubscription, 'id'>, Document {
  id?: string;
}

const NewsletterSchema = new Schema<INewsletterDocument>(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
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

export const NewsletterSubscriber: Model<INewsletterDocument> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterDocument>('NewsletterSubscriber', NewsletterSchema);

export default NewsletterSubscriber;
