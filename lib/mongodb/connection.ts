import mongoose from 'mongoose';
import { EventEmitter } from 'events';

const MONGODB_URI = process.env.MONGODB_URI || '';
const CONNECTION_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

if (!MONGODB_URI) {
  throw new Error('MongoDB URI is not defined in environment variables');
}

mongoose.set('bufferCommands', true); // Enable buffering
mongoose.set('maxTimeMS', CONNECTION_TIMEOUT);

const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: CONNECTION_TIMEOUT,
  connectTimeoutMS: CONNECTION_TIMEOUT,
  socketTimeoutMS: CONNECTION_TIMEOUT,
  serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
  retryWrites: true,
  w: 'majority',
  ssl: true,
  authSource: 'admin',
  tls: true,
  tlsAllowInvalidCertificates: true, // Allow self-signed certificates
  tlsAllowInvalidHostnames: true, // Allow hostname mismatch
  compressors: ['snappy', 'zlib'],
  bufferCommands: true // Enable command buffering at the schema level
};

let isConnected = false;
let client: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

// Connection event handlers
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  isConnected = false;
  client = null;
  connectionPromise = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
  client = null;
  connectionPromise = null;
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  isConnected = true;
});

export async function connect(): Promise<typeof mongoose> {
  try {
    let retryCount = 0;
    let lastError: Error | null = null;
    
    console.log(`Attempting MongoDB connection (attempt ${retryCount + 1}/${MAX_RETRIES})...`);

    // Return existing connection promise if one is in progress
    if (connectionPromise) {
      return connectionPromise;
    }

    // Return existing connection if connected
    if (isConnected && client?.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return client;
    }
    
    while (retryCount < MAX_RETRIES) {
      try {
        // Create new connection
        console.log(`Connecting to MongoDB (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        connectionPromise = mongoose.connect(MONGODB_URI, options);
        client = await connectionPromise;
        isConnected = true;
        console.log('MongoDB connection successful');
        return client;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Connection failed');
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`Connection failed, retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
      } finally {
        connectionPromise = null;
      }
    }

    if (lastError) {
      console.error('All connection attempts failed');
      throw lastError;
    }

    // Fallback return to satisfy TypeScript
    throw new Error('Unexpected error: MongoDB connection logic did not return a client');

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    isConnected = false;
    client = null;
    connectionPromise = null;
    throw error;
  }
}

export async function disconnect(): Promise<void> {
  if (!isConnected || !client) return;

  // Wait for any pending operations to complete
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    isConnected = false;
    client = null;
    connectionPromise = null;
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}