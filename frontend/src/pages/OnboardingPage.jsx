import { BookOpen, ArrowRight, Trash2, Check, Save } from "lucide-react";
import { useProfileManagement } from "../hooks/useProfileManagement";
import { useCourseData } from "../hooks/useCourseData";
import { useUiStore } from "../stores/useUiStore";
import { NotificationToast } from "../components/NotificationToast";

export function OnboardingPage() {
  const {
    formName,
    setFormName,
    formCategories,
    toggleCategory,
    formLevel,
    setFormLevel,
    formLikedCourses,
    toggleLikedCourse,
    validationErrors,
    handleSaveAndEnter,
    handleSelectSavedProfile,
    savedProfiles,
  } = useProfileManagement();

  const { allCourses, uniqueCategories } = useCourseData();
  const { setMode, setView, deleteNotif } = useUiStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/70 to-indigo-50/50 flex items-center justify-center p-6 text-slate-800">
      <NotificationToast deleteNotif={deleteNotif} />

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-indigo-100/70 overflow-hidden grid grid-cols-1 lg:grid-cols-5">
        {/* Panel Kiri: Branding & Daftar Profil Tersimpan */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-sky-600 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold leading-snug">
              Selamat Datang di Skillaju Smart Learning
            </h1>
            <p className="text-sm text-indigo-100 mt-3 leading-relaxed">
              Temukan jalur belajar dan kursus terbaik yang disesuaikan secara cerdas dengan minat serta level kemampuanmu.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {savedProfiles.length > 0 && (
              <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
                    Masuk dengan Profil Tersimpan:
                  </p>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {savedProfiles.map((prof, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSavedProfile(prof)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-white/95 hover:bg-white text-indigo-950 text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs"
                    >
                      <span>
                        {prof.name} ({prof.current_level})
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setView("delete-profile")}
                  className="w-full mt-2.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all border border-white/20 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-sky-200" />
                  Kelola / Hapus Profil ({savedProfiles.length})
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setMode("dataset");
                setView("dashboard");
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-950/40 hover:bg-indigo-950/60 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
            >
              Atau Langsung Coba Simulasi Siswa Dataset →
            </button>
          </div>
        </div>

        {/* Panel Kanan: Form Buat & Simpan Profil Baru */}
        <form onSubmit={handleSaveAndEnter} className="lg:col-span-3 p-8 space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Langkah Awal Personalisasi
            </span>
            <h2 className="text-xl font-bold text-slate-800 mt-1">
              Buat & Simpan Profil Belajarmu
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Contoh: Mufi Datun Nisa"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            />
            {validationErrors?.name && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Level Kemampuan Saat Ini
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setFormLevel(lvl)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formLevel === lvl
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            {validationErrors?.current_level && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {validationErrors.current_level}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Topik / Kategori yang Diminati
            </label>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map((cat) => {
                const active = formCategories.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                        : "bg-sky-50/70 text-sky-800 border-sky-200 hover:bg-sky-100"
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    {cat}
                  </button>
                );
              })}
            </div>
            {validationErrors?.preferred_categories && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {validationErrors.preferred_categories}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kursus yang Pernah Kamu Suka (Opsional)
            </label>
            <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-200 rounded-xl p-2.5 bg-slate-50/60">
              {allCourses.map((c) => {
                const checked = formLikedCourses.includes(c.course_id);
                return (
                  <label
                    key={c.course_id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer ${
                      checked
                        ? "bg-indigo-50 text-indigo-900 font-semibold"
                        : "hover:bg-white text-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLikedCourse(c.course_id)}
                      className="accent-indigo-600 rounded"
                    />
                    <span className="line-clamp-1">
                      {c.title} ({c.level})
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Profil & Masuk ke Rekomendasi
          </button>
        </form>
      </div>
    </div>
  );
}
