// Middleware для захисту маршрутів Spa Oasis 🌿
// Перехоплює запити до /dashboard/* і перевіряє JWT-токен сесії

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Отримуємо зашифрований JWT-токен із cookies браузера
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Якщо токена немає — робимо redirect на нашу кастомну сторінку логіну
  if (!token) {
    // ✅ Виправили шлях з "/login" на "/auth/login"
    const loginUrl = new URL("/auth/login", request.url);
    
    // Запам'ятовуємо URL, куди намагався зайти користувач, щоб повернути його туди після входу
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Токен валідний — користувач авторизований, пропускаємо його далі в адмінку
  return NextResponse.next();
}

// Конфігурація: вказуємо Next.js захищати всю панель керування і всі її підсторінки
export const config = {
  matcher: ["/dashboard/:path*"],
};