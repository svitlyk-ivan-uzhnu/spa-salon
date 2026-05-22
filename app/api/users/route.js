// API для отримання списку користувачів Spa Oasis 🌿 (Доступно тільки для admin)

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { authorize } from "@/lib/authorize";

// GET /api/users — повертає список користувачів (тільки admin)
export async function GET() {
  // 🔐 Надійно перевіряємо, чи є користувач адміністратором
  const { session, error } = await authorize("admin");
  if (error) return error; // Якщо ні — автоматично поверне 401 або 403

  await dbConnect();

  // Отримуємо всіх користувачів із бази даних, обов'язково виключаючи поле з паролем (-password)
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 }); // Сортуємо: нові користувачі будуть вгорі списку

  return Response.json(users);
}