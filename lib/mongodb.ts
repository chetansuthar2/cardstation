let MongoClient: any = null
let clientPromise: Promise<any> | null = null

try {
  // Try to import MongoDB, but don't fail if it's not available
  const mongodb = require("mongodb")
  MongoClient = mongodb.MongoClient
} catch (error) {
  console.warn("MongoDB package not available, using fallback mode")
}

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/idcard"
const options = {}

let client: any = null

try {
  if (process.env.MONGODB_URI && MongoClient) {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} catch (error) {
  console.warn("MongoDB connection failed, will use local storage:", error)
}

export default clientPromise