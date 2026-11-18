import { useProfileManagement } from "../hooks/useProfileManagement";
import { useCourseData } from "../hooks/useCourseData";
import { useCourseModal } from "../hooks/useCourseModal";
import { useUiStore } from "../stores/useUiStore";
import { Navbar } from "../components/Navbar";
import { ProfileEditCard } from "../components/ProfileEditCard";
import { DatasetStudentCard } from "../components/DatasetStudentCard";
import { RecommendationSection } from "../components/RecommendationSection";
import { CourseCatalogSection } from "../components/CourseCatalogSection";
import { CourseDetailModal } from "../components/CourseDetailModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { NotificationToast } from "../components/NotificationToast";

export function DashboardPage() {
  const {
    formName,
    setFormName,
    formLevel,
    setFormLevel,
    formCategories,
    toggleCategory,
    formLikedCourses,
    toggleLikedCourse,
    validationErrors,
    handleSaveAndEnter,
    handleDeleteProfile,
    handleDeleteAllProfiles,
    activeProfile,
  } = useProfileManagement();

  const {
    students,
    selectedStudent,
    setSelectedStudent,
    studentData,
    allCourses,
    uniqueCategories,
    displayedRecommendations,
    loading,
  } = useCourseData();

  const {
    selectedCourse,
    similarCourses,
    loadingSimilar,
    openCourseModal,
    closeCourseModal,
  } = useCourseModal();

  const {
    mode,
    setMode,
    setView,
    saveNotif,
    deleteNotif,
    confirmDeleteModal,
    setConfirmDeleteModal,
  } = useUiStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/70 to-indigo-50/50 text-slate-800 font-sans">
      <NotificationToast
        saveNotif={saveNotif}
        deleteNotif={deleteNotif}
        customName={activeProfile?.name}
      />

      <Navbar
        mode={mode}
        onSetMode={setMode}
        customName={activeProfile?.name}
        onGoToOnboarding={() => setView("onboarding")}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {mode === "custom" && (
          <ProfileEditCard
            customName={activeProfile?.name}
            formName={formName}
            onNameChange={setFormName}
            formLevel={formLevel}
            onLevelChange={setFormLevel}
            formCategories={formCategories}
            onToggleCategory={toggleCategory}
            uniqueCategories={uniqueCategories}
            formLikedCourses={formLikedCourses}
            onToggleLikedCourse={toggleLikedCourse}
            allCourses={allCourses}
            validationErrors={validationErrors}
            onSave={handleSaveAndEnter}
            onOpenDeleteModal={() =>
              setConfirmDeleteModal({
                open: true,
                profileName: activeProfile?.name || "Peserta",
                isAll: false,
              })
            }
          />
        )}

        {mode === "dataset" && (
          <DatasetStudentCard
            studentData={studentData}
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={setSelectedStudent}
          />
        )}

        <RecommendationSection
          mode={mode}
          customName={activeProfile?.name}
          studentName={studentData?.student?.name}
          displayedRecommendations={displayedRecommendations}
          loading={loading}
          onOpenCourseModal={openCourseModal}
        />

        <CourseCatalogSection
          allCourses={allCourses}
          onOpenCourseModal={openCourseModal}
        />
      </main>

      <CourseDetailModal
        course={selectedCourse}
        similarCourses={similarCourses}
        loadingSimilar={loadingSimilar}
        onClose={closeCourseModal}
        onSelectCourse={openCourseModal}
      />

      <DeleteConfirmModal
        modalState={confirmDeleteModal}
        onClose={() =>
          setConfirmDeleteModal({ open: false, profileName: null, isAll: false })
        }
        onConfirm={() => {
          if (confirmDeleteModal.isAll) {
            handleDeleteAllProfiles();
          } else if (confirmDeleteModal.profileName) {
            handleDeleteProfile(confirmDeleteModal.profileName);
          }
        }}
      />
    </div>
  );
}
