import { Response } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateServiceSchema } from "@/lib/validations/service";

export async function PUT(request, { params }) {
  // 1. Перевірка прав адміністратора
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  await dbConnect();

  try {
    // У Next.js 15 params є асинхронними, обов'язково робимо await
    const { id } = await params;
    const data = await request.json();

    // 🛡️ Валідація через Zod (всі поля необов'язкові завдяки .partial())
    const result = updateServiceSchema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    // Передаємо виключно result.data, відкидаючи будь-які ліві хакерські поля
    const service = await Service.findByIdAndUpdate(id, result.data, {
      new: true, // Повертає вже оновлений документ
      runValidators: true, // Вмикає додаткову перевірку на рівні схем Mongoose
    });

    if (!service) {
      return Response.json({ error: "Спа-послугу не знайдено" }, { status: 404 });
    }

    return Response.json(service, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}