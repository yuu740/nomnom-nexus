"use server";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function addFoodData(formData: FormData) {
  const restaurantName = formData.get("restaurantName") as string;
  const restaurantTypeInput = formData.get("restaurantType") as string;
  const newRestaurantType = formData.get("newRestaurantType") as string;

  const foodName = formData.get("foodName") as string;
  const foodTypeInput = formData.get("foodType") as string;
  const newFoodType = formData.get("newFoodType") as string;

  if (!restaurantName || !foodName) return;

  // SEMENTARA: Gunakan dummy user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { email: "tester@nomnom.com" } });
  }

  // 1. Logika Tipe Restoran
  let finalRestTypeId: string | null = null;
  const selectedRestType =
    restaurantTypeInput === "other" ? newRestaurantType : restaurantTypeInput;

  if (selectedRestType && selectedRestType.trim() !== "") {
    let restType = await prisma.restaurantType.findFirst({
      where: { name: selectedRestType.trim(), userId: user.id },
    });
    if (!restType) {
      restType = await prisma.restaurantType.create({
        data: { name: selectedRestType.trim(), userId: user.id },
      });
    }
    finalRestTypeId = restType.id;
  }

  // 2. Cari atau Buat Restoran
  let restaurant = await prisma.restaurant.findFirst({
    where: { name: restaurantName.trim(), userId: user.id },
  });

  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName.trim(),
        userId: user.id,
        typeId: finalRestTypeId,
      },
    });
  } else if (finalRestTypeId) {
    // Update tipe jika restoran lama belum punya tipe
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { typeId: finalRestTypeId },
    });
  }

  // 3. Logika Tipe Makanan
  let finalFoodTypeId: string | null = null;
  const selectedFoodType =
    foodTypeInput === "other" ? newFoodType : foodTypeInput;

  if (selectedFoodType && selectedFoodType.trim() !== "") {
    let fType = await prisma.foodType.findFirst({
      where: { name: selectedFoodType.trim(), userId: user.id },
    });
    if (!fType) {
      fType = await prisma.foodType.create({
        data: { name: selectedFoodType.trim(), userId: user.id },
      });
    }
    finalFoodTypeId = fType.id;
  }

  // 4. Simpan Makanan
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

// Fungsi Import Excel disesuaikan agar menerima kolom tipe (opsional)
export async function importExcelData(data: any[]) {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { email: "tester@nomnom.com" } });
  }

  for (const item of data) {
    if (!item.restaurantName || !item.foodName) continue;

    // Cari/Buat Restoran
    let restaurant = await prisma.restaurant.findFirst({
      where: { name: item.restaurantName, userId: user.id },
    });
    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: { name: item.restaurantName, userId: user.id },
      });
    }

    // Masukkan makanannya
    await prisma.food.create({
      data: {
        name: item.foodName,
        restaurantId: restaurant.id,
      },
    });
  }

  revalidatePath("/manage");
  revalidatePath("/");
}
