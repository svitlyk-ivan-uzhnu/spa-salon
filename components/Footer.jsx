// Компонент Footer – підвал сайту
// Тема: Спа-салон (Spa Oasis)

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-emerald-800">
      <div className="container mx-auto px-4 text-center">
        {/* Назва салону */}
        <h3 className="text-xl font-semibold mb-2 text-emerald-400">
          Спа-салон «Spa Oasis»
        </h3>
        
        {/* Фейкова адреса для краси */}
        <p className="text-gray-400 mb-4 text-sm">
          вул.Тімірязева, 12, м. Ужгород
        </p>
        
        {/* Копірайт та інфо */}
        <p className="text-gray-500 text-sm">
          © 2026 Іван | Курс «Основи обробки та передачі інформації»
        </p>
      </div>
    </footer>
  );
}