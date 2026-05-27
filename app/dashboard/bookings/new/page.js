// Тиждень 12: Сторінка створення нового спа-бронювання (спрощена)
"use client";

import BookingForm from "@/components/BookingForm"; // Або OrderForm, залежно від твого неймінгу файлу

export default function NewBookingPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Лаконічний та преміальний заголовок сторінки */}
      <h1 className="text-3xl font-black text-gray-950 mb-6 tracking-tight">
        📅 Оформити новий спа-візит
      </h1>
      
      {/* Рендеримо інтелектуальну форму на базі React Hook Form */}
      <BookingForm />
    </div>
  );
}