import { Response } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Booking from "@/lib/models/Booking";
import BookingItem from "@/lib/models/BookingItem";
import Service from "@/lib/models/Service";
import User from "@/lib/models/User";
import { createBookingSchema } from "@/lib/validations/booking";
import { sanitizeObject } from "@/lib/sanitize";

// Явна реєстрація моделей для уникнення помилок Mongoose під час Hot-Reload
void [User, Service, BookingItem];

// 🟢 GET: Отримання списку бронювань (Адмін бачить все, користувач — тільки свої)
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const service = searchParams.get("service");

  // Фільтрація: звичайний користувач бачить тільки свої записи
  const filter =
    session.user.role === "admin" ? {} : { user: session.user.id || session.user._id };

  if (status) filter.status = status;

  // Фільтр за конкретною послугою: шукаємо через BookingItem і витягуємо унікальні ID бронювань
  if (service) {
    const bookingIds = await BookingItem.find({ service }).distinct("booking");
    filter._id = { $in: bookingIds };
  }

  const bookings = await Booking.find(filter)
    .populate({ path: "user", select: "name email role" })
    .populate({
      path: "items",
      populate: { path: "service", select: "title price duration category" },
    })
    .sort({ createdAt: -1 });

  return Response.json(bookings);
}

// 🔵 POST: Створення нового бронювання з ручним Rollback
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Необхідна авторизація" }, { status: 401 });
  }

  await dbConnect();

  let createdBookingId = null;

  try {
    const data = await request.json();

    // 1. Валідація структури через Zod
    const result = createBookingSchema.safeParse(data);
    if (!result.success) {
      const messages = result.error.errors.map((e) => e.message);
      return Response.json({ errors: messages }, { status: 400 });
    }

    // 2. Санітизація від HTML-тегів
    const sanitized = sanitizeObject(result.data);

    // 3. Визначення власника бронювання
    let bookingUserId = session.user.id || session.user._id;
    if (session.user.role === "admin" && sanitized.user) {
      const targetUser = await User.findById(sanitized.user);
      if (!targetUser) {
        return Response.json({ error: "Користувача не знайдено" }, { status: 404 });
      }
      bookingUserId = targetUser._id;
    }

    // 4. Отримання інформації про всі обрані спа-послуги ОДНИМ запитом
    const serviceIds = sanitized.items.map((i) => i.service);
    const services = await Service.find({ _id: { $in: serviceIds } });

    // Створюємо мапу для швидкого пошуку об'єктів за ID
    const serviceById = new Map(services.map((s) => [s._id.toString(), s]));

    // 5. Перевірка існування та доступності спа-процедур
    for (const item of sanitized.items) {
      const srv = serviceById.get(item.service);
      if (!srv) {
        return Response.json({ error: `Спа-послугу не знайдено: ${item.service}` }, { status: 404 });
      }
      if (!srv.available) {
        return Response.json({ error: `Послуга зараз недоступна для запису: ${srv.title}` }, { status: 409 });
      }
    }

    // 6. Розрахунок вартості на сервері (Захист від підміни ціни з фронтенду)
    const totalPrice = sanitized.items.reduce((sum, item) => {
      const srv = serviceById.get(item.service);
      return sum + srv.price * item.quantity;
    }, 0);

    // 7. Створення головного документа Booking
    const booking = await Booking.create({
      user: bookingUserId,
      totalPrice,
      notes: sanitized.notes,
    });
    createdBookingId = booking._id;

    // 8. Пакетне створення BookingItem-ів (Знімок ціни на момент замовлення)
    const itemsToCreate = sanitized.items.map((item) => {
      const srv = serviceById.get(item.service);
      return {
        booking: booking._id,
        service: srv._id,
        quantity: item.quantity,
        priceAtBooking: srv.price,
      };
    });
    await BookingItem.insertMany(itemsToCreate);

    // 9. Повернення готового об'єкта з усіма підтягнутими зв'язками
    const populatedBooking = await Booking.findById(booking._id)
      .populate({ path: "user", select: "name email" })
      .populate({
        path: "items",
        populate: { path: "service", select: "title price duration category" },
      });

    return Response.json(populatedBooking, { status: 201 });

  } catch (err) {
    // 🚨 MANUAL ROLLBACK: Якщо впала генерація позицій, видаляємо головний чек, щоб уникнути сміття в базі
    if (createdBookingId) {
      try {
        await Booking.deleteOne({ _id: createdBookingId });
      } catch {
        // Best-effort — не перериваємо основну відповідь сервера помилки
      }
    }

    if (err.message === "Unexpected end of JSON input" || err instanceof SyntaxError) {
      return Response.json({ error: "Невалідний JSON у тілі запиту" }, { status: 400 });
    }
    
    console.error("Помилка створення бронювання:", err);
    return Response.json({ error: "Внутрішня помилка сервера" }, { status: 500 });
  }
}