'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const navLinks = [
  { href: '/', label: 'Головна' },
  { href: '/services', label: 'Послуги' }, // Зберегли твій роут послуг спа-салону
  { href: '/about', label: 'Про нас' },
  { href: '/contact', label: 'Контакти' },
]

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  return (
    <header className="bg-emerald-950 text-white py-4 border-b border-emerald-900 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="text-xl font-black hover:text-emerald-200 transition tracking-tight">
          Spa Oasis 🌿
        </Link>

        {/* Навігація та Стан Авторизації */}
        <nav className="flex items-center gap-6">
          <ul className="flex gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)

              return (
                <li key={link.href}>
                  <Link href={link.href}
                    className={`transition text-sm font-medium ${
                      isActive
                        ? 'text-emerald-300 font-bold'
                        : 'hover:text-emerald-200'
                    }`}>
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Розділювач */}
          <div className="w-[1px] h-5 bg-emerald-800 hidden sm:block"></div>

          {/* Блок автентифікації */}
          {status === 'loading' ? (
            <span className="text-emerald-300 text-sm animate-pulse">...</span>
          ) : session ? (
            <div className="flex items-center gap-4">
              {/* Посилання на адмінку з іменем користувача */}
              <Link href="/dashboard"
                className="text-emerald-200 hover:text-white text-sm font-semibold transition flex items-center gap-1">
                👤 {session.user.name}
              </Link>
              {/* Кнопка Виходу */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95"
              >
                Вийти
              </button>
            </div>
          ) : (
            /* Кнопка Входу */
            <Link href="/auth/login"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm block text-center"
            >
              Увійти
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}