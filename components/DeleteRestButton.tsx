"use client";
import { useState } from "react";
import BiscuitModal from "./BiscuitModal";
import { deleteRestaurantData } from "../app/actions";

export default function DeleteRestButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition"
      >
        Hapus Resto
      </button>
      <BiscuitModal
        isOpen={isModalOpen}
        type="confirm"
        title="Hapus Restoran?"
        message={`Menghapus "${name}" juga akan menghapus SEMUA makanannya. Yakin?`}
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          setIsModalOpen(false);
          await deleteRestaurantData(id);
        }}
      />
    </>
  );
}
