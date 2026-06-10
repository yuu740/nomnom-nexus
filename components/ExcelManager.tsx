"use client";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { importExcelData } from "../app/actions";

export default function ExcelManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi 1: Membuat dan mendownload template
  const downloadTemplate = () => {
    // Data contoh agar pengguna paham cara isinya
    const templateData = [
      { "Nama Restoran": "Warung Bu Ani", "Nama Makanan": "Nasi Goreng" },
      { "Nama Restoran": "Warung Bu Ani", "Nama Makanan": "Mie Goreng" },
      { "Nama Restoran": "McD", "Nama Makanan": "Burger" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Makanan");

    // Download file-nya
    XLSX.writeFile(workbook, "Template_NomNom_Nexus.xlsx");
  };

  // Fungsi 2: Membaca file yang diupload pengguna
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Ubah Excel jadi JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Cocokkan nama kolom Excel dengan database kita
        const formattedData = jsonData.map((row) => ({
          restaurantName: row["Nama Restoran"] || "",
          foodName: row["Nama Makanan"] || "",
        }));

        if (formattedData.length > 0) {
          // Kirim ke database melalui Server Action
          await importExcelData(formattedData);
          alert(
            `Yeay! Berhasil mengimpor ${formattedData.length} makanan baru! 🍪`,
          );
        } else {
          alert("Datanya kosong atau nama kolomnya tidak sesuai template!");
        }
      } catch (error) {
        console.error(error);
        alert("Waduh, gagal membaca file. Pastikan formatnya .xlsx ya!");
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <button
        onClick={downloadTemplate}
        className="px-6 py-2 bg-biscuit-dark text-biscuit-light font-bold rounded-xl shadow-md hover:bg-biscuit-choco transition border-2 border-transparent"
      >
        ⬇️ Download Template
      </button>

      {/* Input File Tersembunyi */}
      <input
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className="px-6 py-2 bg-white text-biscuit-choco font-bold rounded-xl shadow-md border-2 border-biscuit-dark hover:bg-biscuit-light transition disabled:opacity-50"
      >
        {isLoading ? "Memproses..." : "⬆️ Import Data Excel"}
      </button>
    </div>
  );
}
