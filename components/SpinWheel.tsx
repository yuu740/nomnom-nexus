"use client";
import { useState } from "react";

// Data sementara (nanti akan diganti dari database)
const dummyFoods = ["Nasi Goreng", "Mie Ayam", "Pizza", "Burger", "Sate", "Salad"];
const colors = ["var(--color-biscuit)", "var(--color-biscuit-dark)"];

export default function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedFood(null);

    // Bikin putaran acak (minimal 5 putaran penuh + derajat acak)
    const randomDegree = Math.floor(Math.random() * 360) + 1800;
    const newRotation = rotation + randomDegree;
    setRotation(newRotation);

    // Tunggu animasi selesai (3 detik) baru munculkan hasil
    setTimeout(() => {
      setIsSpinning(false);
      
      // Logika matematika sederhana untuk menentukan makanan apa yang ditunjuk jarum
      const normalizedDegree = newRotation % 360;
      const sliceAngle = 360 / dummyFoods.length;
      // Karena jarum ada di atas (posisi 0 derajat), kita hitung mundur
      const winningIndex = Math.floor((360 - normalizedDegree + sliceAngle / 2) % 360 / sliceAngle);
      
      setSelectedFood(dummyFoods[winningIndex]);
    }, 3000);
  };

  // Membuat latar belakang potongan biskuit (conic gradient)
  const gradientSlices = dummyFoods.map((_, i) => {
    const startAngle = (360 / dummyFoods.length) * i;
    const endAngle = (360 / dummyFoods.length) * (i + 1);
    const color = colors[i % colors.length];
    return `${color} ${startAngle}deg ${endAngle}deg`;
  }).join(", ");

  return (
    <div className="flex flex-col items-center mt-8">
      {/* Jarum Penunjuk (Segitiga Cokelat) */}
      <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-biscuit-choco mb-[-10px] z-10"></div>

      {/* Roda Biskuit */}
      <div className="relative w-72 h-72 rounded-full border-8 border-biscuit-choco shadow-xl overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-[3000ms] ease-out"
          style={{
            background: `conic-gradient(${gradientSlices})`,
            transform: `rotate(${rotation}deg)`
          }}
        >
          {/* Teks di dalam Roda */}
          {dummyFoods.map((food, i) => {
            const angle = (360 / dummyFoods.length) * i + (360 / dummyFoods.length) / 2;
            return (
              <div
                key={i}
                className="absolute w-full h-full text-biscuit-choco font-extrabold text-sm flex justify-center pt-4"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <span className="max-w-[80px] text-center truncate">{food}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Putar */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className="mt-8 px-8 py-3 bg-biscuit-choco text-biscuit-light font-extrabold text-xl rounded-full shadow-lg hover:bg-opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
      >
        {isSpinning ? "Mengocok..." : "PUTAR!"}
      </button>

      {/* Hasil Makanan */}
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