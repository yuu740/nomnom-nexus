import Link from "next/link";
import { prisma } from "../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import GameRandomizer from "@/components/GameRandomizer";

type Props = {
  searchParams: Promise<{
    restTypes?: string | string[];
    foodTypes?: string | string[];
  }>;
};

export default async function Home({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-biscuit-light">
        <h1 className="text-5xl font-extrabold mb-4 text-biscuit-choco">
          NomNom Nexus
        </h1>
        <p className="text-lg font-medium text-biscuit-dark mb-8">
          Masuk untuk memutar roda ajaibmu!
        </p>
        <Link
          href="/login"
          className="px-8 py-3 bg-biscuit-choco text-white font-bold rounded-xl shadow-lg"
        >
          Masuk / Daftar
        </Link>
      </main>
    );
  }

  const userId = session.user.id;
  const params = await searchParams;

  let rFilters = params?.restTypes || [];
  if (typeof rFilters === "string") rFilters = [rFilters];
  let fFilters = params?.foodTypes || [];
  if (typeof fFilters === "string") fFilters = [fFilters];

  // TAMBAHKAN 'distinct' DI SINI JUGA
  const allRestTypes = await prisma.restaurantType.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    distinct: ["name"], // <-- Anti duplikat
  });
  const allFoodTypes = await prisma.foodType.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    distinct: ["name"], // <-- Anti duplikat
  });

  // Tarik data dengan filter
  const whereClause: any = { restaurant: { userId } };
  if (rFilters.length > 0) whereClause.restaurant.typeId = { in: rFilters };
  if (fFilters.length > 0) whereClause.typeId = { in: fFilters };

  const foods = await prisma.food.findMany({
    where: whereClause,
    include: { restaurant: true },
  });

  const groupedData: Record<string, string[]> = {};
  foods.forEach((food) => {
    const restName = food.restaurant.name;
    if (!groupedData[restName]) groupedData[restName] = [];
    groupedData[restName].push(food.name);
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center overflow-hidden">
      <h1 className="text-5xl font-extrabold mb-2 drop-shadow-sm mt-8">
        NomNom Nexus
      </h1>
      <p className="text-lg max-w-md font-medium opacity-80 mb-6">
        Pilih Mode Undianmu!
      </p>

      {/* FILTER BAR PAKE CHECKBOX */}
      <form
        method="GET"
        className="mb-4 flex flex-col items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border-4 border-biscuit-dark z-20 relative w-full max-w-xl"
      >
        <div className="flex flex-col md:flex-row w-full gap-4 text-left">
          <div className="flex-1 border-r-0 md:border-r-2 border-biscuit pr-4">
            <h3 className="text-xs font-bold text-biscuit-choco mb-2">
              Tipe Restoran:
            </h3>
            <div className="flex gap-2 flex-wrap max-h-20 overflow-y-auto">
              {allRestTypes.length === 0 ? (
                <span className="text-xs text-gray-400">Kosong</span>
              ) : (
                allRestTypes.map((t) => (
                  <label
                    key={t.id}
                    className="text-xs flex items-center gap-1 cursor-pointer bg-biscuit-light px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      name="restTypes"
                      value={t.id}
                      defaultChecked={rFilters.includes(t.id)}
                    />{" "}
                    {t.name}
                  </label>
                ))
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-biscuit-choco mb-2">
              Tipe Makanan:
            </h3>
            <div className="flex gap-2 flex-wrap max-h-20 overflow-y-auto">
              {allFoodTypes.length === 0 ? (
                <span className="text-xs text-gray-400">Kosong</span>
              ) : (
                allFoodTypes.map((t) => (
                  <label
                    key={t.id}
                    className="text-xs flex items-center gap-1 cursor-pointer bg-biscuit-light px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      name="foodTypes"
                      value={t.id}
                      defaultChecked={fFilters.includes(t.id)}
                    />{" "}
                    {t.name}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-biscuit-choco text-white text-sm font-bold rounded-lg w-full"
        >
          Terapkan Filter
        </button>
      </form>

      {/* Komponen Roda Putar Super */}
      <div className="-mt-2 w-full max-w-2xl">
        <GameRandomizer groupedData={groupedData} />
      </div>

      <div className="mt-8 mb-8 flex gap-4 z-20 relative">
        <Link
          href="/manage"
          className="px-6 py-2 bg-biscuit-dark text-white font-bold rounded-xl hover:bg-biscuit-choco transition"
        >
          Atur Menu Makanan
        </Link>
        <LogoutButton />
      </div>
    </main>
  );
}
