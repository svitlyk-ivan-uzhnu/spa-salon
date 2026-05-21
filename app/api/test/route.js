import { NextResponse } from 'next/server'

// Обробник для HTTP GET-запитів. Route Handlers завжди мають бути асинхронними (async).
export async function GET() {
  return NextResponse.json({
    message: "API працює! Салон краси та спа 'Spa Oasis'",
    status: "success",
    timestamp: new Date().toISOString()
  })
}