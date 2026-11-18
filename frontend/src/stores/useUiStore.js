import { create } from "zustand";

export const useUiStore = create((set) => ({
  view: "onboarding", // "onboarding" | "dashboard" | "delete-profile"
  mode: "custom", // "custom" | "dataset"
  saveNotif: false,
  deleteNotif: "",
  selectedCourse: null,
  confirmDeleteModal: {
    open: false,
    profileName: null,
    isAll: false,
  },

  setView: (view) => set({ view }),
  setMode: (mode) => set({ mode }),
  setSaveNotif: (saveNotif) => set({ saveNotif }),
  setDeleteNotif: (deleteNotif) => set({ deleteNotif }),
  setSelectedCourse: (selectedCourse) => set({ selectedCourse }),
  setConfirmDeleteModal: (confirmDeleteModal) => set({ confirmDeleteModal }),
}));
