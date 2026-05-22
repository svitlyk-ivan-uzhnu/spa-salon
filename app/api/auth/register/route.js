import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Валідація
    if (!name || !email || !password) {
      return Response.json(
        { error: "Всі поля обов'язкові" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { error: 'Пароль має містити щонайменше 6 символів' },
        { status: 400 }
      )
    }

    // Підключаємось до бази даних
    await dbConnect()

    // Перевірка чи email вже зайнятий
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return Response.json(
        { error: 'Користувач з таким email вже існує' },
        { status: 409 }
      )
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 12)

    // Створюємо користувача
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return Response.json(
      {
        message: 'Реєстрація успішна',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Помилка реєстрації:", error)

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return Response.json(
        { error: messages.join(', ') },
        { status: 400 }
      )
    }

    return Response.json(
      { error: 'Помилка сервера під час реєстрації' },
      { status: 500 }
    )
  }
}