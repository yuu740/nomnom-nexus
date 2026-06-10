"use client";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { importExcelData } from "../app/actions";
import BiscuitModal from "./BiscuitModal";

export default function ExcelManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as any,
    title: "",
    message: "",
  });

  const downloadTemplate = () => {
    // TAMBAHKAN KOLOM TIPE
    const templateData = [
      {
        "Nama Restoran": "Warung Bu Ani",
        "Tipe Restoran": "Warung",
        "Nama Makanan": "Nasi Goreng",
        "Tipe Makanan": "Gorengan",
      },
      {
        "Nama Restoran": "McD",
        "Tipe Restoran": "Fast Food",
        "Nama Makanan": "Burger",
        "Tipe Makanan": "Junk Food",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Template_NomNom_Nexus.xlsx");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // BACA TIPE DARI EXCEL
        const formattedData = jsonData.map((row) => ({
          restaurantName: String(row["Nama Restoran"] || ""),
          restaurantType: String(row["Tipe Restoran"] || ""),
          foodName: String(row["Nama Makanan"] || ""),
          foodType: String(row["Tipe Makanan"] || ""),
        }));

        if (formattedData.length > 0) {
          await importExcelData(formattedData);
          setModal({
            isOpen: true,
            type: "success",
            title: "Berhasil!",
            message: `${formattedData.length} data masuk!`,
          });
        } else {
          setModal({
            isOpen: true,
            type: "error",
            title: "Kosong!",
            message: "Datanya kosong / tidak sesuai template.",
          });
        }
      } catch (error) {
        setModal({
          isOpen: true,
          type: "error",
          title: "Gagal!",
          message: "Pastikan file berformat .xlsx ya!",
        });
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex gap-4 mb-8">
      <BiscuitModal
        {...modal}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
      <button
        onClick={downloadTemplate}
        className="px-6 py-2 bg-biscuit-dark text-white font-bold rounded-xl"
      >
        ⬇️ Template
      </button>
      <input
        type="file"
        accept=".xlsx"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="px-6 py-2 bg-white border-2 border-biscuit font-bold rounded-xl"
      >
        {isLoading ? "Proses..." : "⬆️ Import"}
      </button>
    </div>
  );
}
