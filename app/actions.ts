"use server";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

// 1. TAMBAH RESTORAN SAJA
export async function addRestaurantOnly(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Akses ditolak");
  const userId = session.user.id;

  const name = formData.get("name") as string;
  const typeInput = formData.get("typeId") as string;
  const newType = formData.get("newType") as string;

  if (!name) return;

  // Proses Kategori Restoran
  let finalTypeId = null;
  const selectedType = typeInput === "other" ? newType : typeInput;
  if (selectedType && selectedType.trim() !== "") {
    let type = await prisma.restaurantType.findFirst({
      where: { name: selectedType.trim(), userId },
    });
    if (!type)
      type = await prisma.restaurantType.create({
        data: { name: selectedType.trim(), userId },
      });
    finalTypeId = type.id;
  }

  // 🛡️ CEK DUPLIKAT RESTORAN DI SINI
  const existingRest = await prisma.restaurant.findFirst({
    where: { name: name.trim(), userId }, // Cari apakah user ini sudah punya restoran dengan nama ini
  });

  if (existingRest) {
    // Jika sudah ada, jangan buat baru! Cukup update kategorinya saja.
    await prisma.restaurant.update({
      where: { id: existingRest.id },
      data: { typeId: finalTypeId || existingRest.typeId },
    });
  } else {
    // Jika benar-benar belum ada, baru buat restoran baru
    await prisma.restaurant.create({
      data: { name: name.trim(), typeId: finalTypeId, userId },
    });
  }

  revalidatePath("/manage");
  revalidatePath("/");
}

// 2. TAMBAH MAKANAN SAJA (Milih Restoran)
export async function addFoodOnly(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Akses ditolak");
  const userId = session.user.id;

  const restaurantId = formData.get("restaurantId") as string;
  const name = formData.get("name") as string;
  const typeInput = formData.get("typeId") as string;
  const newType = formData.get("newType") as string;

  if (!restaurantId || !name) return;

  // Proses Kategori Makanan
  let finalTypeId = null;
  const selectedType = typeInput === "other" ? newType : typeInput;
  if (selectedType && selectedType.trim() !== "") {
    let type = await prisma.foodType.findFirst({
      where: { name: selectedType.trim(), userId },
    });
    if (!type)
      type = await prisma.foodType.create({
        data: { name: selectedType.trim(), userId },
      });
    finalTypeId = type.id;
  }

  // 🛡️ CEK DUPLIKAT MAKANAN DI SINI
  const existingFood = await prisma.food.findFirst({
    where: { name: name.trim(), restaurantId }, // Cari apakah makanan ini sudah ada di restoran tersebut
  });

  if (existingFood) {
    // Jika makanan sudah ada di restoran itu, update saja kategorinya
    await prisma.food.update({
      where: { id: existingFood.id },
      data: { typeId: finalTypeId || existingFood.typeId },
    });
  } else {
    // Jika belum ada, tambahkan makanan baru
    await prisma.food.create({
      data: { name: name.trim(), restaurantId, typeId: finalTypeId },
    });
  }

  revalidatePath("/manage");
  revalidatePath("/");
}

// 5. FUNGSI EDIT RESTORAN
export async function editRestaurantData(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Akses ditolak");
  const userId = session.user.id;

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const typeInput = formData.get("typeInput") as string;
  const newType = formData.get("newType") as string;

  if (!id || !name) return;

  let finalTypeId = null;
  const selectedType = typeInput === "other" ? newType : typeInput;
  if (selectedType && selectedType.trim() !== "") {
    let type = await prisma.restaurantType.findFirst({
      where: { name: selectedType.trim(), userId },
    });
    if (!type)
      type = await prisma.restaurantType.create({
        data: { name: selectedType.trim(), userId },
      });
    finalTypeId = type.id;
  }

  // Gunakan updateMany untuk memastikan hanya user pemilik yang bisa mengubahnya
  await prisma.restaurant.updateMany({
    where: { id, userId },
    data: { name: name.trim(), typeId: finalTypeId },
  });

  revalidatePath("/manage");
  revalidatePath("/");
}

// 6. FUNGSI EDIT MAKANAN
export async function editFoodData(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Akses ditolak");
  const userId = session.user.id;

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const typeInput = formData.get("typeInput") as string;
  const newType = formData.get("newType") as string;

  if (!id || !name) return;

  let finalTypeId = null;
  const selectedType = typeInput === "other" ? newType : typeInput;
  if (selectedType && selectedType.trim() !== "") {
    let type = await prisma.foodType.findFirst({
      where: { name: selectedType.trim(), userId },
    });
    if (!type)
      type = await prisma.foodType.create({
        data: { name: selectedType.trim(), userId },
      });
    finalTypeId = type.id;
  }

  await prisma.food.updateMany({
    where: { id, restaurant: { userId } },
    data: { name: name.trim(), typeId: finalTypeId },
  });

  revalidatePath("/manage");
  revalidatePath("/");
}

// 3. FUNGSI HAPUS
export async function deleteFoodData(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Akses ditolak");
  await prisma.food.deleteMany({
    where: { id, restaurant: { userId: session.user.id } },
  });
  revalidatePath("/manage");
  revalidatePath("/");
}

export async function deleteRestaurantData(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Akses ditolak");
  await prisma.restaurant.deleteMany({
    where: { id, userId: session.user.id },
  });
  revalidatePath("/manage");
  revalidatePath("/");
}

export async function importExcelData(data: any[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Kamu harus login dulu!");
  const userId = session.user.id;

  for (const item of data) {
    if (!item.restaurantName || !item.foodName) continue;

    // 1. Proses Tipe Restoran
    let restTypeId = null;
    if (item.restaurantType) {
      let rType = await prisma.restaurantType.findFirst({
        where: { name: item.restaurantType, userId },
      });
      if (!rType)
        rType = await prisma.restaurantType.create({
          data: { name: item.restaurantType, userId },
        });
      restTypeId = rType.id;
    }

    // 2. Proses Tipe Makanan
    let foodTypeId = null;
    if (item.foodType) {
      let fType = await prisma.foodType.findFirst({
        where: { name: item.foodType, userId },
      });
      if (!fType)
        fType = await prisma.foodType.create({
          data: { name: item.foodType, userId },
        });
      foodTypeId = fType.id;
    }

    // 3. Proses Restoran & Makanan
    let restaurant = await prisma.restaurant.findFirst({
      where: { name: item.restaurantName, userId },
    });
    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: { name: item.restaurantName, userId, typeId: restTypeId },
      });
    }
    await prisma.food.create({
      data: {
        name: item.foodName,
        restaurantId: restaurant.id,
        typeId: foodTypeId,
      },
    });
  }
  revalidatePath("/manage");
  revalidatePath("/");
}
