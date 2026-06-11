"use client";
import { motion } from "framer-motion";

const LogoTripleN = ({ scale = 1 }) => (
  <div
    className="flex gap-1 justify-center items-center"
    style={{ transform: `scale(${scale})` }}
  >
    <div className="w-5 h-7 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-xs rounded-sm shadow transform -rotate-6">
      N
    </div>
    <div className="w-5 h-7 bg-biscuit text-biscuit-choco flex items-center justify-center font-bold text-xs rounded-sm shadow z-10">
      N
    </div>
    <div className="w-5 h-7 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-xs rounded-sm shadow transform rotate-6">
      N
    </div>
  </div>
);

export default function Slot({
  isAnimating,
  targetWinner,
  currentItems,
  result,
  step,
}: any) {
  // Masukkan LogoTripleN ke dalam gulungan slot
  const reelItems = isAnimating
    ? [
        ...currentItems,
        <LogoTripleN key="logo1" scale={1.2} />,
        ...currentItems,
        <LogoTripleN key="logo2" scale={1.2} />,
        targetWinner,
      ]
    : [
        result && step === "done" ? (
          result
        ) : (
          <LogoTripleN key="logo" scale={1.5} />
        ),
      ];

  const rowHeightPx = 128;
  const targetY = -(reelItems.length - 1) * rowHeightPx;

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <div className="bg-gray-100 border-8 border-gray-800 rounded-3xl shadow-inner w-full max-w-xs flex items-center justify-center overflow-hidden h-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-transparent to-gray-900/40 pointer-events-none z-10"></div>
        <div className="absolute left-0 w-2 h-full bg-red-500/30 z-10 shadow-lg"></div>

        <motion.div
          className="flex flex-col items-center w-full absolute top-0"
          initial={{ y: 0 }}
          animate={{ y: isAnimating ? targetY : 0 }}
          transition={{ duration: 3, ease: [0.15, 0.9, 0.2, 1] }}
        >
          {reelItems.map((item, i) => (
            <div
              key={i}
              className="h-32 flex items-center justify-center w-full px-4 text-center"
            >
              <span className="text-2xl font-black text-gray-800 bg-white border-y-2 border-gray-300 w-full py-2 shadow-sm truncate flex justify-center items-center h-16">
                {item}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
