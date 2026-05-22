/** @type {import('next').NextConfig} */
const nextConfig = {
  /* 🚨 Якщо у тебе тут уже записані налаштування images або щось інше, 
     просто залиш їх і додай блок headers через кому нижче! 
  */

  async headers() {
    return [
      {
        // Застосовуємо ці заголовки абсолютно до всіх сторінок та API роутів сайту
        source: "/(.*)",
        headers: [
          {
            // Захист від MIME-sniffing: забороняє браузеру виконувати файли, якщо їх тип не збігається з оголошеним
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Повністю захищає сайт від Clickjacking атак. Ніхто не зможе вбудувати твоє Спа в чужий iframe
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Вимикає застарілу та небезпечну вбудовану фільтрацію XSS браузера, оскільки ми використовуємо сучасний захист
            key: "X-XSS-Protection",
            value: "0",
          },
          {
            // Контролює, скільки інформації про джерело (referrer) передається під час переходів за посиланнями
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Обмежує доступ до заліза користувача. Нашому сайту Спа не потрібні камера, мікрофон та геолокація
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;