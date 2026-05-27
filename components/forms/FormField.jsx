// components/forms/FormField.jsx
"use client";

/**
 * Універсальний компонент-обгортка для полів форми (Патерн Render-children)
 * @param {string} label - Текст мітки для інпута
 * @param {string} error - Текст помилки валідації
 * @param {boolean} required - Чи є поле обов'язковим для заповнення (додає *)
 * @param {string} hint - Текст додаткової підказки під інпутом
 * @param {React.ReactNode} children - Сам елемент інпута, селекта або текстуареа
 */
export default function FormField({ label, error, required, hint, children }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 font-bold mb-2 text-sm tracking-wide">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Тут рендериться безпосередньо сам інпут, переданий ззовні */}
      {children}
      
      {/* Виводимо підказку тільки тоді, коли немає активної помилки */}
      {hint && !error && (
        <p className="text-xs text-emerald-700 font-medium mt-1.5 bg-emerald-50/50 px-2.5 py-1 rounded-md inline-block">
          💡 {hint}
        </p>
      )}
      
      {/* Якщо є помилка, виводимо її з відповідною роллю для доступності (accessibility) */}
      {error && (
        <p className="text-sm text-red-600 font-semibold mt-1.5 flex items-center gap-1" role="alert">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}