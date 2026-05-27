// Тиждень 12: LoginForm на React Hook Form + Zod resolver + NextAuth signIn + sonner
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { loginSchema } from "@/lib/validations/auth";
import FormField from "@/components/forms/FormField";

export default function LoginForm() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      // Викликаємо провайдер аутентифікації NextAuth без примусового редіректу сторінки
      const result = await signIn("credentials", { ...data, redirect: false });
      
      if (result?.error) {
        // У разі помилки підсвічуємо поле паролю та виводимо повідомлення
        setError("password", { type: "server", message: "Невірний email або пароль" });
        toast.error("Не вдалося увійти в систему");
        return;
      }
      
      toast.success("🌿 Раді вітати вас у Spa Oasis!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Сталася непередбачувана помилка при вході");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-transparent px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border shadow-sm p-6 sm:p-8 animate-fadeIn">
        
        {/* Лого та заголовок */}
        <div className="text-center mb-6">
          <span className="text-3xl">🌿</span>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight mt-2">
            Вхід до кабінету
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Керуйте своїми спа-процедурами та бронюваннями
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле введення Email */}
          <FormField label="Електронна пошта (Email)" error={errors.email?.message}>
            <input
              type="email"
              autoComplete="email"
              placeholder="yourname@example.com"
              {...register("email")}
              className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition ${
                errors.email ? "border-red-500 focus:ring-red-500/25" : "border-gray-200"
              }`}
            />
          </FormField>

          {/* Поле введення Пароля */}
          <FormField label="Ваш пароль" error={errors.password?.message}>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition ${
                errors.password ? "border-red-500 focus:ring-red-500/25" : "border-gray-200"
              }`}
            />
          </FormField>

          {/* Кнопка відправки форми */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-700 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-800 text-sm font-bold transition disabled:opacity-50 shadow-sm mt-2"
          >
            {isSubmitting ? "Вхід до системи..." : "Увійти"}
          </button>
        </form>

        {/* Перехід до форми реєстрації */}
        <p className="mt-6 text-center text-sm text-gray-500 font-medium border-t pt-4 border-gray-50">
          Ще не маєте особистого кабінету?{" "}
          <Link 
            href="/register" 
            className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline transition"
          >
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}