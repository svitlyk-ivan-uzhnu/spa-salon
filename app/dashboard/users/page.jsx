import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import RoleToggle from "@/components/RoleToggle"; // 👈 Імпортуємо нашу кнопку
import ServiceActions from "@/components/ServiceActions";

export const metadata = {
  title: "Користувачі | Панель керування 🌿",
};

export default async function UsersPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/auth/login");
    }

    // Тимчасово відключено, щоб ти міг керувати навіть з роллю user
    /*
    if (session.user.role !== "admin") {
      redirect("/dashboard"); 
    }
    */

    await dbConnect();
    
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
{services.map((service) => (
  <tr key={service._id}>
    <td>{service.title}</td>
    <td>{service.price} грн</td>
    <td>
      {/* ПЕРЕДАЄМО ID ПОСЛУГИ В КОМПОНЕНТ ДІЙ */}
      <ServiceActions id={service._id.toString()} />
    </td>
  </tr>
))}
    return (
      <div className="p-6 max-w-6xl mx-auto text-gray-950">
        <h1 className="text-2xl font-black mb-6 text-gray-900 tracking-tight">
          Управління персоналом та користувачами
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead className="bg-emerald-950 text-white">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Ім&rsquo;я</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Email</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Роль</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Дата реєстрації</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Дії</th> {/* 👈 Додали шапку */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((user) => (
                <tr key={user._id.toString()} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full inline-block ${
                      user.role === "admin"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* 👈 Виводимо компонент перемикання ролі */}
                    <RoleToggle
                      userId={user._id.toString()}
                      currentRole={user.role}
                      currentUserId={session.user.id || session.user._id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500 bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold">
          Всього в базі: {users.length}
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className="p-6 m-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 font-bold">
        <h2 className="text-lg font-bold mb-2">💥 Помилка:</h2>
        <p className="font-mono text-sm bg-white p-3 rounded-lg border border-red-100">{err.message || String(err)}</p>
      </div>
    );
  }
}