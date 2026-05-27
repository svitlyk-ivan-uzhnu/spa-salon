// Тиждень 11: Хелпер для збору глобальної статистики спа-салону
import dbConnect from "./db";           // Обов'язковий імпорт для підключення до MongoDB
import Booking from "@/lib/models/Booking";

/**
 * Рахує сумарні показники по всій колекції спа-бронювань (замовлень)
 * Використовує Promise.all для паралельного виконання запитів, що суттєво пришвидшує рендер сторінки.
 */
export async function getBookingStats() {
  await dbConnect();

  const [total, pending, preparing, ready, completed, cancelled] = await Promise.all([
    Booking.countDocuments({}),
    Booking.countDocuments({ status: "pending" }),    // Очікують підтвердження менеджером
    Booking.countDocuments({ status: "preparing" }),  // Гість зараз на процедурі
    Booking.countDocuments({ status: "ready" }),      // Процедуру завершено, очікує розрахунку
    Booking.countDocuments({ status: "completed" }),  // Успішно виконані візити
    Booking.countDocuments({ status: "cancelled" }),  // Скасовані записи
  ]);

  return { 
    total, 
    pending, 
    preparing, 
    ready, 
    completed, 
    cancelled 
  };
}


export { getBookingStats as getOrderStats };