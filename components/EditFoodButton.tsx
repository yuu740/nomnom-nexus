"use client";
import { useState } from "react";
import { editFoodData } from "../app/actions";

export default function EditFoodButton({
  food,
  types,
}: {
  food: any;
  types: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(food.name);
  const [typeInput, setTypeInput] = useState(food.type ? food.type.name : "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("id", food.id);
    await editFoodData(formData);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded hover:bg-yellow-200 transition"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-biscuit-dark w-full max-w-sm text-left">
            <h3 className="text-lg font-bold text-biscuit-choco mb-4">
              Ubah Makanan
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light"
              />

              <select
                name="typeInput"
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                className="w-full p-2 border-2 border-biscuit rounded-lg bg-biscuit-light"
              >
                <option value="">-- Tanpa Kategori --</option>
                {types.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
                <option value="other">➕ Buat Kategori Baru</option>
              </select>
              {typeInput === "other" && (
                <input
                  type="text"
                  name="newType"
                  required
                  placeholder="Ketik kategori baru..."
                  className="w-full p-2 border-2 border-biscuit-dark rounded-lg"
                />
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-200 font-bold rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-biscuit-choco text-white font-bold rounded-lg hover:bg-opacity-90"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
