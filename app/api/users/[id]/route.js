import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function PUT(request, { params }) {
  try {
    // 1. Обов'язково спочатку чекаємо асинхронні params у Next.js 15
    const { id } = await params;

    // 2. Перевірка доступу (тільки admin)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Доступ заборонено" }, { status: 403 });
    }

    // 3. Безпечно читаємо JSON
    const bodyText = await request.text();
    if (!bodyText) {
      return Response.json({ error: "Порожнє тіло запиту" }, { status: 400 });
    }
    const { role } = JSON.parse(bodyText);

    // 4. Валідація ролі
    if (!["user", "admin"].includes(role)) {
      return Response.json(
        { error: "Роль має бути 'user' або 'admin'" },
        { status: 400 }
      );
    }

    // 5. Захист від самозміни
    if (id === session.user.id) {
      return Response.json(
        { error: "Не можна змінити власну роль!" },
        { status: 400 }
      );
    }

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return Response.json({ error: "Користувача не знайдено" }, { status: 404 });
    }

    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Помилка зміни ролі:", error);
    return Response.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}