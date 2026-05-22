// Хелпер для перевірки авторизації в API Routes нашого Spa Oasis 🌿

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Перевіряє авторизацію користувача та його роль на рівні API
 * @param {string|null} requiredRole — необхідна роль (наприклад, 'admin', або null для будь-якого авторизованого)
 * @returns {{ session: object|null, error: Response|null }} — об'єкт з сесією або готова Response відповідь з помилкою
 */
export async function authorize(requiredRole = null) {
  const session = await getServerSession(authOptions);

  // 1. Перевірка: чи користувач взагалі залогінений
  if (!session) {
    return {
      session: null,
      error: Response.json(
        { error: "Необхідно увійти в систему" },
        { status: 401 }
      ),
    };
  }

  // 2. Перевірка ролі: якщо роль критична (наприклад, тільки для admin)
  if (requiredRole && session.user.role !== requiredRole) {
    return {
      session: null,
      error: Response.json(
        { error: `Доступ заборонено. Потрібна роль: ${requiredRole}` },
        { status: 403 }
      ),
    };
  }

  // Якщо все добре — повертаємо сесію для подальшого використання в роуті
  return { session, error: null };
}