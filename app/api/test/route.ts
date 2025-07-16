import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    console.log("Testing MongoDB connection...")
    
    if (!clientPromise) {
      return NextResponse.json({ 
        status: "error", 
        message: "MongoDB not configured",
        env: process.env.MONGODB_URI ? "URI exists" : "No URI"
      })
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json({ 
        status: "error", 
        message: "MongoDB client failed to connect" 
      })
    }

    const db = client.db("idcard")

    // Check collections
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)

    // Count documents in different collections
    let studentsCount = 0
    let entriesCount = 0

    try {
      const students = db.collection("students")
      studentsCount = await students.countDocuments()
    } catch (e) {
      console.log("Students collection error:", e)
    }

    try {
      const entries = db.collection("entry_logs")
      entriesCount = await entries.countDocuments()
    } catch (e) {
      console.log("Entry_logs collection error:", e)
    }

    return NextResponse.json({
      status: "success",
      message: "MongoDB connected successfully",
      database: "idcard",
      collections: collectionNames,
      studentsCount: studentsCount,
      entriesCount: entriesCount,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error("MongoDB test error:", error)
    return NextResponse.json({ 
      status: "error", 
      message: "MongoDB connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
