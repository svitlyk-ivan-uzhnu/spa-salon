// Тиждень 12: BookingForm на React Hook Form + useFieldArray + Zod + sonner
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

import { createBookingSchema } from "@/lib/validations/booking";

import FormField from "@/components/forms/FormField";

export default function BookingForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      user: "",
      items: [{ drink: "", quantity: 1 }], // Залишаємо назву поля drink, як у схемі бази даних
      notes: "",
    },
  });

  // Динамічний масив позицій для багатьох процедур за один візит
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // 1. Завантажуємо список доступних спа-процедур
  useEffect(() => {
    fetch("/api/services") // Або /api/drinks відповідно до твоїх роутів
      .then((res) => res.json())
      .then((data) => {
        setServices((data || []).filter((s) => s.available));
        setLoadingServices(false);
      })
      .catch(() => setLoadingServices(false));
  }, []);

  // 2. Для адміністратора завантажуємо список клієнтів салону
  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setUsers(data); });
  }, [isAdmin]);

  // 3. БЕЗПЕЧНЕ заповнення ID замовника (запобігає багу Cascading Renders з твоїх скриншотів)
  useEffect(() => {
    const currentId = session?.user?.id || session?.user?._id;
    if (isAdmin && currentId) {
      setValue("user", currentId);
    }
  }, [isAdmin, session, setValue]);

  // Хеш-мапа для миттєвого пошуку ціни процедури під час рендерингу
  const servicesById = useMemo(() => {
    const map = new Map();
    services.forEach((s) => map.set(s._id, map.get(s._id) || s));
    return map;
  }, [services]);

  // Живий підрахунок загальної вартості спа-дня
  const watchedItems = watch("items");
  const totalPrice = useMemo(() => {
    return (watchedItems || []).reduce((sum, item) => {
      const service = servicesById.get(item?.drink);
      if (!service) return sum;
      return sum + service.price * Number(item?.quantity || 0);
    }, 0);
  }, [watchedItems, servicesById]);

  const onSubmit = async (data) => {
    // Якщо оформлює звичайний користувач, поле замовника підставиться автоматично на бекенді з сесії
    const payload = isAdmin && data.user ? data : { ...data, user: undefined };
    
    try {
      const res = await fetch("/api/bookings", { // Або /api/orders
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(body.errors?.join(", ") || body.error || "Не вдалося оформити запис");
      
      toast.success("✨ Спа-візит успішно заброньовано!");
      router.push(`/dashboard/bookings/${body._id}`);
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loadingServices) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center text-gray-500 font-medium animate-pulse">
        🌿 Завантаження спа-меню та списку майстрів...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border shadow-sm">
      
      {/* Вибір клієнта (Доступно виключно Адміністратору) */}
      {isAdmin && (
        <FormField label="Гість салону (Замовник)" required error={errors.user?.message}>
          <select 
            {...register("user")} 
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 bg-white transition"
          >
            <option value="">Оберіть користувача з бази даних</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </FormField>
      )}

      {/* Блок вибору процедур */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-gray-800 font-bold text-sm tracking-wide">
            💆‍♂️ Обрані спа-процедури *
          </label>
          <button
            type="button"
            onClick={() => append({ drink: "", quantity: 1 })}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
          >
            ➕ Додати ще процедуру
          </button>
        </div>

        {/* Список обраних рядків послуг */}
        <div className="space-y-3">
          {fields.map((field, index) => {
            const itemErrors = errors.items?.[index];
            return (
              <div key={field.id} className="flex gap-3 items-start bg-slate-50/60 p-4 rounded-xl border border-gray-100 transition animate-fadeIn">
                
                {/* Селект процедури */}
                <div className="flex-1">
                  <select 
                    {...register(`items.${index}.drink`)} 
                    className={`w-full px-3 py-2 text-sm border bg-white rounded-lg focus:outline-none focus:border-emerald-500 transition ${
                      itemErrors?.drink ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Оберіть процедуру зі спа-меню</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>{s.emoji} {s.name} — {s.price} грн</option>
                    ))}
                  </select>
                  {itemErrors?.drink && (
                    <p className="text-xs text-red-600 font-medium mt-1">⚠️ {itemErrors.drink.message}</p>
                  )}
                </div>

                {/* Кількість людей / сеансів */}
                <div className="w-24">
                  <input
                    type="number" min={1} max={20}
                    placeholder="К-ть"
                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:border-emerald-500 text-center font-bold"
                  />
                </div>

                {/* Видалити рядок */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="text-gray-400 hover:text-rose-600 disabled:text-gray-200 font-bold text-xl px-2 pt-1 transition"
                  title="Видалити позицію"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Коментар до запису */}
      <FormField label="Особливі побажання майстру або протипоказання" error={errors.notes?.message}>
        <textarea 
          rows="3" 
          maxLength={300} 
          placeholder="Наприклад: алергія на олії, кабінет для пари, додаткові рушники..."
          {...register("notes")} 
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition" 
        />
      </FormField>

      {/* Блок фінального чеку */}
      {totalPrice > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 px-5 py-4 rounded-xl flex justify-between items-center transition animate-fadeIn">
          <span className="text-sm font-bold text-emerald-900">Загальна вартість візиту:</span>
          <span className="text-2xl font-black text-emerald-800">{totalPrice} грн</span>
        </div>
      )}

      {/* Кнопки збереження */}
      <div className="flex gap-4 border-t pt-5">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-emerald-700 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-800 font-bold disabled:opacity-50 transition shadow-sm text-sm"
        >
          {isSubmitting ? "Формування запису..." : "📋 Підтвердити бронювання"}
        </button>
        <Link 
          href="/dashboard/bookings" 
          className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 font-bold text-sm inline-block transition text-center"
        >
          Скасувати
        </Link>
      </div>
    </form>
  );
}