import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain a minimum of 2 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
  retryWrites: true, // Retry writes on network errors
  retryReads: true, // Retry reads on network errors
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Add connection event listeners for better debugging
clientPromise
  .then((client) => {
    console.log('✅ MongoDB connected successfully')

    client.on('serverOpening', () => {
      console.log('🔗 MongoDB server connection opening')
    })

    client.on('serverClosed', () => {
      console.log('❌ MongoDB server connection closed')
    })

    client.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error)
    })

    return client
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error)
    throw error
  })

export default clientPromise