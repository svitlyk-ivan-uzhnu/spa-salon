import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

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

    await dbConnect()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return Response.json(
        { error: 'Користувач з таким email вже існує' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return Response.json(
      {
        message: 'Реєстрація успішна',
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Помилка на бекенді реєстрації:", error)
    return Response.json(
      { error: `Помилка сервера: ${error.message || error}` },
      { status: 500 }
    )
  }
}