export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center flex flex-col items-center">
        {/* Анімоване коло (спіннер) кольору нашого спа-салону */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-100 border-b-emerald-600 mb-4"></div>
        <p className="text-lg text-gray-500 font-medium tracking-wide">
          Завантаження найкращих процедур...
        </p>
      </div>
    </div>
  )
}