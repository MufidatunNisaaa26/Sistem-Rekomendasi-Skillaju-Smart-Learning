import { create } from "zustand";

const STORAGE_KEY = "skillaju_active_profile";

const getInitialActiveProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca profil aktif dari localStorage:", e);
  }
  return {
    name: "",
    preferred_categories: ["Python"],
    current_level: "Beginner",
    liked_course_ids: [],
  };
};

export const useProfileStore = create((set) => ({
  activeProfile: getInitialActiveProfile(),
  savedProfiles: [],

  setActiveProfile: (profile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    set({ activeProfile: profile });
  },

  clearActiveProfile: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      activeProfile: {
        name: "",
        preferred_categories: ["Python"],
        current_level: "Beginner",
        liked_course_ids: [],
      },
    });
  },

  setSavedProfiles: (savedProfiles) => set({ savedProfiles }),
}));
