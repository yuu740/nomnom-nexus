"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

interface WheelProps {
  currentItems: string[];
  isAnimating: boolean;
  targetWinner: string | null;
}

export default function Wheel({
  currentItems,
  isAnimating,
  targetWinner,
}: WheelProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isAnimating && targetWinner) {
      const winnerIndex = currentItems.indexOf(targetWinner);
      const sliceAngle = 360 / currentItems.length;
      const targetDegree = 1800 + (360 - winnerIndex * sliceAngle);
      setRotation(rotation + targetDegree - (rotation % 360));
    }
  }, [isAnimating, targetWinner]);

  const colors = ["#F3E5AB", "#D2B48C", "#CD853F", "#A0522D"];
  const gradientSlices = currentItems
    .map(
      (_: string, i: number) =>
        `${colors[i % colors.length]} ${(360 / currentItems.length) * i}deg ${(360 / currentItems.length) * (i + 1)}deg`,
    )
    .join(", ");

  return (
    <div className="flex flex-col items-center relative py-4">
      {/* Jarum Penunjuk di Atas */}
      <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600 -mb-[10px] z-30 drop-shadow-md"></div>

      {/* Roda Putar */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
        {/* Lingkaran Roda (Berputar) */}
        <motion.div
          className="absolute inset-0 rounded-full border-[10px] border-biscuit-dark shadow-2xl overflow-hidden"
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: [0.15, 0.9, 0.2, 1] }}
          style={{ background: `conic-gradient(${gradientSlices})` }}
        >
          {currentItems.map((item: string, i: number) => {
            const angle =
              (360 / currentItems.length) * i + 360 / currentItems.length / 2;
            return (
              <div
                key={i}
                className="absolute w-full h-full font-bold text-xs flex justify-center text-gray-800"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div
                  className="mt-4 px-2"
                  style={{
                    transform: "rotate(90deg)",
                    transformOrigin: "0 0",
                    width: "100px",
                    textAlign: "left",
                  }}
                >
                  <span className="inline-block truncate w-24 drop-shadow-sm">
                    {item}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Pusat Roda (Statis di tengah) - Berisi Logo Triple N */}
        <div className="absolute z-30 w-20 h-20 bg-white rounded-full border-4 border-biscuit-dark shadow-lg flex items-center justify-center">
          <LogoTripleN scale={0.9} />
        </div>
      </div>
    </div>
  );
}
