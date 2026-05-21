'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Створення спа-послуги:", formData);
    // Програмна навігація: повертаємося до списку адмінки після додавання
    router.push("/dashboard/services");
  };

  return (
    <div>
      <Link href="/dashboard/services" className="text-emerald-700 hover:text-emerald-900 font-medium mb-4 inline-block">
        &larr; Назад до списку
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Додати нову спа-процедуру</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Назва процедури *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Категорія *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="напр. Масаж, Догляд"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Ціна (грн) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Детальний опис</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500 text-gray-900"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-800 transition cursor-pointer"
            >
              Створити
            </button>
            <Link
              href="/dashboard/services"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition inline-block"
            >
              Скасувати
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}