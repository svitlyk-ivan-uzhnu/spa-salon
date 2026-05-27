// components/ServiceActions.jsx або components/DrinkActions.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // ✨ 1. Імпортуємо глобальний toast з sonner

export default function ServiceActions({ serviceId }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false); // ✨ 2. Додаємо loading state для блокування кнопок

  const handleDelete = async () => {
    setLoading(true); // Включаємо індикатор завантаження
    try {
      const response = await fetch(`/api/services/${serviceId}`, { 
        method: "DELETE" 
      });
      
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Не вдалося видалити процедуру з бази даних");
      }
      
      // Повідомлення про успіх
      toast.success("✨ Спа-процедуру успішно видалено з каталогу");
      setShowConfirm(false);
      
      // Перенаправляємо менеджера назад до списку послуг
      router.push("/dashboard/services"); 
      router.refresh();
    } catch (error) {
      // Виводимо точну помилку у разі збою
      toast.error(error.message);
      setShowConfirm(false);
    } finally {
      setLoading(false); // Вимикаємо індикатор завантаження
    }
  };

  return (
    <div>
      {/* Кнопка, яка викликає модальне вікно підтвердження */}
      <button 
        onClick={() => setShowConfirm(true)}
        className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-lg text-sm font-semibold transition"
      >
        🗑️ Видалити процедуру
      </button>

      {/* Просте модальне вікно підтвердження (якщо воно активоване) */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full border shadow-lg">
            <h3 className="text-lg font-bold text-gray-950 mb-2">Підтвердження дії</h3>
            <p className="text-sm text-gray-500 mb-6">
              Ви впевнені, що хочете остаточно видалити цю процедуру зі спа-меню? Цю дію не можна буде скасувати.
            </p>
            
            <div className="flex justify-end gap-3">
              {/* Кнопка скасування */}
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50"
              >
                Ні
              </button>

              {/* Кнопка видалення із захистом від повторного кліку */}
              <button 
                onClick={handleDelete} 
                disabled={loading} 
                className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50 flex items-center gap-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Видалення...
                  </>
                ) : (
                  "Так, видалити"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}