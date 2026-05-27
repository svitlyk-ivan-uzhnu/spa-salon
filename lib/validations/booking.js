import { z } from "zod";

// Регулярний вираз для суворої валідації MongoDB ObjectId (24 шістнадцяткові символи)
const objectIdSchema = z.string()
  .regex(/^[a-fA-F0-9]{24}$/, "Невалідний ідентифікатор ID");

// Схема для однієї обраної спа-послуги в масиві
const bookingItemInputSchema = z.object({
  service: objectIdSchema, // Перевіряємо ID конкретної послуги
  quantity: z.number().int().min(1, "Мінімум 1 особа").max(20, "Максимум 20 осіб"),
});

// 🟢 1. Схема для СТВОРЕННЯ нового бронювання (POST)
export const createBookingSchema = z.object({
  // Поле user опціональне: якщо запит від адміна — він може вказати клієнта вручну,
  // якщо від звичайного користувача — бекенд автоматично візьме ID з його сесії.
  user: objectIdSchema.optional(),
  
  items: z.array(bookingItemInputSchema)
    .min(1, "Бронювання має містити хоча б одну спа-послугу")
    .max(20, "Максимум 20 послуг в одному замовленні"),
    
  notes: z.string().max(300).trim().optional().default(""),
});

// 🟡 2. Схема для ОНОВЛЕННЯ бронювання адміністратором (PUT)
export const updateBookingSchema = z.object({
  status: z.enum(["pending", "in-progress", "done", "cancelled"]).optional(),
  notes: z.string().max(300).trim().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Немає даних для оновлення",
});

// 🔴 3. Схема для КЛІЄНТА (Користувач може самостійно лише скасувати своє замовлення)
export const userUpdateBookingSchema = z.object({
  status: z.literal("cancelled", {
    errorMap: () => ({ message: "Ви можете лише скасувати бронювання" }),
  }),
});