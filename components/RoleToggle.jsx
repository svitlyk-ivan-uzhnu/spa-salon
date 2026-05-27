// components/RoleToggle.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // 🔔 Додаємо імпорт sonner для преміальних сповіщень

export default function RoleToggle({ userId, currentRole }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // ❌ Замість застарілого alert() викликаємо красивий тоаст помилки
        toast.error(data.error || "Не вдалося змінити статус доступу");
        return;
      }

      // 🎉 Успішно змінено — показуємо красиве сповіщення
      toast.success(`✨ Права доступу оновлено на: ${newRole === "admin" ? "Адміністратор 👑" : "Гість 👤"}`);
      router.refresh(); // Оновлюємо серверні дані на сторінці
    } catch {
      // ❌ Обробка помилки мережі
      toast.error("⚠️ Помилка з'єднання з сервером MongoDB");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 ${
        currentRole === "admin"
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
      }`}
    >
      {loading ? (
        <span>Оновлення...</span>
      ) : (
        <>
          {currentRole === "admin" ? "👑 Понизити до Гостя" : "✨ Зробити Адміном"}
        </>
      )}
    </button>
  );
}