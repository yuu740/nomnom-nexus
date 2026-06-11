"use client";
import { useState, useRef } from "react";
import { addRestaurantOnly, addFoodOnly } from "../app/actions";
import BiscuitModal from "./BiscuitModal";

interface Props {
  restaurants: { id: string; name: string }[];
  restaurantTypes: { id: string; name: string }[];
  foodTypes: { id: string; name: string }[];
  // Kita perlu menambahkan foods props untuk mengecek duplikat makanan
  allFoodsData?: { name: string; restaurantId: string }[];
}

export default function FoodForm({
  restaurants,
  restaurantTypes,
  foodTypes,
  allFoodsData = [], // Default empty array jika tidak di-pass
}: Props) {
  const [restType, setRestType] = useState("");
  const [foodType, setFoodType] = useState("");

  // State untuk Modal Peringatan Duplikat
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "" });

  const handleRestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. TANGKAP FORM-NYA KE VARIABEL DULU SEBELUM 'AWAIT'
    const form = e.currentTarget;
    const formData = new FormData(form);

    const nameInput = formData.get("name") as string;
    const newTypeInput = formData.get("newType") as string;

    // Cek Duplikat Nama Restoran
    const isRestDuplicate = restaurants.some(
      (r) => r.name.toLowerCase() === nameInput.toLowerCase().trim(),
    );
    if (isRestDuplicate) {
      setModal({
        isOpen: true,
        title: "Restoran Sudah Ada!",
        message: `Tempat bernama "${nameInput}" sudah terdaftar.`,
      });
      return;
    }

    // Cek Duplikat Tipe Restoran Baru
    if (restType === "other" && newTypeInput) {
      const isTypeDuplicate = restaurantTypes.some(
        (t) => t.name.toLowerCase() === newTypeInput.toLowerCase().trim(),
      );
      if (isTypeDuplicate) {
        setModal({
          isOpen: true,
          title: "Kategori Sudah Ada!",
          message: `Kategori restoran "${newTypeInput}" sudah ada di pilihan.`,
        });
        return;
      }
    }

    // Lanjut Simpan jika aman
    await addRestaurantOnly(formData);

    // 2. GUNAKAN VARIABEL YANG SUDAH DISIMPAN TADI UNTUK RESET
    form.reset();
    setRestType("");
  };

  const handleFoodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. TANGKAP FORM-NYA KE VARIABEL DULU SEBELUM 'AWAIT'
    const form = e.currentTarget;
    const formData = new FormData(form);

    const nameInput = formData.get("name") as string;
    const restIdInput = formData.get("restaurantId") as string;
    const newTypeInput = formData.get("newType") as string;

    // Cek Duplikat Makanan di Restoran yang Sama
    const isFoodDuplicate = allFoodsData.some(
      (f) =>
        f.name.toLowerCase() === nameInput.toLowerCase().trim() &&
        f.restaurantId === restIdInput,
    );
    if (isFoodDuplicate) {
      const restName = restaurants.find((r) => r.id === restIdInput)?.name;
      setModal({
        isOpen: true,
        title: "Makanan Sudah Ada!",
        message: `Menu "${nameInput}" sudah ada di ${restName}.`,
      });
      return;
    }

    // Cek Duplikat Tipe Makanan Baru
    if (foodType === "other" && newTypeInput) {
      const isTypeDuplicate = foodTypes.some(
        (t) => t.name.toLowerCase() === newTypeInput.toLowerCase().trim(),
      );
      if (isTypeDuplicate) {
        setModal({
          isOpen: true,
          title: "Kategori Sudah Ada!",
          message: `Kategori makanan "${newTypeInput}" sudah ada di pilihan.`,
        });
        return;
      }
    }

    // Lanjut Simpan jika aman
    await addFoodOnly(formData);

    // 2. GUNAKAN VARIABEL YANG SUDAH DISIMPAN TADI UNTUK RESET
    form.reset();
    setFoodType("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 relative">
      <BiscuitModal
        isOpen={modal.isOpen}
        type="error"
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />

      {/* KIRI: FORM RESTORAN */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md border-4 border-biscuit-dark">
        <h2 className="text-xl font-bold mb-4 text-biscuit-choco border-b-2 border-biscuit pb-2">
          1. Tambah Tempat / Restoran
        </h2>
        <form onSubmit={handleRestSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Nama Tempat</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Misal: HokBen"
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light focus:outline-none focus:border-biscuit-choco"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">
              Kategori Tempat
            </label>
            <select
              name="typeId"
              value={restType}
              onChange={(e) => setRestType(e.target.value)}
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light"
            >
              <option value="">-- Tanpa Kategori --</option>
              {restaurantTypes.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
              <option value="other">➕ Buat Kategori Baru</option>
            </select>
            {restType === "other" && (
              <input
                type="text"
                name="newType"
                required
                placeholder="Ketik kategori baru..."
                className="w-full p-2 mt-2 border-2 border-biscuit-dark rounded-lg bg-white"
              />
            )}
          </div>
          <button
            type="submit"
            className="mt-2 py-2 bg-biscuit-choco text-white font-bold rounded-xl shadow hover:opacity-90"
          >
            Simpan Tempat 🏪
          </button>
        </form>
      </div>

      {/* KANAN: FORM MAKANAN */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-md border-4 border-biscuit-dark">
        <h2 className="text-xl font-bold mb-4 text-biscuit-choco border-b-2 border-biscuit pb-2">
          2. Tambah Menu Makanan
        </h2>
        <form onSubmit={handleFoodSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Pilih Tempat</label>
            <select
              name="restaurantId"
              required
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light"
            >
              <option value="">-- Pilih Tempat Dulu --</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Nama Makanan</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Misal: Paket C"
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light focus:outline-none focus:border-biscuit-choco"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">
              Kategori Makanan
            </label>
            <select
              name="typeId"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light"
            >
              <option value="">-- Tanpa Kategori --</option>
              {foodTypes.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
              <option value="other">➕ Buat Kategori Baru</option>
            </select>
            {foodType === "other" && (
              <input
                type="text"
                name="newType"
                required
                placeholder="Ketik kategori baru..."
                className="w-full p-2 mt-2 border-2 border-biscuit-dark rounded-lg bg-white"
              />
            )}
          </div>
          <button
            type="submit"
            className="mt-2 py-2 bg-biscuit-choco text-white font-bold rounded-xl shadow hover:opacity-90"
          >
            Simpan Menu 🍲
          </button>
        </form>
      </div>
    </div>
  );
}
