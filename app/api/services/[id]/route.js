// Захист дій PUT та DELETE через authorize()

import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service"; // 💡 Використовуй свою модель (Service або Drink)
import { authorize } from "@/lib/authorize";

// GET — публічний (перегляд окремої послуги)
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const service = await Service.findById(id);

    if (!service) {
      return Response.json({ error: "Послугу не знайдено" }, { status: 404 });
    }

    return Response.json(service);
  } catch (error) {
    return Response.json({ error: "Невалідний ID" }, { status: 400 });
  }
}

// PUT — редагування послуги (ТІЛЬКИ ДЛЯ ADMIN)
export async function PUT(request, { params }) {
  // 🔐 Закриваємо доступ для сторонніх
  const { session, error } = await authorize("admin");
  if (error) return error;

  await dbConnect();
  const { id } = await params;

  try {
    const data = await request.json();
    const service = await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return Response.json({ error: "Послугу не знайдено" }, { status: 404 });
    }

    return Response.json(service);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    return Response.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

// DELETE — видалення послуги із бази даних (ТІЛЬКИ ДЛЯ ADMIN)
export async function DELETE(request, { params }) {
  // 🔐 Закриваємо доступ для сторонніх
  const { session, error } = await authorize("admin");
  if (error) return error;

  await dbConnect();
  const { id } = await params;

  try {
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return Response.json({ error: "Послугу не знайдено" }, { status: 404 });
    }

    return Response.json({ message: `Послугу "${service.name}" успішно видалено` });
  } catch (error) {
    return Response.json({ error: "Невалідний ID" }, { status: 400 });
  }
}