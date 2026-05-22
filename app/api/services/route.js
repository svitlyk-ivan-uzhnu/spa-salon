import dbConnect from '@/lib/db'
import Drink from '@/lib/models/Drink'

// 🌿 GET /api/services — Отримання всього списку для таблиці
export async function GET(request) {
  await dbConnect()

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const filter = {}
  if (category) {
    filter.category = category
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' }
  }

  // Отримуємо всі процедури з бази даних
  const drinks = await Drink.find(filter).sort({ createdAt: -1 })

  // ПОВЕРТАЄМО ЧИСТИЙ МАСИВ (щоб фронтенд не ламався)
  return Response.json(drinks)
}

// 🌿 POST /api/services — Створення нової послуги з форми
export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()
    const drink = await Drink.create(body)

    return Response.json(drink, { status: 201 })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return Response.json({ errors: messages }, { status: 400 })
    }

    return Response.json(
      { error: 'Помилка сервера' },
      { status: 500 }
    )
  }
}