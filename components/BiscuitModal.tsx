"use client";

interface ModalProps {
  isOpen: boolean;
  type: "success" | "error" | "confirm";
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void; // Khusus untuk tipe confirm
}

export default function BiscuitModal({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
}: ModalProps) {
  if (!isOpen) return null;

  const isError = type === "error";
  const isConfirm = type === "confirm";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm px-4">
      <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-biscuit-dark max-w-sm w-full text-center transform animate-bounce-short">
        <div
          className={`text-5xl mb-4 ${isError ? "text-red-500" : "text-biscuit-choco"}`}
        >
          {isError ? "😱" : isConfirm ? "🤔" : "🍪"}
        </div>
        <h3 className="text-xl font-extrabold text-biscuit-choco mb-2">
          {title}
        </h3>
        <p className="text-gray-600 font-medium text-sm mb-6">{message}</p>

        <div className="flex gap-2 justify-center">
          {isConfirm && (
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition"
            >
              Ya, Hapus
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-biscuit-choco text-biscuit-light font-bold rounded-xl hover:bg-opacity-90 transition"
          >
            {isConfirm ? "Batal" : "Oke, Tutup"}
          </button>
        </div>
      </div>
    </div>
  );
}
