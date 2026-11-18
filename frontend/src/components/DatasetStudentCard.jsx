import { TrendingUp } from "lucide-react";

export function DatasetStudentCard({
  studentData,
  students,
  selectedStudent,
  onSelectStudent,
}) {
  if (!studentData) return null;

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <span className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-100 text-sky-700 mb-2">
            Profil Peserta Dataset • Paket {studentData.student?.plan_type?.toUpperCase()}
          </span>
          <h2 className="text-2xl font-bold text-slate-800">
            Halo, {studentData.student?.name}!
          </h2>
          <p className="text-sm text-slate-500">
            ID: {studentData.student?.student_id} • Domisili: {studentData.student?.city}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-sky-50/70 border border-sky-200 px-4 py-2.5 rounded-xl">
          <label className="text-xs font-semibold text-sky-900">Pilih Siswa:</label>
          <select
            value={selectedStudent}
            onChange={(e) => onSelectStudent(e.target.value)}
            className="bg-white border border-sky-200 text-sm rounded-lg px-3 py-1.5 text-slate-700"
          >
            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.student_id} — {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          Riwayat Belajar & Performa Kuis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {studentData.history?.map((h) => (
            <div
              key={h.course_id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70"
            >
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-indigo-600">{h.category}</span>
                <span>{h.level}</span>
              </div>
              <p className="font-semibold text-sm text-slate-800 line-clamp-1">{h.title}</p>
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-between text-xs">
                <span>
                  Progres: <strong>{h.completion_pct}%</strong>
                </span>
                <span className="font-semibold text-sky-700">
                  Skor Kuis: {Number(h.avg_quiz_score).toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
