// Тиждень 12: ServiceForm на React Hook Form + Zod resolver + sonner
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// Імпортуємо схему валідації (використовуємо твою схему з лінтингу)
import { createDrinkSchema } from "@/lib/validations/drink";
import FormField from "@/components/forms/FormField";

// Категорії адаптовані під спа-салон Spa Oasis
const CATEGORIES = ["Масаж", "Обличчя", "Тіло", "Догляд", "Інше"];

export default function ServiceForm({ mode = "create", initialData, serviceId }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createDrinkSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      category: initialData?.category ?? "",
      price: initialData?.price ?? 0,
      description: initialData?.description ?? "",
      emoji: initialData?.emoji ?? "🌿",
      available: initialData?.available ?? true,
    },
  });

  const onSubmit = async (data) => {
    // Якщо роути в лабі не мінялися, можна залишити /api/drinks, але для SPA краще /api/services
    const url = isEdit ? `/api/services/${serviceId}` : "/api/services";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.errors?.join(", ") || "Не вдалося зберегти процедуру");
      }
      toast.success(isEdit ? "✨ Зміни в процедурі збережено" : "✨ Нову спа-процедуру успішно додано");
      router.push(isEdit ? `/dashboard/services/${serviceId}` : "/dashboard/services");
      router.refresh();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl bg-white p-6 rounded-xl border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Поле: Назва процедури */}
        <FormField label="Назва спа-процедури" required error={errors.name?.message}>
          <input
            type="text"
            placeholder="напр., Аромамасаж"
            {...register("name")}
            className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 transition-colors ${
              errors.name ? "border-red-500 focus:border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>

        {/* Поле: Категорія */}
        <FormField label="Категорія догляду" required error={errors.category?.message}>
          <select
            {...register("category")}
            className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 bg-white transition-colors ${
              errors.category ? "border-red-500 focus:border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">Оберіть категорію</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </FormField>

        {/* Поле: Ціна */}
        <FormField label="Вартість сеансу (грн)" required error={errors.price?.message}>
          <input
            type="number"
            step="1"
            placeholder="0"
            {...register("price", { valueAsNumber: true })}
            className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 transition-colors ${
              errors.price ? "border-red-500 focus:border-red-500" : "border-gray-200"
            }`}
          />
        </FormField>

        {/* Поле: Емоджі */}
        <FormField label="Емоджі-іконка" error={errors.emoji?.message} hint="Один тематичний символ (напр. 💆‍♂️, 🌸, 🧼)">
          <input
            type="text"
            {...register("emoji")}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </FormField>
      </div>

      {/* Поле: Опис */}
      <FormField label="Детальний опис процедури та очікуваного ефекту" error={errors.description?.message}>
        <textarea
          rows="4"
          placeholder="Опишіть техніку виконання, тривалість або використовувану косметику..."
          {...register("description")}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </FormField>

      {/* Поле: Доступність */}
      <FormField>
        <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
          <input 
            type="checkbox" 
            {...register("available")} 
            className="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer" 
          />
          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
            Доступна для онлайн-запису клієнтами
          </span>
        </label>
      </FormField>

      {/* Кнопки керування формою */}
      <div className="flex gap-4 border-t pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-700 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-800 font-bold disabled:opacity-50 transition shadow-sm text-sm"
        >
          {isSubmitting ? "Збереження..." : isEdit ? "Зберегти зміни" : "Додати процедуру"}
        </button>
        <Link
          href={isEdit ? `/dashboard/services/${serviceId}` : "/dashboard/services"}
          className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 font-bold inline-block text-sm transition"
        >
          Скасувати
        </Link>
      </div>
    </form>
  );
}