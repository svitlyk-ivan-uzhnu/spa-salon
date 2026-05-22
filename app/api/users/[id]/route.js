import { Response } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateServiceSchema } from "@/lib/validations/service";
import { sanitizeObject } from "@/lib/sanitize"; // 👈 Імпортуємо санітизацію

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  await dbConnect();

  try {
    const { id } = await params;
    const data = await request.json();

    // 1. Валідація
    const result = updateServiceSchema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    // 2. 🧼 Санітизація
    const sanitizedData = sanitizeObject(result.data);

    // 3. Оновлення в БД
    const service = await Service.findByIdAndUpdate(id, sanitizedData, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return Response.json({ error: "Послугу не знайдено" }, { status: 404 });
    }

    return Response.json(service, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Помилка сервера" }, { status: 500 });
  }
}