import { Save, Trash2, Check } from "lucide-react";

export function ProfileEditCard({
  customName,
  formName,
  onNameChange,
  formLevel,
  onLevelChange,
  formCategories,
  onToggleCategory,
  uniqueCategories,
  formLikedCourses,
  onToggleLikedCourse,
  allCourses,
  validationErrors,
  onSave,
  onOpenDeleteModal,
}) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100/80 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 mb-1.5">
            Profil Aktif Tersimpan
          </span>
          <h2 className="text-xl font-bold text-slate-800">
            Halo, {customName || "Peserta"}!
          </h2>
          <p className="text-xs text-slate-500">
            Ubah minat atau kursus favorit di bawah ini, lalu klik "Simpan Perubahan Profil" agar tersimpan permanen.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenDeleteModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
            title="Hapus profil aktif ini"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Profil
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Kamu</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            />
            {validationErrors?.name && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Level Kemampuan</label>
            <div className="grid grid-cols-3 gap-2">
              {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onLevelChange(lvl)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    formLevel === lvl
                      ? "bg-indigo-600 text-white border-indigo-600"
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
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Topik yang Diminati</label>
          <div className="flex flex-wrap gap-2">
            {uniqueCategories.map((cat) => {
              const active = formCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onToggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? "bg-sky-600 text-white border-sky-600"
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
            Kursus yang Pernah Kamu Suka
          </label>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
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
                    onChange={() => onToggleLikedCourse(c.course_id)}
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
      </div>
    </section>
  );
}
