import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing an Event document in MongoDB.
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for the Event model.
 */
const EventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

/**
 * Unique index on slug for optimized lookups and data integrity.
 */
EventSchema.index({ slug: 1 });

/**
 * Pre-save hook to handle slug generation and data normalization.
 */
EventSchema.pre<IEvent>('save', function (next) {
  // Automatically generate/update slug if title is modified
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove non-word characters (except space and hyphen)
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores and hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  }

  // Validate and normalize date to ISO format
  if (this.isModified('date')) {
    const parsedDate = new Date(this.date);
    if (isNaN(parsedDate.getTime())) {
      return next(new Error('Invalid date provided.'));
    }
    this.date = parsedDate.toISOString();
  }

  // Ensure time is stored in a consistent, trimmed format
  if (this.isModified('time')) {
    this.time = this.time.trim();
  }

  next();
});

/**
 * Export the Event model. Uses existing model if available to prevent re-compilation in Next.js.
 */
const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
