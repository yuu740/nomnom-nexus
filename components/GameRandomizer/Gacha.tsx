"use client";
import { motion } from "framer-motion";

const LogoTripleN = ({ scale = 1 }) => (
  <div
    className="flex gap-1 justify-center items-center"
    style={{ transform: `scale(${scale})` }}
  >
    <div className="w-10 h-14 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-xl rounded shadow-md transform -rotate-6">
      N
    </div>
    <div className="w-10 h-14 bg-biscuit text-biscuit-choco flex items-center justify-center font-bold text-xl rounded shadow-md z-10">
      N
    </div>
    <div className="w-10 h-14 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-xl rounded shadow-md transform rotate-6">
      N
    </div>
  </div>
);

export default function Gacha({ isAnimating, result, step }: any) {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center relative">
      {/* Toples Bergetar (Hilang saat selesai) */}
      {(!result || step !== "done") && (
        <motion.div
          animate={
            isAnimating
              ? { x: [-8, 8, -8, 8, 0], rotate: [-3, 3, -3, 3, 0] }
              : {}
          }
          transition={{ duration: 0.2, repeat: isAnimating ? Infinity : 0 }}
          className="relative w-32 h-40 bg-blue-50/40 border-4 border-blue-200 rounded-b-3xl rounded-t-xl flex flex-wrap content-end justify-center p-3 overflow-hidden shadow-inner backdrop-blur-sm"
        >
          {/* Tutup Toples */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-orange-400 border-b-4 border-orange-500 rounded-t-xl z-10"></div>
          {/* Isi Kue */}
          <span className="text-3xl">🍪</span>
          <span className="text-3xl">🥠</span>
          <span className="text-3xl">🍪</span>
        </motion.div>
      )}

      {/* Triple N Muter & Keluar Hasil */}
      {result && step === "done" && (
        <motion.div
          initial={{ scale: 0, rotate: 720 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
          className="flex flex-col items-center"
        >
          <LogoTripleN scale={1.5} />
          <div className="mt-8 bg-biscuit-light border-4 border-biscuit-dark px-6 py-2 rounded-full shadow-xl">
            <span className="text-xl font-bold text-biscuit-choco">
              {result}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
