"use client";
import { motion } from "framer-motion";

export default function Cookie({ isAnimating, result, step }: any) {
  // Posisi biskuit saat dipecah
  const isCracked = result && step === "done" && !isAnimating;

  return (
    <div className="w-full h-64 flex items-center justify-center relative overflow-hidden">
      {/* Setengah Biskuit (KIRI) */}
      <motion.div
        className="absolute text-9xl z-20 origin-bottom-right"
        style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }} // Potong murni setengah
        animate={
          isAnimating
            ? { rotate: [-5, 5, -5] }
            : isCracked
              ? { rotate: -45, x: -60, opacity: 0 } // Patah ke luar kiri
              : { rotate: 0, x: 0, opacity: 1 }
        }
        transition={{
          duration: isAnimating ? 0.15 : 1,
          repeat: isAnimating ? Infinity : 0,
        }}
      >
        🥠
      </motion.div>

      {/* Setengah Biskuit (KANAN) */}
      <motion.div
        className="absolute text-9xl z-20 origin-bottom-left"
        style={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)" }} // Potong murni setengah
        animate={
          isAnimating
            ? { rotate: [-5, 5, -5] }
            : isCracked
              ? { rotate: 45, x: 60, opacity: 0 } // Patah ke luar kanan
              : { rotate: 0, x: 0, opacity: 1 }
        }
        transition={{
          duration: isAnimating ? 0.15 : 1,
          repeat: isAnimating ? Infinity : 0,
        }}
      >
        🥠
      </motion.div>

      {/* Kertas Fortune yang membesar dari dalam */}
      {isCracked && (
        <motion.div
          className="absolute z-10 bg-yellow-100 border-2 border-yellow-300 p-4 rounded-sm shadow-xl text-center border-l-8 border-l-red-500"
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <span className="font-bold text-gray-800 text-xl whitespace-nowrap">
            📜 {result}
          </span>
        </motion.div>
      )}
    </div>
  );
}
