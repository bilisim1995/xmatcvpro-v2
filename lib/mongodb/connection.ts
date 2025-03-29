import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const CONNECTION_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const RECONNECT_INTERVAL = 5000;
const CONNECTION_POOL_SIZE = 10;

if (!MONGODB_URI) {
  throw new Error('MongoDB URI is not defined in environment variables');
}

// Configure Mongoose
mongoose.set('bufferCommands', true);
mongoose.set('maxTimeMS', CONNECTION_TIMEOUT);
mongoose.set('autoIndex', true);
mongoose.set('strictQuery', false);
mongoose.set('debug', process.env.NODE_ENV === 'development');

const options: mongoose.ConnectOptions = {
  maxPoolSize: CONNECTION_POOL_SIZE,
  minPoolSize: 1,
  maxIdleTimeMS: CONNECTION_TIMEOUT,
  connectTimeoutMS: CONNECTION_TIMEOUT,
  socketTimeoutMS: CONNECTION_TIMEOUT,
  serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
  heartbeatFrequencyMS: 10000,
  family: 4, // Force IPv4
  retryWrites: true,
  w: 'majority',
  ssl: true,
  authSource: 'admin',
  tls: true,
  tlsAllowInvalidCertificates: true, // Allow self-signed certificates
  tlsAllowInvalidHostnames: true, // Allow hostname mismatch
  compressors: ['snappy', 'zlib'],
  autoCreate: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

let isConnected = false;
let client: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

// Connection event handlers
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  isConnected = false;
  client = null;
  connectionPromise = null;
  
  // Schedule reconnection
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    console.log('Attempting to reconnect to MongoDB...');
    connect().catch(console.error);
  }, RECONNECT_INTERVAL);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
  client = null;
  connectionPromise = null;
  
  // Schedule reconnection
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    console.log('Attempting to reconnect after disconnect...');
    connect().catch(console.error);
  }, RECONNECT_INTERVAL);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  isConnected = true;
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
});

export async function connect(): Promise<typeof mongoose> {
  try {
    let retryCount = 0;
    let lastError: Error | null = null;
    
    // Check connection state
    const readyState = mongoose.connection.readyState;
    if (isConnected && readyState === 1) {
      console.log('Using existing MongoDB connection');
      return mongoose;
    }

    // Handle connection promise
    if (connectionPromise) {
      console.log('Connection already in progress, waiting...');
      return connectionPromise;
    }

    console.log('Starting new MongoDB connection...');

    while (retryCount < MAX_RETRIES) {
      try {
        console.log(`Connecting to MongoDB (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        connectionPromise = mongoose.connect(MONGODB_URI, options);
        await connectionPromise;
        isConnected = true;
        console.log('MongoDB connection established successfully');
        return mongoose;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Connection failed');
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          console.log(`Connection attempt failed, retrying in ${RETRY_DELAY}ms...`, error);
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
    
    throw new Error('Failed to connect to MongoDB');

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    isConnected = false;
    client = null;
    connectionPromise = null;
    throw error;
  }
}

export async function disconnect(): Promise<void> {
  const readyState = mongoose.connection.readyState;
  if (!isConnected || readyState !== 1) {
    console.log('No active connection to disconnect');
    return;
  }

  // Wait for any pending operations to complete
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    isConnected = false;
    client = null;
    connectionPromise = null;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}