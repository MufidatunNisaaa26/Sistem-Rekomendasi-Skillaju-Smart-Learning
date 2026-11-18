import { BookOpen, UserPlus, UserCheck, LogOut } from "lucide-react";

export function Navbar({ mode, onSetMode, customName, onGoToOnboarding }) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-indigo-100/80 px-6 py-4 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-sky-500 p-2.5 rounded-xl text-white shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              Skillaju Smart Learning
            </h1>
            <p className="text-xs text-slate-500">Hybrid Course Recommendation System</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Switcher Mode */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onSetMode("custom")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === "custom"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-indigo-700"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Profil Saya ({customName || "Custom"})
            </button>
            <button
              onClick={() => onSetMode("dataset")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === "dataset"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-indigo-700"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Simulasi Dataset
            </button>
          </div>

          {/* Tombol Kembali ke Halaman Enter / Ganti Akun */}
          <button
            onClick={onGoToOnboarding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Ganti / Buat Profil
          </button>
        </div>
      </div>
    </header>
  );
}
