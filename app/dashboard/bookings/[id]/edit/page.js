// Тиждень 12: Редагування спа-візиту (адмін-панель) на React Hook Form + Zod + sonner
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import { updateOrderSchema } from "@/lib/validations/order"; // Твоя схема валідації для оновлення замовлень
import FormField from "@/components/forms/FormField";

// Статуси адаптовані під бізнес-процеси Spa Oasis
const STATUSES = [
  { value: "pending",   label: "⏳ Очікує підтвердження" },
  { value: "preparing", label: "💆‍♂️ На процедурі (Гість у кабінеті)" },
  { value: "ready",     label: "✨ Завершено (Очікує розрахунку)" },
  { value: "completed", label: "✅ Виконано та оплачено" },
  { value: "cancelled", label: "❌ Скасовано візит" },
];

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status: sessionStatus } = useSession();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ініціалізуємо React Hook Form з підключенням валідації Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: { status: "pending", notes: "" },
  });

  // Завантажуємо дані спа-візиту та безпечно оновлюємо форму через reset()
  useEffect(() => {
    fetch(`/api/bookings/${params.id}`) // Або /api/orders
      .then((res) => res.json())
      .then((data) => {
        if (data.error) { 
          setLoading(false); 
          return; 
        }
        setBooking(data);
        // Динамічно заповнюємо форму реальними даними з бази
        reset({ status: data.status, notes: data.notes || "" });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id, reset]);

  // Захист сторінки (Роутинг-гварди)
  if (sessionStatus === "loading" || loading) {
    return <div className="text-center py-12 text-gray-500 font-medium animate-pulse">🌿 Завантаження картки візиту...</div>;
  }
  if (session?.user?.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto bg-rose-50 border border-rose-200 p-5 rounded-xl text-rose-700 font-bold">
        🛑 Доступ обмежено: Керування статусами доступне виключно адміністрації Spa Oasis.
      </div>
    );
  }
  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 p-5 rounded-xl text-amber-700 font-bold">
        ⚠️ Запис на спа-процедуру не знайдено у базі даних.
      </div>
    );
  }

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/bookings/${params.id}`, { // Або /api/orders
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(body.errors?.join(", ") || body.error || "Не вдалося оновити статус");
      
      toast.success("✨ Статус спа-візиту успішно змінено");
      router.push(`/dashboard/bookings/${params.id}`);
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Кнопка повернення */}
      <Link 
        href={`/dashboard/bookings/${params.id}`} 
        className="text-emerald-700 hover:text-emerald-900 font-medium mb-4 inline-flex items-center gap-1 transition text-sm"
      >
        ← Назад до детальної інформації
      </Link>

      <div className="bg-white rounded-xl border shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-black text-gray-950 mb-1 tracking-tight">
          ⚙️ Керування спа-візитом
        </h1>
        <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-6">
          ID: {params.id}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Вибір статусу процедури за допомогою FormField */}
          <FormField label="Поточний статус клієнта" required error={errors.status?.message}>
            <select 
              {...register("status")} 
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white font-medium transition"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </FormField>

          {/* Внутрішній коментар менеджера */}
          <FormField label="Адміністративний коментар / внутрішні нотатки" error={errors.notes?.message}>
            <textarea 
              rows="3" 
              maxLength={300} 
              placeholder="Додайте важливі деталі (напр., Клієнт запізнюється на 10 хв, розрахунок сертифікатом)..."
              {...register("notes")} 
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition" 
            />
          </FormField>

          {/* Кнопки збереження змін */}
          <div className="flex gap-4 border-t pt-4 mt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-emerald-700 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-800 font-bold disabled:opacity-50 transition shadow-sm text-sm"
            >
              {isSubmitting ? "Збереження..." : "💾 Оновити картку візиту"}
            </button>
            <Link 
              href={`/dashboard/bookings/${params.id}`}
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 font-bold text-sm inline-block transition text-center"
            >
              Скасувати
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}