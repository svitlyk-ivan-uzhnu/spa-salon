import { z } from "zod";

// Схема для створення нової послуги (POST)
export const createServiceSchema = z.object({
  title: z
    .string({ required_error: "Назва послуги обов'язкова" })
    .min(3, "Назва має містити мінімум 3 символи")
    .max(100, "Максимум 100 символів")
    .trim(),
  
  description: z
    .string({ required_error: "Опис послуги обов'язковий" })
    .min(10, "Опис має бути детальнішим (мінімум 10 символів)")
    .max(1000, "Максимум 1000 символів")
    .trim(),
  
  price: z
    .number({
      required_error: "Ціна обов'язкова",
      invalid_type_error: "Ціна має бути числом",
    })
    .min(0, "Ціна не може бути від'ємною"),
  
  duration: z
    .number({
      required_error: "Тривалість обов'язкова",
      invalid_type_error: "Тривалість має бути числом (хвилини)",
    })
    .min(5, "Мінімальна тривалість — 5 хвилин")
    .max(480, "Максимальна тривалість — 8 годин (480 хвилин)"),

  category: z.enum(["Масаж", "Догляд за обличчям", "СПА-ритуали", "Лазня та сауна", "Інше"], {
    errorMap: () => ({
      message: "Оберіть правильну категорію спа-послуг",
    }),
  }),
  
  image: z.string().url("Посилання на картинку має бути коректним URL").optional().or(z.literal("")),
  available: z.boolean().optional().default(true),
});

// Схема для оновлення послуги (PUT) — робить усі поля необов'язковими за допомогою .partial()
export const updateServiceSchema = createServiceSchema.partial();