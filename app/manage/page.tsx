import { prisma } from "../../lib/prisma";
import Link from "next/link";
import ExcelManager from "../../components/ExcelManager";
import FoodForm from "../../components/FoodForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DeleteFoodButton from "@/components/DeleteFoodButton";
import DeleteRestButton from "@/components/DeleteRestButton";
import { Fragment } from "react";
import EditFoodButton from "@/components/EditFoodButton";
import EditRestButton from "@/components/EditRestButton";

type Props = {
  searchParams: Promise<{
    q?: string;
    restTypes?: string | string[];
    foodTypes?: string | string[];
  }>;
};

export default async function ManagePage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = session.user.id;

  const params = await searchParams;
  const q = params?.q || "";

  // Normalisasi filter dari URL (bisa array atau string)
  let rFilters = params?.restTypes || [];
  if (typeof rFilters === "string") rFilters = [rFilters];
  let fFilters = params?.foodTypes || [];
  if (typeof fFilters === "string") fFilters = [fFilters];

  // 1. TAMBAHKAN 'distinct' AGAR TIPE YANG KEMBAR HANYA MUNCUL SATU KALI
  const allRestTypes = await prisma.restaurantType.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    distinct: ["name"], // <-- Mencegah duplikat kategori resto
  });
  const allFoodTypes = await prisma.foodType.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    distinct: ["name"], // <-- Mencegah duplikat kategori makanan
  });

  // Logika Filter Database
  const whereRest: any = { userId };
  if (rFilters.length > 0) whereRest.typeId = { in: rFilters };
  if (q) {
    whereRest.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { foods: { some: { name: { contains: q, mode: "insensitive" } } } },
    ];
  }

  // AMBIL DATA NESTED (RESTORAN BERSERTA MAKANANNYA)
  const restaurants = await prisma.restaurant.findMany({
    where: whereRest,
    include: {
      type: true,
      foods: {
        where: fFilters.length > 0 ? { typeId: { in: fFilters } } : {},
        include: { type: true },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const uniqueRestaurantsForForm = (restaurants as any[]).filter(
    (rest: any, index: number, self: any[]) =>
      index === self.findIndex((r: any) => r.name === rest.name),
  );

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
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

      {/* Form Input Terpisah */}
      <FoodForm
        restaurants={uniqueRestaurantsForForm}
        restaurantTypes={allRestTypes}
        foodTypes={allFoodTypes}
        // PERBAIKAN DI SINI: Tambahkan : any pada parameter r dan f
        allFoodsData={(restaurants as any[]).flatMap((r: any) =>
          r.foods.map((f: any) => ({ name: f.name, restaurantId: r.id })),
        )}
      />

      {/* Form Search & Checkbox Filter */}
      <form
        method="GET"
        className="mb-6 bg-white p-6 rounded-2xl shadow-md border-4 border-biscuit-dark"
      >
        <div className="mb-4">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="🔍 Cari nama restoran atau makanan..."
            className="w-full p-3 rounded-lg border-2 border-biscuit bg-biscuit-light focus:outline-none focus:border-biscuit-choco"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h3 className="font-bold text-biscuit-choco mb-2">
              Pilih Tipe Restoran:
            </h3>
            <div className="flex gap-4 flex-wrap max-h-32 overflow-y-auto">
              {allRestTypes.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="restTypes"
                    value={t.id}
                    defaultChecked={rFilters.includes(t.id)}
                    className="w-4 h-4 accent-biscuit-choco"
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-biscuit-choco mb-2">
              Pilih Tipe Makanan:
            </h3>
            <div className="flex gap-4 flex-wrap max-h-32 overflow-y-auto">
              {allFoodTypes.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="foodTypes"
                    value={t.id}
                    defaultChecked={fFilters.includes(t.id)}
                    className="w-4 h-4 accent-biscuit-choco"
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-biscuit-choco text-white font-bold rounded-lg shadow hover:opacity-90"
          >
            Terapkan Filter
          </button>
        </div>
      </form>

      {/* Tabel Nested View */}
      <div className="bg-white rounded-2xl shadow-md border-4 border-biscuit overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-biscuit-dark text-biscuit-light">
            <tr>
              <th className="p-4 font-bold w-1/2">Nama / Tempat</th>
              <th className="p-4 font-bold">Kategori</th>
              <th className="p-4 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-8 text-center opacity-50 font-bold"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              restaurants.map((rest) => (
                <Fragment key={rest.id}>
                  {/* BARIS RESTORAN (Induk) */}
                  <tr className="bg-biscuit-light border-y-2 border-biscuit">
                    <td className="p-4 font-extrabold text-biscuit-dark text-lg">
                      🏪 {rest.name}
                    </td>
                    <td className="p-4 font-bold text-biscuit-choco">
                      {rest.type ? rest.type.name : "-"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* TOMBOL EDIT RESTORAN */}
                        <EditRestButton rest={rest} types={allRestTypes} />
                        <DeleteRestButton id={rest.id} name={rest.name} />
                      </div>
                    </td>
                  </tr>

                  {/* BARIS MAKANAN (Anak) */}
                  {rest.foods.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-12 py-3 text-sm text-gray-400 italic"
                      >
                        Belum ada makanan tersimpan.
                      </td>
                    </tr>
                  ) : (
                    rest.foods.map((food) => (
                      <tr
                        key={food.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-3 pl-12 font-medium text-gray-700">
                          🍲 {food.name}
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {food.type ? food.type.name : "-"}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* TOMBOL EDIT MAKANAN */}
                            <EditFoodButton food={food} types={allFoodTypes} />
                            <DeleteFoodButton
                              id={food.id}
                              foodName={food.name}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
