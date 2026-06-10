"use server";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export async function addFoodData(formData: FormData) {
  // 1. Ambil sesi pengguna yang sedang login
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Kamu harus login dulu!");
  const userId = session.user.id;

  const restaurantName = formData.get("restaurantName") as string;
  const restaurantTypeInput = formData.get("restaurantType") as string;
  const newRestaurantType = formData.get("newRestaurantType") as string;

  const foodName = formData.get("foodName") as string;
  const foodTypeInput = formData.get("foodType") as string;
  const newFoodType = formData.get("newFoodType") as string;

  if (!restaurantName || !foodName) return;

  // GANTI SEMUA kata `user.id` di baris-baris bawah kode lamamu menjadi `userId`
  // Contoh:
  let finalRestTypeId: string | null = null;
  const selectedRestType =
    restaurantTypeInput === "other" ? newRestaurantType : restaurantTypeInput;

  if (selectedRestType && selectedRestType.trim() !== "") {
    let restType = await prisma.restaurantType.findFirst({
      where: { name: selectedRestType.trim(), userId: userId }, // <-- Ubah di sini
    });
    if (!restType) {
      restType = await prisma.restaurantType.create({
        data: { name: selectedRestType.trim(), userId: userId }, // <-- Ubah di sini
      });
    }
    finalRestTypeId = restType.id;
  }

  let restaurant = await prisma.restaurant.findFirst({
    where: { name: restaurantName.trim(), userId: userId }, // <-- Ubah di sini
  });

  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName.trim(),
        userId: userId,
        typeId: finalRestTypeId,
      }, // <-- Ubah di sini
    });
  } else if (finalRestTypeId) {
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { typeId: finalRestTypeId },
    });
  }

  let finalFoodTypeId: string | null = null;
  const selectedFoodType =
    foodTypeInput === "other" ? newFoodType : foodTypeInput;

  if (selectedFoodType && selectedFoodType.trim() !== "") {
    let fType = await prisma.foodType.findFirst({
      where: { name: selectedFoodType.trim(), userId: userId }, // <-- Ubah di sini
    });
    if (!fType) {
      fType = await prisma.foodType.create({
        data: { name: selectedFoodType.trim(), userId: userId }, // <-- Ubah di sini
      });
    }
    finalFoodTypeId = fType.id;
  }

  await prisma.food.create({
    data: {
      name: foodName.trim(),
      restaurantId: restaurant.id,
      typeId: finalFoodTypeId,
    },
  });

  revalidatePath("/manage");
  revalidatePath("/");
}

// LAKUKAN HAL YANG SAMA untuk fungsi importExcelData:
export async function importExcelData(data: any[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Kamu harus login dulu!");
  const userId = session.user.id;

  for (const item of data) {
    if (!item.restaurantName || !item.foodName) continue;
    let restaurant = await prisma.restaurant.findFirst({
      where: { name: item.restaurantName, userId: userId },
    });
    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: { name: item.restaurantName, userId: userId },
      });
    }
    await prisma.food.create({
      data: { name: item.foodName, restaurantId: restaurant.id },
    });
  }
  revalidatePath("/manage");
  revalidatePath("/");
}
