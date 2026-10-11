import mongoose from "mongoose";

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
// eslint-disable-next-line no-var
declare global { var mongooseCache: MongooseCache | undefined; }
const cache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cache;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required.");
  if (cache.conn) return cache.conn;
  if (!cache.promise) cache.promise = mongoose.connect(uri, { bufferCommands: false });
  try { cache.conn = await cache.promise; }
  catch (error) { cache.promise = null; throw error; }
  return cache.conn;
}
