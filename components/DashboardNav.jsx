'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

// Оновлений список посилань з двома сутностями для спа-салону
const links = [
  { href: "/dashboard", label: "Огляд" },
  { href: "/dashboard/services", label: "Послуги" }, // Додали /dashboard попереду!
  { href: "/dashboard/bookings", label: "Бронювання" }, 
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="space-y-2">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition-colors font-medium ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}