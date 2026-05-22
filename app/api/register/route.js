import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User"; // 👈 Скориговано шлях до твоєї моделі користувача
import { registerSchema } from "@/lib/validations/user";

// 📝 Санітизацію (stripHtml) закоментовано до виконання Наступного Кроку
import { stripHtml } from "@/lib/sanitize";

export async function POST(request) {
  try {
    await dbConnect();

    const data = await request.json();

    // 🛡️ Валідація через zod за допомогою safeParse()
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      // Збираємо всі помилки (наприклад: "Мінімум 6 символів", "Некоректний формат email") в один рядок
      const messages = result.error.errors.map((e) => e.message);
      return NextResponse.json(
        { error: messages.join(", ") },
        { status: 400 }
      );
    }

    // Zod гарантує, що email уже в нижньому регістрі та без зайвих пробілів по боках!
    const { email, password, name: rawName } = result.data;
    const name = stripHtml(result.data.name);

  

    // Перевірка унікальності email в базі даних
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Користувач з таким email вже існує" },
        { status: 409 }
      );
    }

    // Безпечно хешуємо пароль перед збереженням
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо нового користувача в MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Користувача успішно створено 🎉",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role, // за замовчуванням буде "user"
        },
      },
      { status: 201 }
    );
  } catch (error) {
    // Додатковий захист на випадок одночасних паралельних запитів (дублювання індексу в MongoDB)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Користувач з таким email вже існує" },
        { status: 409 }
      );
    }
    console.error("Помилка реєстрації:", error);
    return NextResponse.json(
      { error: "Внутрішня помилка сервера" },
      { status: 500 }
    );
  }
}