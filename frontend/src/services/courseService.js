import { request } from "./apiClient";

export const courseService = {
  getStudents(limit = 25) {
    return request(`/students?limit=${limit}`);
  },

  getCourses() {
    return request("/courses");
  },

  getStudentRecommendations(studentId, topN = 6) {
    return request(`/recommend/student/${studentId}?top_n=${topN}`);
  },

  getCustomRecommendations(profilePayload, topN = 6) {
    return request(`/recommend/custom?top_n=${topN}`, {
      method: "POST",
      body: JSON.stringify(profilePayload),
    });
  },

  getSimilarCourses(courseId, topN = 3) {
    return request(`/recommend/course/${courseId}?top_n=${topN}`);
  },
};
