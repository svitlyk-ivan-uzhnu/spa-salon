// Компонент Header – навігація сайту
// Тема: Спа-салон (Spa Oasis)
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-emerald-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold hover:text-emerald-200 transition flex items-center gap-2">
          Spa Oasis 🌿
        </Link>

        {/* Меню навігації */}
        <nav>
          <ul className="flex gap-6 font-medium">
            <li>
              <Link href="/" className="hover:text-emerald-200 transition">
                Головна
              </Link>
            </li>
            <li>
              <Link href="/menu" className="hover:text-emerald-200 transition">
                Послуги
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-200 transition">
                Про нас
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}