import { Layers } from "lucide-react";

export function CourseCatalogSection({ allCourses, onOpenCourseModal }) {
  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);

  return (
    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-indigo-600" />
        Eksplorasi Semua Katalog Kursus ({allCourses.length} Kursus Aktif)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allCourses.map((c) => (
          <div
            key={c.course_id}
            onClick={() => onOpenCourseModal(c)}
            className="cursor-pointer bg-white/90 hover:bg-white p-4 rounded-xl border border-slate-200/80 hover:border-sky-300 transition-all shadow-2xs"
          >
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
              {c.category} • {c.level}
            </span>
            <h4 className="font-bold text-sm text-slate-800 mt-2 line-clamp-2">{c.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{c.instructor_name}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-700">
                {formatRupiah(c.price_idr)}
              </span>
              <span className="text-amber-600 font-medium">★ {c.avg_rating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
