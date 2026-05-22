'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ServiceActions({ id }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔐 Перевірка: кнопки видно ТИЛЬКИ якщо роль користувача — "admin"
  const isAdmin = session?.user?.role === "admin";

  // Якщо користувач не адмін, компонент просто нічого не рендерить (повертає null)
  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (!confirm("Ви впевнені, що хочете видалити цю послугу?")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Помилка при видаленні");
      }

      alert("Послугу успішно видалено");
      router.refresh(); // Оновлюємо сторінку, щоб послуга зникла зі списку
    } catch (error) {
      alert(error.message || "Не вдалося видалити послугу");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {/* Кнопка Редагувати */}
      <Link 
        href={`/dashboard/services/${id}/edit`}
        className="text-xs px-3 py-1.5 font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
      >
        ✏️ Редагувати
      </Link>

      {/* Кнопка Видалити */}
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-xs px-3 py-1.5 font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
      >
        {isDeleting ? "..." : "🗑️ Видалити"}
      </button>
    </div>
  );
}