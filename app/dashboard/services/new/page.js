// Тиждень 12: Сторінка створення нової спа-процедури (спрощена)
"use client";

import Link from "next/link";
import ServiceForm from "@/components/ServiceForm"; // Або DrinkForm, залежно від назви твого компонента

export default function NewServicePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Кнопка повернення до загального списку послуг */}
      <Link 
        href="/dashboard/services" 
        className="text-emerald-700 hover:text-emerald-900 font-medium mb-4 inline-flex items-center gap-1 transition"
      >
        ← Назад до каталогу процедур
      </Link>
      
      {/* Контейнер картки форми */}
      <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
        <h1 className="text-3xl font-black text-gray-950 mb-6 tracking-tight">
          ➕ Додати нову спа-процедуру
        </h1>
        
        {/* Рендеримо спрощену форму в режимі створення */}
        <ServiceForm mode="create" />
      </div>
    </div>
  );
}