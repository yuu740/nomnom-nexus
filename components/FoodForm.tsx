"use client";
import { useState } from "react";
import { addFoodData } from "../app/actions";

interface FoodFormProps {
  restaurantTypes: { id: string; name: string }[];
  foodTypes: { id: string; name: string }[];
}

export default function FoodForm({
  restaurantTypes,
  foodTypes,
}: FoodFormProps) {
  const [restType, setRestType] = useState("");
  const [foodType, setFoodType] = useState("");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border-4 border-biscuit-dark mb-8">
      <h2 className="text-xl font-bold mb-4 text-biscuit-choco">
        Tambah Makanan Baru
      </h2>
      <form action={addFoodData} className="flex flex-col gap-4">
        <div className="flex gap-4 flex-wrap">
          {/* Input Nama Restoran */}
          <div className="flex-1 min-w-50">
            <label className="block text-sm font-bold mb-1">
              Nama Restoran
            </label>
            <input
              type="text"
              name="restaurantName"
              required
              placeholder="Misal: Warung Bu Ani"
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light"
            />
          </div>

          {/* Dropdown Tipe Restoran */}
          <div className="flex-1 min-w-50">
            <label className="block text-sm font-bold mb-1">
              Tipe Restoran
            </label>
            <select
              name="restaurantType"
              value={restType}
              onChange={(e) => setRestType(e.target.value)}
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light font-medium"
            >
              <option value="">-- Tanpa Tipe --</option>
              {restaurantTypes.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
              <option value="other">➕ Tambah Tipe Baru (Other)</option>
            </select>
            {restType === "other" && (
              <input
                type="text"
                name="newRestaurantType"
                required
                placeholder="Ketik tipe restoran baru..."
                className="w-full p-2 mt-2 border-2 border-biscuit-dark rounded-lg bg-white"
              />
            )}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          {/* Input Nama Makanan */}
          <div className="flex-1 min-w-50">
            <label className="block text-sm font-bold mb-1">Nama Makanan</label>
            <input
              type="text"
              name="foodName"
              required
              placeholder="Misal: Nasi Goreng Gila"
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light"
            />
          </div>

          {/* Dropdown Tipe Makanan */}
          <div className="flex-1 min-w-50">
            <label className="block text-sm font-bold mb-1">Tipe Makanan</label>
            <select
              name="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light font-medium"
            >
              <option value="">-- Tanpa Tipe --</option>
              {foodTypes.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
              <option value="other">➕ Tambah Tipe Baru (Other)</option>
            </select>
            {foodType === "other" && (
              <input
                type="text"
                name="newFoodType"
                required
                placeholder="Ketik tipe makanan baru..."
                className="w-full p-2 mt-2 border-2 border-biscuit-dark rounded-lg bg-white"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-2 bg-biscuit-choco text-biscuit-light font-bold rounded-xl shadow hover:opacity-90 transition text-lg"
        >
          🍪 Simpan Data Menu
        </button>
      </form>
    </div>
  );
}
