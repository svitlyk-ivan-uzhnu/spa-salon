// Тиждень 12: RegisterForm на React Hook Form + Zod resolver + NextAuth auto-login + sonner
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import { registerFormSchema } from "@/lib/validations/auth";
import FormField from "@/components/forms/FormField";

export default function RegisterForm() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const body = await res.json().catch(() => ({}));

      // Обробка конфлікту, якщо email вже зареєстрований у базі MongoDB
      if (res.status === 409) {
        setError("email", { type: "server", message: body.error || "Цей Email вже зареєстрований у системі" });
        toast.error("Електронна адреса вже зайнята");
        return;
      }
      
      if (!res.ok) { 
        toast.error(body.error || "Не вдалося завершити реєстрацію"); 
        return; 
      }

      // 🔐 Автоматичний безшовний вхід після успішної реєстрації
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (signInResult?.error) {
        toast.warning("Акаунт створено успішно! Будь ласка, увійдіть вручну.");
        router.push("/login");
        return;
      }
      
      toast.success("✨ Вітаємо у клубі Spa Oasis! Акаунт створено.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Сталася технічна помилка при спробі реєстрації");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-transparent px-4 py-6">
      <div className="max-w-md w-full bg-white rounded-2xl border shadow-sm p-6 sm:p-8 animate-fadeIn">
        
        {/* Лого та заголовок */}
        <div className="text-center mb-6">
          <span className="text-3xl">🧘‍♂️</span>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight mt-2">
            Створити акаунт гостя
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Приєднуйтесь до Spa Oasis та бронюйте послуги онлайн
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Поле: Ім'я */}
          <FormField label="Ваше ім'я та прізвище" required error={errors.name?.message}>
            <input
              type="text"
              placeholder="Олена Ковальчук"
              {...register("name")}
              className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition ${
                errors.name ? "border-red-500 focus:ring-red-500/25" : "border-gray-200"
              }`}
            />
          </FormField>

          {/* Поле: Email */}
          <FormField label="Електронна пошта (Email)" required error={errors.email?.message}>
            <input
              type="email"
              placeholder="elena@example.com"
              {...register("email")}
              className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition ${
                errors.email ? "border-red-500 focus:ring-red-500/25" : "border-gray-200"
              }`}
            />
          </FormField>

          {/* Поле: Пароль */}
          <FormField label="Пароль" required error={errors.password?.message} hint="Мінімум 6 символів">
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition ${
                errors.password ? "border-red-500 focus:ring-red-500/25" : "border-gray-200"
              }`}
            />
          </FormField>

          {/* Поле: Підтвердження пароля */}
          <FormField label="Підтвердження пароля" required error={errors.confirmPassword?.message}>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition ${
                errors.confirmPassword ? "border-red-500 focus:ring-red-500/25" : "border-gray-200"
              }`}
            />
          </FormField>

          {/* Кнопка реєстрації */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-700 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-800 text-sm font-bold transition disabled:opacity-50 shadow-sm mt-2"
          >
            {isSubmitting ? "Реєстрація акаунту..." : "Зареєструватися"}
          </button>
        </form>

        {/* Перехід до форми входу */}
        <p className="mt-6 text-center text-sm text-gray-500 font-medium border-t pt-4 border-gray-50">
          Вже є акаунт гостя?{" "}
          <Link 
            href="/login" 
            className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline transition"
          >
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}