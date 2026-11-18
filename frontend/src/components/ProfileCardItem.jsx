import { Trash2 } from "lucide-react";

export function ProfileCardItem({
  profile,
  isActive,
  onSelect,
  onDeleteClick,
}) {
  return (
    <div
      className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
        isActive ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-200"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
              {profile.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{profile.name}</h4>
              <span className="text-[11px] font-semibold text-indigo-600">
                Level {profile.current_level}
              </span>
            </div>
          </div>
          {isActive && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
              Aktif
            </span>
          )}
        </div>

        {/* Topik Minat */}
        <div className="mb-3">
          <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Minat Kategori:</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.preferred_categories?.length > 0 ? (
              profile.preferred_categories.map((c) => (
                <span
                  key={c}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100"
                >
                  {c}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">Belum ada topik</span>
            )}
          </div>
        </div>

        {/* Kursus Favorit */}
        <div className="text-[11px] text-slate-600 pb-3 border-b border-slate-100">
          <span>Kursus Favorit: </span>
          <strong className="text-indigo-700">
            {profile.liked_course_ids?.length || 0} kursus
          </strong>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-4 pt-2 flex items-center justify-between gap-2">
        {!isActive ? (
          <button
            type="button"
            onClick={onSelect}
            className="text-xs font-semibold text-sky-700 hover:text-indigo-800 cursor-pointer"
          >
            Pilih Profil
          </button>
        ) : (
          <span className="text-xs text-slate-400 italic">Profil sedang dipakai</span>
        )}

        <button
          type="button"
          onClick={onDeleteClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus Profil
        </button>
      </div>
    </div>
  );
}
