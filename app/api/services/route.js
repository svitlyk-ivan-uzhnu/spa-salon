import { Response } from "next/server";
import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServiceSchema } from "@/lib/validations/service";
import { sanitizeObject } from "@/lib/sanitize"; // 👈 Імпортуємо санітизацію

export async function GET() {
  await dbConnect();
  const services = await Service.find({}).sort({ createdAt: -1 });
  return Response.json(services);
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  await dbConnect();

  try {
    const data = await request.json();

    // 1. Валідація структури
    const result = createServiceSchema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    // 2. 🧼 Санітизація вмісту (очищення від тегів)
    const sanitizedData = sanitizeObject(result.data);

    // 3. Збереження чистого об'єкта в базу
    const service = await Service.create(sanitizedData);

    return Response.json(service, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Помилка сервера" }, { status: 500 });
  }
}