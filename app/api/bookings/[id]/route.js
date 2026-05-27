import { Response } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import BookingItem from "@/lib/models/BookingItem";
import Service from "@/lib/models/Service";
import User from "@/lib/models/User";
import {
  updateBookingSchema,
  userUpdateBookingSchema,
} from "@/lib/validations/booking";
import { sanitizeObject } from "@/lib/sanitize";

// Явна реєстрація моделей для populate() — рятує від збоїв Mongoose під час Hot-Reload
void [Service, User, BookingItem];

// 🟢 GET: Отримання деталей бронювання із захистом від IDOR
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;

  try {
    const booking = await Booking.findById(id)
      .populate({ path: "user", select: "name email role" })
      .populate({
        path: "items",
        populate: {
          path: "service",
          select: "title price duration category",
        },
      });

    if (!booking) {
      return Response.json({ error: "Бронювання не знайдено" }, { status: 404 });
    }

    // 🛡️ Перевірка власника (IDOR protection)
    const isOwner = booking.user?._id?.toString() === (session.user.id || session.user._id);
    if (session.user.role !== "admin" && !isOwner) {
      return Response.json({ error: "Доступ заборонено до чужих даних" }, { status: 403 });
    }

    return Response.json(booking, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Невалідний ідентифікатор ID" }, { status: 400 });
  }
}

// 🟡 PUT: Редагування статусу чи нотаток (Розподіл прав Клієнт / Адмін)
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return Response.json({ error: "Бронювання не знайдено" }, { status: 404 });
    }

    const isAdmin = session.user.role === "admin";
    const isOwner = booking.user.toString() === (session.user.id || session.user._id);

    // Дозволено змінювати тільки адміну або власнику картки
    if (!isAdmin && !isOwner) {
      return Response.json({ error: "У вас немає прав для зміни цього запису" }, { status: 403 });
    }

    const body = await request.json();

    // 🛡️ Динамічний вибір схеми Zod: адмін може все, юзер — тільки зняти заявку
    const schema = isAdmin ? updateBookingSchema : userUpdateBookingSchema;
    const result = schema.safeParse(body);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    // 🛑 Клієнт має право скасувати візит ТІЛЬКИ якщо він ще в статусі "pending"
    if (!isAdmin && booking.status !== "pending") {
      return Response.json(
        { error: "Скасувати запис можна лише на етапі очікування підтвердження (pending)" },
        { status: 409 }
      );
    }

    // Очищення рядків від HTML
    const sanitized = sanitizeObject(result.data);

    // Оновлюємо дані в базі
    const updatedBooking = await Booking.findByIdAndUpdate(id, sanitized, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "user", select: "name email" })
      .populate({
        path: "items",
        populate: { path: "service", select: "title price duration category" },
      });

    return Response.json(updatedBooking, { status: 200 });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return Response.json({ error: "Невалідний JSON у тілі запиту" }, { status: 400 });
    }
    return Response.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}

// 🔴 DELETE: Видалення бронювання (Тільки для адміністратора)
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Потрібні права адміністратора" }, { status: 403 });
  }

  await dbConnect();
  const { id } = await params;

  try {
    // 🔥 Виклик findByIdAndDelete автоматично запускає pre-hook у Booking.js!
    // Усі зв'язані сутності BookingItem будуть вичищені каскадом.
    const deleted = await Booking.findByIdAndDelete(id);
    if (!deleted) {
      return Response.json({ error: "Бронювання не знайдено" }, { status: 404 });
    }
    
    return Response.json({ message: "Бронювання та всі його позиції успішно видалено ✨" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Невалідний ідентифікатор ID" }, { status: 400 });
  }
}