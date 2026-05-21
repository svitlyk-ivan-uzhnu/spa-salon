import { NextResponse } from 'next/server'
// Імпортуємо наш масив та функцію додавання з нашої бази даних
import { drinks, addDrink } from '@/lib/services'

// ==========================================
// 1. GET /api/services — Отримання списку послуг із фільтрацією
// ==========================================
export async function GET(request) {
  // Розбираємо URL запиту для отримання query-параметрів
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  // Створюємо копію масиву, щоб не мутувати оригінальну базу при фільтрації
  let result = [...drinks]

  // Фільтрація за обраною категорією (наприклад: Масаж, Догляд, Водні)
  if (category && category !== 'Всі') {
    result = result.filter(item => item.category === category)
  }

  // Пошук за назвою процедури (чутливий до регістру літер завдяки .toLowerCase())
  if (search) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
  }

  return NextResponse.json(result)
}

// ==========================================
// 2. POST /api/services — Створення нової послуги
// ==========================================
export async function POST(request) {
  try {
    // Зчитуємо JSON-тіло, яке надіслав клієнт
    const body = await request.json()

    // Сценарій валідації обов'язкових полів
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { error: "Поля 'name', 'category' та 'price' є обов'язковими для заповнення" },
        { status: 400 }
      )
    }

    // Сценарій валідації коректності ціни
    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json(
        { error: 'Ціна процедури має бути додатнім числовим значенням' },
        { status: 400 }
      )
    }

    // Якщо валідація успішна — викликаємо нашу функцію з бази даних
    const newService = addDrink(body)
    
    // Повертаємо створений об'єкт зі статусом 201 (Created)
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    // Обробка випадку, якщо клієнт надіслав поламану структуру JSON запиту
    return NextResponse.json(
      { error: 'Невалідний або пошкоджений формат JSON' },
      { status: 400 }
    )
  }
}