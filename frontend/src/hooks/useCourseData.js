import { useState, useEffect } from "react";
import { courseService } from "../services/courseService";
import { useProfileStore } from "../stores/useProfileStore";
import { useUiStore } from "../stores/useUiStore";

export function useCourseData() {
  const { activeProfile } = useProfileStore();
  const { mode, view } = useUiStore();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("STU00001");
  const [studentData, setStudentData] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [customRecs, setCustomRecs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Muat siswa dataset & seluruh kursus published
  useEffect(() => {
    courseService
      .getStudents(25)
      .then((data) => setStudents(data || []))
      .catch((err) => console.error("Gagal memuat siswa:", err));

    courseService
      .getCourses()
      .then((data) => setAllCourses(data || []))
      .catch((err) => console.error("Gagal memuat katalog kursus:", err));
  }, []);

  // Ambil rekomendasi dataset ketika mode dataset aktif
  useEffect(() => {
    if (view !== "dashboard" || mode !== "dataset" || !selectedStudent) return;
    setLoading(true);
    courseService
      .getStudentRecommendations(selectedStudent, 6)
      .then((data) => {
        setStudentData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat rekomendasi siswa:", err);
        setLoading(false);
      });
  }, [selectedStudent, mode, view]);

  // Ambil rekomendasi custom ketika profil aktif / kriteria berubah
  useEffect(() => {
    if (view !== "dashboard" || mode !== "custom") return;
    if (!activeProfile?.name) return;

    setLoading(true);
    courseService
      .getCustomRecommendations(
        {
          name: activeProfile.name || "Peserta",
          preferred_categories: activeProfile.preferred_categories || ["Python"],
          current_level: activeProfile.current_level || "Beginner",
          liked_course_ids: activeProfile.liked_course_ids || [],
        },
        6
      )
      .then((data) => {
        setCustomRecs(data?.recommendations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat rekomendasi custom:", err);
        setLoading(false);
      });
  }, [view, mode, activeProfile]);

  const uniqueCategories = [...new Set(allCourses.map((c) => c.category))];
  const displayedRecommendations =
    mode === "custom" ? customRecs : studentData?.recommendations || [];

  return {
    students,
    selectedStudent,
    setSelectedStudent,
    studentData,
    allCourses,
    uniqueCategories,
    displayedRecommendations,
    loading,
  };
}
