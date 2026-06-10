import SpinWheel from "@/components/SpinWheel";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      {/* Logo NNN Sederhana */}
      <div className="flex gap-2 mb-6">
        <div className="w-12 h-16 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-3xl rounded-md shadow-md transform -rotate-6">
          N
        </div>
        <div className="w-12 h-16 bg-biscuit text-biscuit-choco flex items-center justify-center font-bold text-3xl rounded-md shadow-md z-10">
          N
        </div>
        <div className="w-12 h-16 bg-biscuit-dark text-biscuit-light flex items-center justify-center font-bold text-3xl rounded-md shadow-md transform rotate-6">
          N
        </div>
      </div>

      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-sm">
        NomNom Nexus
      </h1>
      <p className="text-lg max-w-md mb-12 font-medium opacity-80">
        Pusing mau makan apa? Biarkan roda biskuit ajaib ini yang memilihkan
        untukmu!
      </p>

      <SpinWheel />
    </main>
  );
}
