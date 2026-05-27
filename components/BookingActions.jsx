// components/BookingActions.jsx або components/OrderActions.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // 🔔 Додаємо імпорт sonner

export default function BookingActions({ bookingId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 1. Функція ОСТАТОЧНОГО ВИДАЛЕННЯ запису з бази даних
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // ❌ Замість inline-плашки викликаємо toast.error
        toast.error(data.error || "Не вдалося видалити запис про візит");
        return;
      }

      // 🎉 Успішне видалення
      toast.success("✨ Запис про спа-візит успішно видалено з бази");
      setShowDeleteConfirm(false);
      router.push("/dashboard/bookings");
      router.refresh();
    } catch {
      toast.error("Технічна помилка при спробі видалення");
    } finally {
      setLoading(false);
    }
  };

  // 2. Функція СКАСУВАННЯ спа-візиту (зміна статусу на "cancelled")
  const handleCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }), // Передаємо статус скасування
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // ❌ Замість inline-плашки викликаємо toast.error
        toast.error(data.error || "Не вдалося скасувати бронювання");
        return;
      }

      // 🎉 Успішне скасування
      toast.success("❌ Спа-візит успішно скасовано");
      router.refresh(); // Оновлюємо дані на поточній сторінці, щоб статус змінився візуально
    } catch {
      toast.error("Технічна помилка при спробі скасування");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Кнопка швидкого скасування візиту */}
      <button
        onClick={handleCancel}
        disabled={loading}
        className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
      >
        {loading ? "Оновлення..." : "🚫 Скасувати візит"}
      </button>

      {/* Кнопка остаточного видалення */}
      <button
        onClick={() => setShowDeleteConfirm(true)}
        disabled={loading}
        className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
      >
        🗑️ Видалити з бази
      </button>

      {/* --- Модальне вікно підтвердження видалення --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full border shadow-lg">
            <h3 className="text-lg font-bold text-gray-950 mb-2">Остаточне видалення</h3>
            <p className="text-sm text-gray-500 mb-6">
              Ви дійсно хочете повністю видалити це замовлення з історії салону?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold transition"
              >
                Ні
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-rose-600 text-white hover:bg-rose-700 px-4 py-2 rounded-lg text-sm font-bold transition disabled:opacity-50"
              >
                {loading ? "Видалення..." : "Так, видалити"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}