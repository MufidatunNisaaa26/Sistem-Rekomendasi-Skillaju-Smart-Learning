import { useState, useEffect } from "react";
import { useProfileStore } from "../stores/useProfileStore";
import { useUiStore } from "../stores/useUiStore";
import { profileService } from "../services/profileService";
import { userProfileSchema } from "../schemas/userProfileSchema";

export function useProfileManagement() {
  const { activeProfile, savedProfiles, setActiveProfile, clearActiveProfile, setSavedProfiles } =
    useProfileStore();
  const { setView, setMode, setSaveNotif, setDeleteNotif, setConfirmDeleteModal } = useUiStore();

  const [formName, setFormName] = useState(activeProfile?.name || "");
  const [formCategories, setFormCategories] = useState(activeProfile?.preferred_categories || ["Python"]);
  const [formLevel, setFormLevel] = useState(activeProfile?.current_level || "Beginner");
  const [formLikedCourses, setFormLikedCourses] = useState(activeProfile?.liked_course_ids || []);
  const [validationErrors, setValidationErrors] = useState({});

  // Sync form when activeProfile changes
  useEffect(() => {
    if (activeProfile?.name) {
      setFormName(activeProfile.name);
      setFormCategories(activeProfile.preferred_categories || ["Python"]);
      setFormLevel(activeProfile.current_level || "Beginner");
      setFormLikedCourses(activeProfile.liked_course_ids || []);
    }
  }, [activeProfile]);

  // Load saved profiles from API on mount
  useEffect(() => {
    profileService
      .getSavedProfiles()
      .then((data) => {
        setSavedProfiles(data || []);
        // Jika ada profil tersimpan di localStorage, buka langsung ke dashboard
        const stored = localStorage.getItem("skillaju_active_profile");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.name) {
              setActiveProfile(parsed);
              setView("dashboard");
            }
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch((err) => console.error("Gagal memuat profil tersimpan:", err));
  }, [setSavedProfiles, setActiveProfile, setView]);

  const toggleCategory = (cat) => {
    setFormCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleLikedCourse = (cid) => {
    setFormLikedCourses((prev) =>
      prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid]
    );
  };

  const validateForm = () => {
    const result = userProfileSchema.safeParse({
      name: formName,
      current_level: formLevel,
      preferred_categories: formCategories,
      liked_course_ids: formLikedCourses,
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        fieldErrors[field] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return null;
    }

    setValidationErrors({});
    return result.data;
  };

  const handleSaveAndEnter = async (e) => {
    if (e) e.preventDefault();
    const validatedData = validateForm();
    if (!validatedData) return;

    try {
      const data = await profileService.saveProfile(validatedData);
      setSavedProfiles(data.all_profiles || []);
      setActiveProfile(validatedData);
      setSaveNotif(true);
      setTimeout(() => setSaveNotif(false), 3000);
      setMode("custom");
      setView("dashboard");
    } catch (err) {
      console.error("Gagal menyimpan profil:", err);
      setActiveProfile(validatedData);
      setView("dashboard");
    }
  };

  const handleSelectSavedProfile = (prof) => {
    setActiveProfile(prof);
    setFormName(prof.name);
    setFormCategories(prof.preferred_categories || []);
    setFormLevel(prof.current_level || "Beginner");
    setFormLikedCourses(prof.liked_course_ids || []);
    setMode("custom");
    setView("dashboard");
  };

  const handleDeleteProfile = async (profileNameToDelete) => {
    try {
      const data = await profileService.deleteProfile(profileNameToDelete);
      setSavedProfiles(data.all_profiles || []);
    } catch (err) {
      console.error("Gagal menghapus profil di server:", err);
      setSavedProfiles(savedProfiles.filter((p) => p.name.toLowerCase() !== profileNameToDelete.toLowerCase()));
    }

    if (activeProfile?.name?.toLowerCase() === profileNameToDelete.toLowerCase()) {
      clearActiveProfile();
      setFormName("");
      setFormCategories(["Python"]);
      setFormLevel("Beginner");
      setFormLikedCourses([]);
    }

    setConfirmDeleteModal({ open: false, profileName: null, isAll: false });
    setDeleteNotif(`Profil "${profileNameToDelete}" berhasil dihapus.`);
    setTimeout(() => setDeleteNotif(""), 3500);
  };

  const handleDeleteAllProfiles = async () => {
    try {
      await profileService.deleteAllProfiles();
    } catch (err) {
      console.error("Gagal menghapus semua profil di server:", err);
    }

    setSavedProfiles([]);
    clearActiveProfile();
    setFormName("");
    setFormCategories(["Python"]);
    setFormLevel("Beginner");
    setFormLikedCourses([]);

    setConfirmDeleteModal({ open: false, profileName: null, isAll: false });
    setDeleteNotif("Semua profil tersimpan berhasil dihapus.");
    setTimeout(() => setDeleteNotif(""), 3500);
  };

  return {
    formName,
    setFormName,
    formCategories,
    toggleCategory,
    formLevel,
    setFormLevel,
    formLikedCourses,
    toggleLikedCourse,
    validationErrors,
    handleSaveAndEnter,
    handleSelectSavedProfile,
    handleDeleteProfile,
    handleDeleteAllProfiles,
    activeProfile,
    savedProfiles,
  };
}
