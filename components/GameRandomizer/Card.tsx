"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Komponen Mini Logo Triple N
const LogoTripleN = ({ scale = 1 }) => (
  <div
    className="flex gap-1 justify-center items-center"
    style={{ transform: `scale(${scale})` }}
  >
    <div className="w-6 h-8 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-sm rounded shadow-sm transform -rotate-6">
      N
    </div>
    <div className="w-6 h-8 bg-biscuit text-biscuit-choco flex items-center justify-center font-bold text-sm rounded shadow-sm z-10">
      N
    </div>
    <div className="w-6 h-8 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-sm rounded shadow-sm transform rotate-6">
      N
    </div>
  </div>
);

export default function Card({ isAnimating, result, step }: any) {
  const isDone = result && step === "done";

  // State untuk melacak giliran kartu mana yang sedang maju ke depan
  const [shufflePhase, setShufflePhase] = useState(0);

  // Interval pengocokan yang super cepat
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating) {
      interval = setInterval(() => {
        // Bergantian 0, 1, 2, 0, 1, 2...
        setShufflePhase((prev) => (prev + 1) % 3);
      }, 150); // Kecepatan satu tarikan kartu (150ms)
    } else {
      setShufflePhase(0); // Reset ke posisi rapi saat berhenti
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  const CardBack = () => (
    <div className="w-full h-full bg-biscuit-dark border-4 border-white rounded-2xl shadow-md flex items-center justify-center">
      <div className="w-3/4 h-5/6 border-2 border-dashed border-biscuit-light/50 rounded-xl flex items-center justify-center bg-white/10">
        <LogoTripleN scale={1.1} />
      </div>
    </div>
  );

  // Logika pergerakan The Real Shuffle
  // Saat fase 0: Kartu 1 di bawah, ditarik ke samping atas, lalu maju ke Z paling depan.
  // Saat fase 1: Kartu 2 yang melakukan itu. Dan seterusnya.
  const getCardAnimation = (cardIndex: number) => {
    if (!isAnimating) {
      // Posisi Standby & Tumpukan Rapi
      if (cardIndex === 0)
        return { x: 8, y: 8, rotateZ: 6, zIndex: 0, scale: 0.95 }; // Bawah
      if (cardIndex === 1)
        return { x: -4, y: 4, rotateZ: -3, zIndex: 10, scale: 0.98 }; // Tengah
      return { x: 0, y: 0, rotateZ: 0, zIndex: 20, scale: 1 }; // Atas
    }

    // Posisi sedang dikocok berdasarkan giliran (shufflePhase)
    // Jika giliran kartu ini ditarik ke atas:
    if (shufflePhase === cardIndex) {
      return {
        x: [0, 60, -10, 0], // Ditarik ke kanan jauh, naik, lalu nimpa ke tengah
        y: [0, -40, -10, 0], // Naik ke atas meniban kartu lain
        rotateZ: [0, 20, -5, 0], // Melintir sedikit saat di udara
        zIndex: 30, // Paling depan
        scale: [0.95, 1.05, 1, 1],
      };
    }

    // Jika kartu lain yang sedang ditarik, kartu ini turun ke bawah menggantikan posisi
    return {
      x: 0,
      y: 10, // Ditekan ke bawah
      rotateZ: (cardIndex - shufflePhase) * 5, // Bergeser rotasinya
      zIndex: cardIndex, // Kembali ke belakang
      scale: 0.95,
    };
  };

  return (
    <div
      className="w-full h-64 flex flex-col items-center justify-center"
      style={{ perspective: 1200 }}
    >
      <div className="relative w-40 h-56">
        {/* KARTU TUMPUKAN 1 (Belakang/Bawah) */}
        {!isDone && (
          <motion.div
            className="absolute inset-0"
            animate={getCardAnimation(0)}
            transition={{ duration: 0.15, ease: "easeOut" }} // Transisi sangat cepat
          >
            <CardBack />
          </motion.div>
        )}

        {/* KARTU TUMPUKAN 2 (Tengah) */}
        {!isDone && (
          <motion.div
            className="absolute inset-0"
            animate={getCardAnimation(1)}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <CardBack />
          </motion.div>
        )}

        {/* KARTU UTAMA 3 (Atas / Hasil) */}
        <motion.div
          className="absolute inset-0 cursor-pointer"
          animate={
            isDone
              ? {
                  rotateY: 180,
                  y: -20,
                  scale: 1.1,
                  x: 0,
                  rotateZ: 0,
                  zIndex: 50,
                } // Saat selesai, membalik
              : getCardAnimation(2) // Saat kocok, ikut aturan The Real Shuffle
          }
          transition={
            isDone
              ? { type: "spring", stiffness: 100, damping: 15 } // Membalik dengan mulus
              : { duration: 0.15, ease: "easeOut" } // Kocok super cepat
          }
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Sisi Belakang */}
          <div
            className="absolute inset-0 shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            <CardBack />
          </div>

          {/* Sisi Depan (Hasil) */}
          <div
            className="absolute inset-0 bg-white border-4 border-biscuit-dark rounded-2xl shadow-2xl flex flex-col items-center justify-center p-4 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-2xl mb-2">✨</span>
            <span className="text-lg font-bold text-biscuit-choco leading-tight drop-shadow-sm">
              {result}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
