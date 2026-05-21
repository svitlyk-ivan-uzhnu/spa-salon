import MenuFilter from "@/components/MenuFilter";

export default function ServicesPage() {
  return (
    <div>
      {/* Шапка сторінки послуг */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-12 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Наші спа-послуги</h1>
          <p className="text-lg opacity-90">Знайдіть свою ідеальну програму для релаксації та відновлення сил</p>
        </div>
      </section>

      {/* Секція з фільтрами та картками */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <MenuFilter />
        </div>
      </section>
    </div>
  );
}