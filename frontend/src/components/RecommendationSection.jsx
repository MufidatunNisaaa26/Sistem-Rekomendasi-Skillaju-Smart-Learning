import { Sparkles, Award, Star, Clock } from "lucide-react";

export function RecommendationSection({
  mode,
  customName,
  studentName,
  displayedRecommendations,
  loading,
  onOpenCourseModal,
}) {
  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-500" />
          Rekomendasi Kursus Terbaik Untuk{" "}
          {mode === "custom" ? customName || "Kamu" : studentName}
        </h2>
        <p className="text-sm text-slate-500">
          {mode === "custom"
            ? "Dihitung berdasarkan minat kategori, level kemampuan, dan kemiripan kursus pilihanmu"
            : "Dihitung menggunakan Collaborative Filtering & evaluasi skor kuis adaptif"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-indigo-600 font-medium">
          Menghitung rekomendasi personal...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRecommendations.map((course) => (
            <div
              key={course.course_id}
              onClick={() => onOpenCourseModal(course)}
              className="group cursor-pointer bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200/90 hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-sky-50 text-indigo-900 border border-sky-100">
                  <Award className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>{course.recommendation_reason}</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
                  <span>{course.category}</span>
                  <span>•</span>
                  <span className="text-slate-500">{course.level}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Instruktur: {course.instructor_name}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-600 pb-3 border-b border-slate-100">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <strong>{course.avg_rating}</strong> ({course.total_enrolled} siswa)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {course.duration_hours} jam
                  </span>
                </div>
                <div className="pt-3 flex items-center justify-between">
                  <span className="font-bold text-indigo-700">
                    {formatRupiah(course.price_idr)}
                  </span>
                  <span className="text-xs font-semibold text-sky-600 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                    Detail & Kursus Serupa →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
