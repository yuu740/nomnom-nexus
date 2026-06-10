"use client";
import { useState } from "react";

interface GameRandomizerProps {
  // Data sudah dikelompokkan: { namaRestoran: ["makanan1", "makanan2"] }
  groupedData: Record<string, string[]>;
}

export default function GameRandomizer({ groupedData }: GameRandomizerProps) {
  const restaurants = Object.keys(groupedData);
  const [mode, setMode] = useState<"wheel" | "gacha">("wheel");
  const [step, setStep] = useState<"restaurant" | "food">("restaurant");
  const [activeRest, setActiveRest] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // State untuk animasi Wheel
  const [rotation, setRotation] = useState(0);

  const getItems = () => {
    if (step === "restaurant")
      return restaurants.length > 0 ? restaurants : ["Kosong"];
    if (step === "food" && activeRest)
      return groupedData[activeRest] || ["Kosong"];
    return ["Kosong"];
  };

  const play = () => {
    const items = getItems();
    if (items.length === 0 || isAnimating) return;
    setIsAnimating(true);
    setResult(null);

    // Dapatkan index acak yang menang
    const winningIndex = Math.floor(Math.random() * items.length);
    const winner = items[winningIndex];

    if (mode === "wheel") {
      const sliceAngle = 360 / items.length;
      const targetDegree = 360 - winningIndex * sliceAngle; // Posisi jarum
      const newRotation = rotation + 1800 + targetDegree - (rotation % 360);
      setRotation(newRotation);
    }

    // Tunggu animasi (Wheel 3s, Gacha 2s)
    const delay = mode === "wheel" ? 3000 : 2000;
    setTimeout(() => {
      setIsAnimating(false);
      if (step === "restaurant") {
        setActiveRest(winner);
        setStep("food"); // Pindah tahap ke makanan
      } else {
        setResult(winner); // Hasil akhir makanan
      }
    }, delay);
  };

  const resetGame = () => {
    setStep("restaurant");
    setActiveRest(null);
    setResult(null);
  };

  const currentItems = getItems();
  const colors = ["var(--color-biscuit)", "var(--color-biscuit-dark)"];
  const gradientSlices = currentItems
    .map(
      (_, i) =>
        `${colors[i % 2]} ${(360 / currentItems.length) * i}deg ${(360 / currentItems.length) * (i + 1)}deg`,
    )
    .join(", ");

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Toggle Mode */}
      <div className="flex gap-2 mb-6 bg-biscuit-light p-1 rounded-full border-2 border-biscuit z-20 relative">
        <button
          onClick={() => setMode("wheel")}
          className={`px-4 py-1 font-bold rounded-full text-sm ${mode === "wheel" ? "bg-biscuit-choco text-white" : "text-biscuit-dark"}`}
        >
          🎡 Roda Putar
        </button>
        <button
          onClick={() => setMode("gacha")}
          className={`px-4 py-1 font-bold rounded-full text-sm ${mode === "gacha" ? "bg-biscuit-choco text-white" : "text-biscuit-dark"}`}
        >
          📦 Toples Misteri
        </button>
      </div>

      {/* Info Status (Langkah 1 atau 2) */}
      <h2 className="text-2xl font-extrabold text-biscuit-choco mb-4 z-20 relative drop-shadow-sm bg-white/80 px-4 py-1 rounded-full">
        {step === "restaurant"
          ? "🎯 Tahap 1: Pilih Restoran"
          : `🎯 Tahap 2: Makanan di ${activeRest}`}
      </h2>

      {/* RENDER MODE */}
      {mode === "wheel" ? (
        <div className="flex flex-col items-center">
          <div className="w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-t-30 border-t-biscuit-choco -mb-2.5 z-10"></div>
          <div className="relative w-72 h-72 rounded-full border-8 border-biscuit-choco shadow-xl overflow-hidden">
            <div
              className="w-full h-full transition-transform duration-3000 ease-out"
              style={{
                background: `conic-gradient(${gradientSlices})`,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {currentItems.map((item, i) => {
                const angle =
                  (360 / currentItems.length) * i +
                  360 / currentItems.length / 2;
                return (
                  <div
                    key={i}
                    className="absolute w-full h-full text-biscuit-choco font-extrabold text-xs flex justify-center pt-4"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <span className="max-w-20 text-center truncate bg-white/50 px-1 rounded">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-64 h-64 flex flex-col items-center justify-center relative">
          <div
            className={`text-9xl transition-transform duration-200 ${isAnimating ? "animate-shake scale-110" : ""}`}
          >
            {isAnimating ? "🫨" : result ? "🎉" : "🍪"}
          </div>
          {!isAnimating && !result && (
            <div className="mt-4 font-bold text-biscuit-dark">
              Tap Tombol Undi!
            </div>
          )}
        </div>
      )}

      {/* Tombol Aksi */}
      <div className="mt-8 flex gap-4 z-20 relative">
        <button
          onClick={play}
          disabled={isAnimating || currentItems.length === 0}
          className="px-8 py-3 bg-biscuit-choco text-white font-extrabold text-xl rounded-full shadow-lg hover:bg-opacity-80 disabled:opacity-50"
        >
          {isAnimating
            ? "Mengundi..."
            : step === "restaurant"
              ? "Undi Restoran!"
              : "Undi Makanan!"}
        </button>
        {step === "food" && !isAnimating && (
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-white text-biscuit-choco border-2 border-biscuit font-bold rounded-full hover:bg-biscuit-light"
          >
            Ulang dari Awal
          </button>
        )}
      </div>

      {/* Pesan Hasil Akhir (Jika sudah dapat makanan) */}
      <div className="h-16 mt-6 z-20 relative">
        {result && step === "food" && (
          <div className="text-2xl font-extrabold text-biscuit-choco animate-bounce bg-white px-6 py-3 rounded-2xl shadow-xl border-4 border-biscuit-dark">
            Selamat makan <span className="text-orange-500">{result}</span> dari{" "}
            <span className="text-orange-500">{activeRest}</span>!
          </div>
        )}
      </div>

      {/* Tambahkan Tailwind Custom Animation (Letakkan di globals.css nantinya: .animate-shake { animation: shake 0.5s infinite; } @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 50% { transform: translateX(5px) rotate(5deg); } 75% { transform: translateX(-5px) rotate(-5deg); } 100% { transform: translateX(0); } }) */}
    </div>
  );
}
