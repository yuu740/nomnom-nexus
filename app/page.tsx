import Link from "next/link";
import SpinWheel from "../components/SpinWheel";
import { prisma } from "../lib/prisma";

export default async function Home() {
  // Mengambil data makanan dari database
  const foods = await prisma.food.findMany({
    select: { name: true }, // Kita hanya butuh namanya saja untuk roda putar
  });

  // Mengubah bentuk datanya dari [{name: "A"}, {name: "B"}] menjadi ["A", "B"]
  const foodNames = foods.map((food) => food.name);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center overflow-hidden">
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
      <p className="text-lg max-w-md font-medium opacity-80 mb-4">
        Pusing mau makan apa? Biarkan roda biskuit ajaib ini yang memilihkan
        untukmu!
      </p>

      {/* Masukkan data asli ke dalam Roda Putar */}
      <SpinWheel items={foodNames} />

      <Link
        href="/manage"
        className="mt-12 text-biscuit-choco font-bold underline hover:text-biscuit-dark transition"
      >
        Atur Daftar Makanan
      </Link>
    </main>
  );
}
