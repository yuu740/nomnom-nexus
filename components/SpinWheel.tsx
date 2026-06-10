"use client";
import { useState } from "react";

// Kita beri tahu komponen ini bahwa dia akan menerima "items" berupa array teks
interface SpinWheelProps {
  items: string[];
}

const colors = ["var(--color-biscuit)", "var(--color-biscuit-dark)"];

export default function SpinWheel({ items }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);

  // Jika database masih kosong, kita beri data bawaan agar roda tidak rusak
  const displayItems =
    items.length > 0 ? items : ["Kosong", "Tambah", "Menu", "Dulu", "Yuk!"];

  const spin = () => {
    if (isSpinning || items.length === 0) return;
    setIsSpinning(true);
    setSelectedFood(null);

    const randomDegree = Math.floor(Math.random() * 360) + 1800;
    const newRotation = rotation + randomDegree;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);

      const normalizedDegree = newRotation % 360;
      const sliceAngle = 360 / displayItems.length;
      const winningIndex = Math.floor(
        ((360 - normalizedDegree + sliceAngle / 2) % 360) / sliceAngle,
      );

      setSelectedFood(displayItems[winningIndex]);
    }, 3000);
  };

  const gradientSlices = displayItems
    .map((_, i) => {
      const startAngle = (360 / displayItems.length) * i;
      const endAngle = (360 / displayItems.length) * (i + 1);
      const color = colors[i % colors.length];
      return `${color} ${startAngle}deg ${endAngle}deg`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-biscuit-choco mb-[-10px] z-10"></div>

      <div className="relative w-72 h-72 rounded-full border-8 border-biscuit-choco shadow-xl overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-[3000ms] ease-out"
          style={{
            background: `conic-gradient(${gradientSlices})`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {displayItems.map((food, i) => {
            const angle =
              (360 / displayItems.length) * i + 360 / displayItems.length / 2;
            return (
              <div
                key={i}
                className="absolute w-full h-full text-biscuit-choco font-extrabold text-sm flex justify-center pt-4"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <span className="max-w-[80px] text-center truncate">
                  {food}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || items.length === 0}
        className="mt-8 px-8 py-3 bg-biscuit-choco text-biscuit-light font-extrabold text-xl rounded-full shadow-lg hover:bg-opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
      >
        {items.length === 0
          ? "Data Kosong!"
          : isSpinning
            ? "Mengocok..."
            : "PUTAR!"}
      </button>

      <div className="h-12 mt-6">
        {selectedFood && (
          <div className="text-3xl font-extrabold text-biscuit-choco animate-bounce bg-white px-6 py-2 rounded-xl shadow-md border-2 border-biscuit-dark">
            Makan {selectedFood} aja!
          </div>
        )}
      </div>
    </div>
  );
}
