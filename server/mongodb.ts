import { MongoClient, ServerApiVersion } from 'mongodb';
import { log } from './vite';

// Get MongoDB password from environment variables
const password = process.env.MONGODB_PASSWORD;

// Replace placeholder with actual password
const connectionString = `mongodb+srv://NETFLIX:${password}@cluster0.ygvxw78.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with connection options
const client = new MongoClient(connectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and collections references
let db: any;

// Connect to the MongoDB server
export async function connectToDatabase() {
  try {
    await client.connect();
    log('Successfully connected to MongoDB Atlas!', 'mongodb');
    
    // Get database reference
    db = client.db('netflix');
    
    // Ping to confirm connection
    await db.command({ ping: 1 });
    log('Database connection confirmed', 'mongodb');
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Get database instance
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

// Close database connection (for cleanup)
export async function closeConnection() {
  try {
    await client.close();
    log('MongoDB connection closed', 'mongodb');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Export the client for direct access if needed
export { client };