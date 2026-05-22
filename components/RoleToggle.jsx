"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoleToggle({ userId, currentRole, currentUserId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Не показуємо кнопку для самого себе
  if (userId === currentUserId) {
    return <span className="text-xs text-slate-400 font-medium italic">(це ви)</span>;
  }

  const newRole = currentRole === "admin" ? "user" : "admin";

  const handleToggle = async () => {
    if (!confirm(`Змінити роль на ${newRole}?`)) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Помилка зміни ролі");
        return;
      }

      router.refresh(); // Оновлюємо дані на сторінці
    } catch (error) {
      alert("Помилка з'єднання");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs px-2.5 py-1 rounded-md font-bold transition shadow-sm cursor-pointer disabled:opacity-50 ${
        newRole === "admin"
          ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
      }`}
    >
      {loading ? "..." : `→ ${newRole}`}
    </button>
  );
}