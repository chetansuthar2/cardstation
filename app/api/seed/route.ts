import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST() {
  try {
    if (!clientPromise) {
      return NextResponse.json({ error: "MongoDB not configured" }, { status: 500 })
    }

    const client = await clientPromise
    if (!client) {
      return NextResponse.json({ error: "MongoDB connection failed" }, { status: 500 })
    }

    const db = client.db("idcard")
    
    // Sample student data
    const sampleStudents = [
      {
        application_number: "APP20254105",
        student_name: "Test Student",
        phone: "9772348371",
        email: "test@example.com",
        course: "12th - Science",
        year: "2024",
        photo_url: "/placeholder-user.jpg",
        qr_code: "QR20254105",
        status: "active",
        schedule: "Morning Shift (8:00 AM - 2:00 PM)",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        application_number: "APP001",
        student_name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        course: "Computer Science",
        year: "2024",
        photo_url: "/placeholder-user.jpg",
        qr_code: "QR001",
        status: "active",
        schedule: "Morning Shift (8:00 AM - 2:00 PM)",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        application_number: "APP002",
        student_name: "Jane Smith",
        phone: "0987654321",
        email: "jane@example.com",
        course: "Information Technology",
        year: "2024",
        photo_url: "/placeholder-user.jpg",
        qr_code: "QR002",
        status: "active",
        schedule: "Evening Shift (2:00 PM - 8:00 PM)",
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    // Sample entry data
    const sampleEntries = [
      {
        student_id: "APP001",
        student_name: "John Doe",
        entry_time: new Date(),
        status: "entry",
        verified: true,
        verification_method: "qr_and_face",
        station_id: "main_entrance",
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    // Insert sample data
    const studentsResult = await db.collection("students").insertMany(sampleStudents)
    const entriesResult = await db.collection("entry_logs").insertMany(sampleEntries)

    return NextResponse.json({
      message: "Sample data inserted successfully",
      studentsInserted: studentsResult.insertedCount,
      entriesInserted: entriesResult.insertedCount
    })

  } catch (error) {
    console.error("Seed data error:", error)
    return NextResponse.json({ 
      error: "Failed to insert sample data",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
