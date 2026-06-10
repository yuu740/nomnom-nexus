"use server";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function addFoodData(formData: FormData) {
  const restaurantName = formData.get("restaurantName") as string;
  const foodName = formData.get("foodName") as string;

  if (!restaurantName || !foodName) return;

  // SEMENTARA: Karena kita belum buat sistem Login (Google Auth),
  // kita buat satu 'Dummy User' otomatis agar database tidak error.
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: { email: "tester@nomnom.com" },
    });
  }

  // Cek apakah restoran sudah ada, jika belum, buat baru
  let restaurant = await prisma.restaurant.findFirst({
    where: { name: restaurantName, userId: user.id },
  });

  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: { name: restaurantName, userId: user.id },
    });
  }

  // Simpan makanannya dan hubungkan ke restoran tersebut
  await prisma.food.create({
    data: {
      name: foodName,
      restaurantId: restaurant.id,
    },
  });

  // Refresh halaman secara otomatis setelah data masuk
  revalidatePath("/manage");
}
