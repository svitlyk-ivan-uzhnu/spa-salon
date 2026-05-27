// Тиждень 12: Сторінка редагування спа-процедури (спрощена)
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ServiceForm from "@/components/ServiceForm"; // Або DrinkForm, залежно від твого неймінгу

export default function EditServicePage() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // Завантажуємо поточні дані процедури з API для ініціалізації дефолтних значень у React Hook Form
    fetch(`/api/services/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Спа-процедуру не знайдено у каталозі салону");
        return res.json();
      })
      .then((data) => { 
        setService(data); 
        setLoading(false); 
      })
      .catch((err) => { 
        setLoadError(err.message); 
        setLoading(false); 
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl border p-8 shadow-sm space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-32 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 font-medium">
        ⚠️ {loadError}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Посилання назад на картку перегляду цієї процедури */}
      <Link 
        href={`/dashboard/services/${id}`} 
        className="text-emerald-700 hover:text-emerald-900 font-medium mb-4 inline-flex items-center gap-1 transition"
      >
        ← Назад до опису процедури
      </Link>
      
      {/* Картка форми редагування */}
      <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
        <h1 className="text-3xl font-black text-gray-950 mb-6 tracking-tight">
          ⚙️ Редагувати: <span className="text-emerald-800">{service?.emoji} {service?.name}</span>
        </h1>
        
        {/* Передаємо завантажені дані як initialData для автоматичного заповнення форми */}
        <ServiceForm mode="edit" serviceId={id} initialData={service} />
      </div>
    </div>
  );
}