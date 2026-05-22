import mongoose from 'mongoose'

// Забираємо наш секретний рядок підключення з файлу .env.local
const MONGODB_URI = process.env.MONGODB_URI

// Якщо ти забув створити файл або вписати туди ключ, Next.js одразу про це попередить
if (!MONGODB_URI) {
  throw new Error(
    'Будь ласка, додайте MONGODB_URI до файлу .env.local'
  )
}

// Кешування з'єднання для запобігання переповнення лімітів MongoDB підключень під час Hot Reload
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  // Якщо з'єднання вже є, просто повертаємо його
  if (cached.conn) {
    return cached.conn
  }

  // Якщо з'єднання ще немає, створюємо новий запит (promise)
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => mongoose)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect