import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Event from './event.model';

/**
 * Interface representing a Booking document in MongoDB.
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  slug: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for the Booking model.
 */
const BookingSchema: Schema<IBooking> = new Schema(
  {
    eventId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Event', 
      required: true 
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      // Basic email validation using regex
      validate: {
        validator: function (v: string) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props: { value: string }) => `${props.value} is not a valid email format!`,
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

/**
 * Index on eventId for faster queries and optimized joins/lookups.
 */
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });
BookingSchema.index({ slug: 1 });

/**
 * Pre-save hook to verify that the referenced Event exists before saving a booking.
 */
BookingSchema.pre<IBooking>('save', async function () {
  // Only check if eventId is being set or modified
  if (this.isModified('eventId')) {
    try {
      const eventExists = await Event.exists({ _id: this.eventId });
      if (!eventExists) {
        throw new Error('Referenced Event does not exist. Validation failed.');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Referenced Event')) {
        throw error;
      }
      throw new Error('Error validating Event existence.');
    }
  }
});

/**
 * Export the Booking model. Uses existing model if available to prevent re-compilation in Next.js.
 */
const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
