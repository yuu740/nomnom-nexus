"use client";
import { useState } from "react";
import BiscuitModal from "./BiscuitModal";
import { deleteFoodData } from "../app/actions";

export default function DeleteFoodButton({
  id,
  foodName,
}: {
  id: string;
  foodName: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsModalOpen(false);
    await deleteFoodData(id);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded hover:bg-red-200 transition"
      >
        Hapus
      </button>
      <BiscuitModal
        isOpen={isModalOpen}
        type="confirm"
        title="Yakin hapus?"
        message={`Kamu akan menghapus "${foodName}" dari daftarmu.`}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
