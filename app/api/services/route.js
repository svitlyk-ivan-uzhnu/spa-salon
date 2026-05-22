// Захист API через authorize() для Spa Oasis 🌿

import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service"; // 💡 Використовуй свою модель (Service або Drink)
import { authorize } from "@/lib/authorize";

// GET — публічний (клієнти бачать послуги без авторизації)
export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const filter = {};

  if (category && category !== "Всі") {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const services = await Service.find(filter).sort({ createdAt: -1 });
  return Response.json(services);
}

// POST — створення нової послуги (ДОСТУПНО ТІЛЬКИ ДЛЯ ADMIN)
export async function POST(request) {
  // 🔐 Перевірка авторизації та ролі через наш хелпер
  const { session, error } = await authorize("admin");
  if (error) return error; // Якщо не адмін — автоматично поверне 401 або 403

  await dbConnect();

  try {
    const data = await request.json();
    const service = await Service.create(data);

    return Response.json(service, { status: 201 });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    return Response.json({ error: "Помилка сервера" }, { status: 500 });
  }
}