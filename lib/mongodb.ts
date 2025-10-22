import { MongoClient } from "mongodb";

// Do not throw synchronously at module import time. Some build systems
// (for example Vercel during next build) import server modules when
// collecting page data which can surface runtime env issues as build
// failures. Instead, expose a promise that will reject when the
// environment is missing so the failure occurs at runtime when the
// API is actually invoked.

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  // Create a rejected promise rather than throwing synchronously.
  // Awaiting this promise later will surface a clear error at runtime.
  clientPromise = Promise.reject(
    new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  );
} else if (process.env.NODE_ENV === "development") {
  // In development, preserve a global promise across HMR reloads.
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise as Promise<MongoClient>;
} else {
  // Production: create a new MongoClient promise.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;