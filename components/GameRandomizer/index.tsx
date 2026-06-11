"use client";
import { useState } from "react";
import Wheel from "./Wheel";
import Gacha from "./Gacha";
import Slot from "./Slot";
import Card from "./Card";
import Cookie from "./Cookie";

interface GameRandomizerProps {
  groupedData: Record<string, string[]>;
}

type FlowMode = "resto-food" | "resto-only" | "food-only";
type VisualMode = "wheel" | "gacha" | "slot" | "card" | "cookie";

export default function GameRandomizer({ groupedData }: GameRandomizerProps) {
  const restaurants = Object.keys(groupedData);

  const [flowMode, setFlowMode] = useState<FlowMode>("resto-food");
  const [visualMode, setVisualMode] = useState<VisualMode>("wheel");
  const [step, setStep] = useState<"restaurant" | "food" | "done">(
    "restaurant",
  );

  const [activeRest, setActiveRest] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [targetWinner, setTargetWinner] = useState<string | null>(null); // State baru untuk bocoran pemenang!

  const [isAnimating, setIsAnimating] = useState(false);

  const getItems = () => {
    if (flowMode === "food-only") {
      const allFoods: string[] = [];
      Object.entries(groupedData).forEach(([resto, foods]) =>
        foods.forEach((f) => allFoods.push(`${f} (${resto})`)),
      );
      return allFoods.length > 0 ? allFoods : ["Kosong"];
    }
    if (step === "restaurant")
      return restaurants.length > 0 ? restaurants : ["Kosong"];
    if (step === "food" && activeRest)
      return groupedData[activeRest] || ["Kosong"];
    return ["Kosong"];
  };

  const currentItems = getItems();

  const play = () => {
    if (currentItems.length === 0 || isAnimating) return;
    setIsAnimating(true);
    setResult(null);

    // Tentukan pemenang di awal
    const winner =
      currentItems[Math.floor(Math.random() * currentItems.length)];
    setTargetWinner(winner);

    // Semua animasi kini berlangsung 3 detik
    setTimeout(() => {
      setIsAnimating(false);
      setTargetWinner(null);

      if (flowMode === "resto-only") {
        setResult(`Makan di ${winner}!`);
        setStep("done");
      } else if (flowMode === "food-only") {
        setResult(winner);
        setStep("done");
      } else {
        if (step === "restaurant") {
          setActiveRest(winner);
          setStep("food");
        } else {
          setResult(winner);
          setStep("done");
        }
      }
    }, 3000);
  };

  const resetGame = () => {
    setStep("restaurant");
    setActiveRest(null);
    setResult(null);
    setTargetWinner(null);
  };

  const renderVisuals = () => {
    const props = { isAnimating, result, step, currentItems, targetWinner };
    switch (visualMode) {
      case "wheel":
        return <Wheel {...props} />;
      case "gacha":
        return <Gacha {...props} />;
      case "slot":
        return <Slot {...props} />;
      case "card":
        return <Card {...props} />;
      case "cookie":
        return <Cookie {...props} />;
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 bg-white p-6 md:p-8 rounded-3xl shadow-lg border-4 border-biscuit w-full">
      {/* TABS METODE UNDIAN (Flow) */}
      <div className="w-full mb-6 border-b-2 border-biscuit-light pb-4 z-20 relative">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              setFlowMode("resto-food");
              resetGame();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${flowMode === "resto-food" ? "bg-biscuit-choco text-white" : "bg-biscuit-light text-biscuit-dark hover:bg-biscuit"}`}
          >
            1. Resto ➡️ Makanan
          </button>
          <button
            onClick={() => {
              setFlowMode("resto-only");
              resetGame();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${flowMode === "resto-only" ? "bg-biscuit-choco text-white" : "bg-biscuit-light text-biscuit-dark hover:bg-biscuit"}`}
          >
            2. Cuma Resto
          </button>
          <button
            onClick={() => {
              setFlowMode("food-only");
              resetGame();
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${flowMode === "food-only" ? "bg-biscuit-choco text-white" : "bg-biscuit-light text-biscuit-dark hover:bg-biscuit"}`}
          >
            3. Langsung Makanan
          </button>
        </div>
      </div>

      {/* TABS JENIS VISUAL (Roulette Types) */}
      <div className="w-full mb-4 flex justify-center flex-wrap gap-3 z-20 relative">
        {[
          { id: "wheel", icon: "🎡", label: "Roda" },
          { id: "gacha", icon: "🍯", label: "Toples" },
          { id: "slot", icon: "🎰", label: "Slot" },
          { id: "card", icon: "🃏", label: "Kartu" },
          { id: "cookie", icon: "🥠", label: "Biskuit" },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setVisualMode(v.id as VisualMode);
              resetGame();
            }}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${visualMode === v.id ? "bg-biscuit-dark text-white shadow-inner scale-105" : "bg-white border-2 border-biscuit text-biscuit-choco hover:bg-biscuit-light"}`}
          >
            <span className="text-2xl">{v.icon}</span>
            <span className="text-[10px] font-bold mt-1">{v.label}</span>
          </button>
        ))}
      </div>

      <h2 className="text-lg font-extrabold text-white mb-2 z-20 relative bg-biscuit-choco px-6 py-2 rounded-full shadow-md text-center">
        {step === "restaurant"
          ? "📍 Fase 1: Memilih Restoran"
          : step === "food"
            ? `🍽️ Menu dari ${activeRest}`
            : "🎉 Hasil Undian 🎉"}
      </h2>

      {/* AREA RENDER VISUAL ANIMASI */}
      <div className="w-full flex justify-center py-4 overflow-hidden">
        {renderVisuals()}
      </div>

      {/* TOMBOL AKSI */}
      <div className="mt-4 flex gap-4 z-20 relative">
        {step !== "done" && (
          <button
            onClick={play}
            disabled={isAnimating || currentItems.length === 0}
            className="px-10 py-4 bg-orange-500 text-white font-extrabold text-xl rounded-full shadow-[0_6px_0_0_#c2410c] hover:mt-1 hover:mb-1 hover:shadow-[0_2px_0_0_#c2410c] active:mt-2 active:mb-2 active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isAnimating ? "MENGACAK..." : "UNDI SEKARANG!"}
          </button>
        )}
        {(step === "food" || step === "done") && !isAnimating && (
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gray-100 text-gray-700 border-2 border-gray-300 font-bold rounded-full hover:bg-gray-200 transition"
          >
            🔄 Main Lagi
          </button>
        )}
      </div>

      {/* HASIL AKHIR (BANNER SELEBRASI) */}
      <div className="h-24 mt-6 z-20 relative w-full">
        {result && step === "done" && (
          <div className="bg-linear-to-r from-biscuit-dark via-biscuit-choco to-biscuit-dark text-white px-6 py-4 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center w-full">
            <p className="text-sm font-bold opacity-80 mb-1">
              🎉 Pilihan Biskuit Ajaib Jatuh Kepada: 🎉
            </p>
            <div className="text-xl md:text-2xl font-black drop-shadow-md tracking-wide">
              {flowMode === "resto-food" ? (
                <>
                  Makan <span className="text-yellow-300">{result}</span> dari{" "}
                  <span className="text-yellow-300">{activeRest}</span>
                </>
              ) : (
                <span className="text-yellow-300">{result}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
