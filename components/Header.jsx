'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

// Опис посилань як даних для нашого спа-салону
const navLinks = [
  { href: "/", label: "Головна" },
  { href: "/services", label: "Послуги" },
  { href: "/about", label: "Про нас" },
  { href: "/contact", label: "Контакти" },
  { href: "/dashboard", label: "⚙️ Адмінка" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-emerald-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold hover:text-emerald-200 transition flex items-center gap-2">
          Spa Oasis 🌿
        </Link>

        {/* Динамічна навігація */}
        <nav>
          <ul className="flex gap-6">
            {navLinks.map((link) => {
              // Логіка визначення активної сторінки
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`transition font-medium cursor-pointer ${
                      isActive
                        ? "text-emerald-300 font-bold border-b-2 border-emerald-300 pb-1"
                        : "hover:text-emerald-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}