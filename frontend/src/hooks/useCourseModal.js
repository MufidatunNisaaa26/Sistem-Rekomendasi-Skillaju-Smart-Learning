import { useState } from "react";
import { courseService } from "../services/courseService";
import { useUiStore } from "../stores/useUiStore";

export function useCourseModal() {
  const { selectedCourse, setSelectedCourse } = useUiStore();
  const [similarCourses, setSimilarCourses] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const openCourseModal = (course) => {
    setSelectedCourse(course);
    setSimilarCourses([]);
    setLoadingSimilar(true);

    courseService
      .getSimilarCourses(course.course_id, 3)
      .then((data) => {
        setSimilarCourses(data || []);
        setLoadingSimilar(false);
      })
      .catch((err) => {
        console.error("Gagal memuat kursus serupa:", err);
        setLoadingSimilar(false);
      });
  };

  const closeCourseModal = () => {
    setSelectedCourse(null);
    setSimilarCourses([]);
  };

  return {
    selectedCourse,
    similarCourses,
    loadingSimilar,
    openCourseModal,
    closeCourseModal,
  };
}
