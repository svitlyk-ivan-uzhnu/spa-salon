// Тиждень 9: Оновлений seed-скрипт для Spa Oasis 🌿
// Додано генерацію тестових користувачів з різними ролями (admin / user)

import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service"; // Твої послуги Спа
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await dbConnect();

    // 1. Очищення та наповнення послуг Спа (залиш свої існуючі послуги, якщо вони інші)
    await Service.deleteMany({});
    const services = await Service.insertMany([
      {
        title: "Класичний масаж тіла",
        description: "Розслабляючий масаж для зняття напруги в м'язах.",
        price: 800,
        duration: 60,
      },
      {
        title: "SPA-ритуал 'Кокосова насолода'",
        description: "Ніжний пілінг тіла та зволожуюче обгортання з ароматом кокоса.",
        price: 1200,
        duration: 90,
      }
    ]);

    // 2. Очищення та наповнення тестових користувачів
    await User.deleteMany({});
    
    // Хешуємо дефолтний пароль для безпеки
    const hashedPassword = await bcrypt.hash("password123", 10);

    const users = await User.insertMany([
      {
        name: "Адміністратор Спа",
        email: "admin@test.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Іван Клієнт",
        email: "user@test.com",
        password: hashedPassword,
        role: "user",
      },
    ]);

    // 3. Повертаємо красиву відповідь
    return Response.json({
      message: "🌱 Базу даних Spa Oasis успішно оновлено (Seed виконано)!",
      servicesCreated: services.length,
      usersCreated: users.length,
      testAccounts: [
        { email: "admin@test.com", password: "password123", role: "admin" },
        { email: "user@test.com", password: "password123", role: "user" },
      ],
    }, { status: 200 });

  } catch (error) {
    console.error("Помилка під час виконання seed:", error);
    return Response.json({ 
      error: "Помилка сервера під час заповнення бази даних", 
      details: error.message 
    }, { status: 500 });
  }
}