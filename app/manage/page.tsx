import { prisma } from "../../lib/prisma";
import Link from "next/link";
import ExcelManager from "../../components/ExcelManager";
import FoodForm from "../../components/FoodForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ q?: string; sort?: string }>;
};

export default async function ManagePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/login");
  }
  const userId = session.user.id;

  const params = await searchParams;
  const q = params?.q || "";
  const sort = params?.sort || "newest";

  // Ambil daftar tipe unik untuk dropdown form
  const restaurantTypes = await prisma.restaurantType.findMany({
    orderBy: { name: "asc" },
  });
  const foodTypes = await prisma.foodType.findMany({
    orderBy: { name: "asc" },
  });

  let orderByQuery: any = { createdAt: "desc" };
  if (sort === "oldest") orderByQuery = { createdAt: "asc" };
  if (sort === "az") orderByQuery = { name: "asc" };
  if (sort === "za") orderByQuery = { name: "desc" };

  const foods = await prisma.food.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { restaurant: { name: { contains: q, mode: "insensitive" } } },
        { type: { name: { contains: q, mode: "insensitive" } } }, // Cari berdasarkan tipe makanan juga
      ],
    },
    include: {
      restaurant: { include: { type: true } },
      type: true,
    },
    orderBy: orderByQuery,
  });

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold drop-shadow-sm">
          Atur Menu Makanan
        </h1>
        <Link
          href="/"
          className="px-4 py-2 bg-biscuit-dark text-biscuit-light rounded-lg font-bold hover:bg-biscuit-choco transition"
        >
          Kembali ke Roda
        </Link>
      </div>

      <ExcelManager />

      {/* Gunakan Komponen Form Baru */}
      <FoodForm restaurantTypes={restaurantTypes} foodTypes={foodTypes} />

      {/* Form Search & Sort */}
      <form
        method="GET"
        className="mb-6 flex gap-4 bg-biscuit-light p-4 rounded-xl border-2 border-biscuit"
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari makanan, restoran, atau tipe..."
          className="flex-1 p-2 rounded-lg border-2 border-biscuit bg-white"
        />
        <select
          name="sort"
          defaultValue={sort}
          className="p-2 rounded-lg border-2 border-biscuit bg-white font-medium"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-biscuit-dark text-biscuit-light font-bold rounded-lg shadow hover:bg-biscuit-choco transition"
        >
          Filter
        </button>
      </form>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-md border-4 border-biscuit overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-biscuit-dark text-biscuit-light">
            <tr>
              <th className="p-4 font-bold">Makanan (Tipe)</th>
              <th className="p-4 font-bold">Restoran (Tipe)</th>
            </tr>
          </thead>
          <tbody>
            {foods.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center py-8 opacity-50">
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              foods.map((food) => (
                <tr
                  key={food.id}
                  className="border-b border-biscuit-light hover:bg-biscuit-light transition"
                >
                  <td className="p-4 font-semibold text-biscuit-choco">
                    {food.name}{" "}
                    {food.type && (
                      <span className="text-xs bg-biscuit px-2 py-0.5 rounded-full ml-2 text-biscuit-choco font-bold">
                        {food.type.name}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {food.restaurant.name}{" "}
                    {food.restaurant.type && (
                      <span className="text-xs bg-biscuit-dark px-2 py-0.5 rounded-full ml-2 text-biscuit-light font-bold">
                        {food.restaurant.type.name}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
