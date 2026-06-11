"use client";
import { useState } from "react";

interface GameRandomizerProps {
  groupedData: Record<string, string[]>;
}

export default function GameRandomizer({ groupedData }: GameRandomizerProps) {
  const restaurants = Object.keys(groupedData);

  // State untuk 3 METODE UNDIAN
  const [flowMode, setFlowMode] = useState<
    "resto-food" | "resto-only" | "food-only"
  >("resto-food");

  const [visualMode, setVisualMode] = useState<"wheel" | "gacha">("wheel");
  const [step, setStep] = useState<"restaurant" | "food" | "done">(
    "restaurant",
  );
  const [activeRest, setActiveRest] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Menentukan apa yang dimasukkan ke dalam Roda
  const getItems = () => {
    if (flowMode === "food-only") {
      // Gabungkan semua makanan beserta nama restorannya
      const allFoods: string[] = [];
      Object.entries(groupedData).forEach(([resto, foods]) => {
        foods.forEach((f) => allFoods.push(`${f} (${resto})`));
      });
      return allFoods.length > 0 ? allFoods : ["Kosong"];
    }

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

    const winningIndex = Math.floor(Math.random() * items.length);
    const winner = items[winningIndex];

    if (visualMode === "wheel") {
      const sliceAngle = 360 / items.length;
      const targetDegree = 360 - winningIndex * sliceAngle;
      const newRotation = rotation + 1800 + targetDegree - (rotation % 360);
      setRotation(newRotation);
    }

    const delay = visualMode === "wheel" ? 3000 : 2000;
    setTimeout(() => {
      setIsAnimating(false);

      if (flowMode === "resto-only") {
        setResult(`Makan di ${winner}!`);
        setStep("done");
      } else if (flowMode === "food-only") {
        setResult(winner);
        setStep("done");
      } else {
        // Alur Resto -> Food
        if (step === "restaurant") {
          setActiveRest(winner);
          setStep("food");
        } else {
          setResult(winner);
          setStep("done");
        }
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
    <div className="flex flex-col items-center mt-4 bg-white p-6 rounded-3xl shadow-lg border-4 border-biscuit w-full">
      {/* Pengaturan 3 Mode Undian */}
      <div className="w-full mb-6 text-left border-b-2 border-biscuit-light pb-4 z-20 relative">
        <h3 className="font-bold text-biscuit-choco mb-2 text-sm">
          Metode Undian:
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input
              type="radio"
              name="flow"
              checked={flowMode === "resto-food"}
              onChange={() => {
                setFlowMode("resto-food");
                resetGame();
              }}
              className="accent-biscuit-choco"
            />
            1. Undi Restoran ➡️ Undi Makanan
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input
              type="radio"
              name="flow"
              checked={flowMode === "resto-only"}
              onChange={() => {
                setFlowMode("resto-only");
                resetGame();
              }}
              className="accent-biscuit-choco"
            />
            2. Undi Restoran Saja
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input
              type="radio"
              name="flow"
              checked={flowMode === "food-only"}
              onChange={() => {
                setFlowMode("food-only");
                resetGame();
              }}
              className="accent-biscuit-choco"
            />
            3. Langsung Undi Makanan
          </label>
        </div>
      </div>

      {/* Info Tahapan Aktif */}
      <h2 className="text-xl font-extrabold text-biscuit-choco mb-4 z-20 relative bg-biscuit-light px-6 py-1 rounded-full border-2 border-biscuit">
        {step === "restaurant"
          ? "🎯 Memilih Restoran"
          : step === "food"
            ? `🎯 Makanan dari ${activeRest}`
            : "🎉 Hasil Undian 🎉"}
      </h2>

      {/* Roda Putar Visual */}
      <div className="flex flex-col items-center relative z-10">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-biscuit-choco -mb-[10px] z-10"></div>
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-biscuit-choco shadow-xl overflow-hidden">
          <div
            className="w-full h-full transition-transform duration-[3000ms] ease-out"
            style={{
              background: `conic-gradient(${gradientSlices})`,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {currentItems.map((item, i) => {
              const angle =
                (360 / currentItems.length) * i + 360 / currentItems.length / 2;
              return (
                <div
                  key={i}
                  className="absolute w-full h-full text-biscuit-choco font-extrabold text-xs md:text-sm flex justify-center pt-4"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span className="max-w-[80px] md:max-w-[100px] text-center truncate bg-white/70 px-1 rounded shadow-sm">
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-8 flex gap-4 z-20 relative">
        {step !== "done" && (
          <button
            onClick={play}
            disabled={isAnimating || currentItems.length === 0}
            className="px-8 py-3 bg-biscuit-choco text-white font-extrabold text-lg md:text-xl rounded-full shadow-lg hover:bg-opacity-80 disabled:opacity-50"
          >
            {isAnimating
              ? "Mengundi..."
              : step === "restaurant"
                ? flowMode === "resto-only"
                  ? "PUTAR!"
                  : "Undi Restoran!"
                : "Undi Makanan!"}
          </button>
        )}
        {(step === "food" || step === "done") && !isAnimating && (
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-biscuit-light text-biscuit-dark border-2 border-biscuit font-bold rounded-full hover:bg-white transition"
          >
            🔄 Ulangi Dari Awal
          </button>
        )}
      </div>

      {/* Pesan Hasil Akhir */}
      <div className="h-16 mt-4 z-20 relative">
        {result && step === "done" && (
          <div className="text-xl md:text-2xl font-extrabold text-biscuit-choco animate-bounce bg-white px-6 py-3 rounded-2xl shadow-xl border-4 border-biscuit-dark text-center">
            {flowMode === "resto-food" ? (
              <>
                Makan <span className="text-orange-500">{result}</span> dari{" "}
                <span className="text-orange-500">{activeRest}</span>!
              </>
            ) : (
              <span className="text-orange-500">{result}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
