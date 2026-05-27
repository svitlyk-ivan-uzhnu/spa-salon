

const STATUS_CONFIG = {
  pending:   { label: "⏳ Очікує",     classes: "bg-amber-50 text-amber-800 border-amber-200" },
  preparing: { label: "💆‍♂️ На процедурі", classes: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  ready:     { label: "✨ Завершено",  classes: "bg-teal-50 text-teal-900 border-teal-200" },
  completed: { label: "✅ Виконано",   classes: "bg-gray-100 text-gray-600 border-gray-200" },
  cancelled: { label: "❌ Скасовано",  classes: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function BookingStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    classes: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}