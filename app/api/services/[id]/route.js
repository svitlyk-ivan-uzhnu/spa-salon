import { NextResponse } from 'next/server'
// Імпортуємо всі необхідні CRUD функції з нашого in-memory сховища
import { getDrinkById, updateDrink, deleteDrink } from '@/lib/services'

// ==========================================
// 1. GET — Отримання однієї процедури за ID
// ==========================================
export async function GET(request, { params }) {
  const { id } = await params
  const service = getDrinkById(id)

  if (!service) {
    return NextResponse.json(
      { error: 'Процедуру не знайдено в каталозі' },
      { status: 404 }
    )
  }

  return NextResponse.json(service)
}

// ==========================================
// 2. PUT — Оновлення даних процедури за ID
// ==========================================
export async function PUT(request, { params }) {
  const { id } = await params

  try {
    const body = await request.json()

    // Валідація обов'язкових для оновлення полів
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { error: "Поля 'name', 'category' та 'price' є обов'язковими для заповнення" },
        { status: 400 }
      )
    }

    // Валідація коректності ціни
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { error: 'Ціна має бути додатнім числовим значенням' },
        { status: 400 }
      )
    }

    // Оновлюємо дані у базі
    const updatedService = updateDrink(id, body)

    if (!updatedService) {
      return NextResponse.json(
        { error: 'Процедуру для оновлення не знайдено' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedService)
  } catch (error) {
    return NextResponse.json(
      { error: 'Невалідний або пошкоджений формат JSON' },
      { status: 400 }
    )
  }
}

// ==========================================
// 3. DELETE — Видалення процедури за ID
// ==========================================
export async function DELETE(request, { params }) {
  const { id } = await params

  const deletedService = deleteDrink(id)

  if (!deletedService) {
    return NextResponse.json(
      { error: 'Процедуру для видалення не знайдено' },
      { status: 404 }
    )
  }

  // Повертаємо підтвердження успішного видалення та сам видалений об'єкт
  return NextResponse.json({
    message: `Процедуру "${deletedService.name}" успішно видалено з бази даних Spa Oasis`,
    deleted: deletedService
  })
}