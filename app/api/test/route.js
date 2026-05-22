import dbConnect from '@/lib/db'

export async function GET() {
  try {
    // Пробуємо викликати наше підключення
    await dbConnect()

    // Якщо все супер, повертаємо успішну відповідь у форматі JSON
    return Response.json({
      message: 'MongoDB підключено! 🎉',
      status: 'ok',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    // Якщо пароль неправильний або IP заблоковано, ми побачимо причину тут
    return Response.json({
      message: 'Помилка підключення до MongoDB ❌',
      error: error.message,
    }, { status: 500 })
  }
}