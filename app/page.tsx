import Link from "next/link";
import SpinWheel from "../components/SpinWheel";
import { prisma } from "../lib/prisma";

// Menangkap parameter dari URL untuk keperluan filter
type Props = {
  searchParams: Promise<{ restType?: string; foodType?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const selectedRestType = params?.restType || "";
  const selectedFoodType = params?.foodType || "";

  // 1. Ambil daftar tipe untuk mengisi pilihan dropdown
  const restaurantTypes = await prisma.restaurantType.findMany({
    orderBy: { name: "asc" },
  });
  const foodTypes = await prisma.foodType.findMany({
    orderBy: { name: "asc" },
  });

  // 2. Buat kondisi pencarian (where) berdasarkan filter yang dipilih pengguna
  const whereClause: any = {};

  if (selectedFoodType) {
    whereClause.typeId = selectedFoodType;
  }

  if (selectedRestType) {
    // Cari makanan yang restorannya memiliki typeId yang dipilih
    whereClause.restaurant = { typeId: selectedRestType };
  }

  // 3. Ambil data makanan sesuai kondisi filter
  const foods = await prisma.food.findMany({
    where: whereClause,
    select: { name: true },
  });

  const foodNames = foods.map((food) => food.name);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center overflow-hidden">
      {/* Logo */}
      <div className="flex gap-2 mb-4">
        <div className="w-12 h-16 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-3xl rounded-md shadow-md transform -rotate-6">
          N
        </div>
        <div className="w-12 h-16 bg-biscuit text-biscuit-choco flex items-center justify-center font-bold text-3xl rounded-md shadow-md z-10">
          N
        </div>
        <div className="w-12 h-16 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-3xl rounded-md shadow-md transform rotate-6">
          N
        </div>
      </div>

      <h1 className="text-5xl font-extrabold mb-2 drop-shadow-sm">
        NomNom Nexus
      </h1>
      <p className="text-lg max-w-md font-medium opacity-80 mb-6">
        Pusing mau makan apa? Biarkan roda biskuit ajaib ini yang memilihkan
        untukmu!
      </p>

      {/* FILTER BAR - Membungkus pilihan dalam sebuah form */}
      <form
        method="GET"
        className="mb-8 flex flex-wrap justify-center gap-4 bg-white p-4 rounded-2xl shadow-sm border-4 border-biscuit-dark z-20 relative"
      >
        <div className="flex flex-col text-left">
          <label className="text-xs font-bold text-biscuit-choco mb-1">
            Filter Tipe Restoran
          </label>
          <select
            name="restType"
            defaultValue={selectedRestType}
            className="p-2 border-2 border-biscuit rounded-lg bg-biscuit-light focus:outline-none focus:border-biscuit-choco text-sm font-medium min-w-[160px]"
          >
            <option value="">Semua Restoran</option>
            {restaurantTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col text-left">
          <label className="text-xs font-bold text-biscuit-choco mb-1">
            Filter Tipe Makanan
          </label>
          <select
            name="foodType"
            defaultValue={selectedFoodType}
            className="p-2 border-2 border-biscuit rounded-lg bg-biscuit-light focus:outline-none focus:border-biscuit-choco text-sm font-medium min-w-[160px]"
          >
            <option value="">Semua Makanan</option>
            {foodTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="px-6 py-2 h-[40px] bg-biscuit-choco text-biscuit-light font-bold rounded-lg shadow hover:opacity-90 transition"
          >
            Terapkan
          </button>
        </div>
      </form>

      {/* Roda Putar dengan data yang sudah terfilter */}
      <div className="-mt-4">
        <SpinWheel items={foodNames} />
      </div>

      <Link
        href="/manage"
        className="mt-12 text-biscuit-choco font-bold underline hover:text-biscuit-dark transition z-20 relative"
      >
        Atur Daftar Makanan
      </Link>
    </main>
  );
}
