// Тиждень 12: Zod-схеми для auth-форм (login, register)
import { z } from "zod";

/**
 * Схема валідації форми входу (Login)
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email обов'язковий" })
    .min(1, "Email обов'язковий")
    .email("Некоректний формат email")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Пароль обов'язковий" })
    .min(1, "Пароль обов'язковий"),
});

/**
 * Схема валідації форми реєстрації нового гостя (Register)
 * confirmPassword — UI-only поле; на сервері воно ігнорується, але валідується на клієнті
 */
export const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Мінімум 2 символи")
      .max(50, "Максимум 50")
      .trim(),
    email: z
      .string()
      .min(1, "Email обов'язковий")
      .email("Некоректний формат email")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(6, "Мінімум 6 символів")
      .max(100, "Максимум 100"),
    confirmPassword: z
      .string()
      .min(1, "Повторіть пароль"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"], // Помилка підсвітить саме інпут підтвердження пароля
  });