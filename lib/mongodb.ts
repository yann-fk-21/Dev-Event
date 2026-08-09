import mongoose, { Mongoose } from 'mongoose';

/**
 * The MongoDB URI should be defined in your environment variables (.env).
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env'
  );
}

/**
 * Mongoose connection cache interface to prevent multiple connections 
 * during development hot reloads.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Global declaration to extend the global object with our mongoose cache.
 * We use 'var' because it's the only way to declare a global variable that
 * survives between module reloads in Next.js development mode.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Initialize the cache from the global object.
 */
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}
const cached = global.mongoose;

/**
 * Connects to the MongoDB database using Mongoose.
 * Caches the connection to reuse it across multiple requests and reloads.
 * 
 * @returns {Promise<Mongoose>} The established Mongoose connection.
 */
async function connectToDatabase(): Promise<Mongoose> {
  // If we have a connection already, return it.
  if (cached.conn) {
    return cached.conn;
  }

  // If there's no promise for a connection yet, create one.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering to fail fast if connection is lost
    };

    // mongoose.connect returns a promise that resolves to the mongoose instance.
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      console.log('Successfully connected to MongoDB.');
      return mongooseInstance;
    });
  }

  try {
    // Wait for the connection promise to resolve.
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise if connection fails so we can try again on the next request.
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
