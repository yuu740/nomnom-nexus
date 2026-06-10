import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { addFoodData } from "../actions";

export default async function ManagePage() {
  // Mengambil semua data makanan dari Neon Database
  const foods = await prisma.food.findMany({
    include: { restaurant: true }, // Ambil juga nama restorannya
    orderBy: { createdAt: "desc" }, // Urutkan dari yang terbaru
  });

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold drop-shadow-sm">Atur Menu Makanan</h1>
        <Link href="/" className="px-4 py-2 bg-biscuit-dark text-biscuit-light rounded-lg font-bold hover:bg-biscuit-choco transition">
          Kembali ke Roda
        </Link>
      </div>

      {/* Form Tambah Data */}
      <div className="bg-white p-6 rounded-2xl shadow-md border-4 border-biscuit-dark mb-8">
        <h2 className="text-xl font-bold mb-4 text-biscuit-choco">Tambah Makanan Baru</h2>
        <form action={addFoodData} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">Nama Restoran/Tempat</label>
            <input 
              type="text" 
              name="restaurantName" 
              required 
              placeholder="Misal: Warung Bu Ani"
              className="w-full p-2 border-2 border-biscuit rounded-lg focus:outline-none focus:border-biscuit-choco bg-biscuit-light"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">Nama Makanan</label>
            <input 
              type="text" 
              name="foodName" 
              required 
              placeholder="Misal: Nasi Goreng Gila"
              className="w-full p-2 border-2 border-biscuit rounded-lg focus:outline-none focus:border-biscuit-choco bg-biscuit-light"
            />
          </div>
          <button type="submit" className="px-6 py-2 h-[44px] bg-biscuit-choco text-biscuit-light font-bold rounded-lg shadow hover:opacity-90">
            Simpan
          </button>
        </form>
      </div>

      {/* Tabel Data View */}
      <div className="bg-white rounded-2xl shadow-md border-4 border-biscuit overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-biscuit-dark text-biscuit-light">
            <tr>
              <th className="p-4 font-bold">Nama Makanan</th>
              <th className="p-4 font-bold">Restoran</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center font-medium opacity-50">Belum ada makanan. Yuk tambah di atas!</td>
              </tr>
            ) : (
              foods.map((food) => (
                <tr key={food.id} className="border-b border-biscuit-light hover:bg-biscuit-light transition">
                  <td className="p-4 font-semibold text-biscuit-choco">{food.name}</td>
                  <td className="p-4">{food.restaurant.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}