// Компонент DashboardNav — навігація для адміністративної панелі 🌿
// Тиждень 9: додано умовний пункт "Користувачі" тільки для admin

'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Перевіряємо, чи має поточний користувач роль адміна
  const isAdmin = session?.user?.role === "admin";

  // Динамічний масив посилань на основі структури Spa Oasis
  const links = [
    { href: "/dashboard", label: "Огляд" },
    { href: "/dashboard/services", label: "Послуги" },
    { href: "/dashboard/bookings", label: "Бронювання" },
    // Пункт "Користувачі" додається в масив тільки якщо isAdmin === true
    ...(isAdmin ? [{ href: "/dashboard/users", label: "Користувачі" }] : []),
  ];

  return (
    <nav className="p-2">
      <ul className="space-y-2">
        {links.map((link) => {
          // Точне визначення активного пункту меню
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-900 text-white font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                {link.href === "/dashboard/users" ? `👥 ${link.label}` : link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}