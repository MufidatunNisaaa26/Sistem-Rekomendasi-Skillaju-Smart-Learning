import { X, Sparkles } from "lucide-react";

export function CourseDetailModal({
  course,
  similarCourses,
  loadingSimilar,
  onClose,
  onSelectCourse,
}) {
  if (!course) return null;

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-indigo-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
              {course.category} • {course.level}
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-2">{course.title}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Instruktur: <strong>{course.instructor_name}</strong> • Durasi:{" "}
              {course.duration_hours} jam
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 flex items-center justify-between bg-sky-50/80 border border-sky-100 px-4 rounded-xl my-4">
          <div>
            <p className="text-xs text-slate-500">Harga Kursus</p>
            <p className="text-xl font-bold text-indigo-700">{formatRupiah(course.price_idr)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Rating & Peserta</p>
            <p className="text-sm font-bold text-slate-800">
              ★ {course.avg_rating} ({course.total_enrolled} siswa terdaftar)
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            Kursus Serupa (Content-Based TF-IDF Cosine Similarity)
          </h4>

          {loadingSimilar ? (
            <div className="text-xs text-slate-400 py-4 text-center">
              Memuat kursus serupa...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {similarCourses.map((sim) => (
                <div
                  key={sim.course_id}
                  onClick={() => onSelectCourse(sim)}
                  className="cursor-pointer p-3 rounded-xl border border-sky-100 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-300 transition-colors"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    Kemiripan: {(sim.similarity_score * 100).toFixed(0)}%
                  </span>
                  <p className="font-bold text-xs text-slate-800 mt-2 line-clamp-2">{sim.title}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {sim.level} • ★ {sim.avg_rating}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
