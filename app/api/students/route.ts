import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

let ObjectId: any = null
try {
  const mongodb = require("mongodb")
  ObjectId = mongodb.ObjectId
} catch (error) {
  console.warn("MongoDB ObjectId not available")
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const appNumber = url.searchParams.get("application_number")
    const phone = url.searchParams.get("phone")

    if (!clientPromise) {
      console.log("MongoDB not available, returning empty students array")
      return NextResponse.json([])
    }

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MongoDB connection timeout')), 5000)
    })

    try {
      const client = await Promise.race([clientPromise, timeoutPromise])
      if (!client) {
        console.log("MongoDB client is null, returning empty array")
        return NextResponse.json([])
      }

      const db = client.db("idcard")
      const students = db.collection("students")

      const query: any = {}
      if (appNumber) query.application_number = appNumber
      if (phone) query.phone = phone

      const results = await students.find(query).sort({ createdAt: -1 }).toArray()
      const data = results.map((s) => ({
        ...s,
        id: s._id.toString(),
      }))
      return NextResponse.json(data)
    } catch (connectionError) {
      console.error("MongoDB connection failed:", connectionError)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("GET /api/students error:", error)
    return NextResponse.json([])
  }
}

// Cardstation only needs to READ student data for validation
// Admin functions (POST, PUT, DELETE) are handled by smartidcard app

