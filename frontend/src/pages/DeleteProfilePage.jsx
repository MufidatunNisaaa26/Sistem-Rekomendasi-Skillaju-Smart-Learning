import { Trash2, ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useProfileManagement } from "../hooks/useProfileManagement";
import { useUiStore } from "../stores/useUiStore";
import { ProfileCardItem } from "../components/ProfileCardItem";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { NotificationToast } from "../components/NotificationToast";

export function DeleteProfilePage() {
  const {
    savedProfiles,
    activeProfile,
    handleSelectSavedProfile,
    handleDeleteProfile,
    handleDeleteAllProfiles,
  } = useProfileManagement();

  const {
    setView,
    deleteNotif,
    confirmDeleteModal,
    setConfirmDeleteModal,
  } = useUiStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/70 to-indigo-50/50 text-slate-800 font-sans pb-16">
      <NotificationToast deleteNotif={deleteNotif} />

      {/* Navbar Hapus Profil */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-indigo-100/80 px-6 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-sky-500 p-2.5 rounded-xl text-white shadow-sm">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Halaman Hapus Profil
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Manajemen Akun
                </span>
              </h1>
              <p className="text-xs text-slate-500">Skillaju Smart Learning System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView(activeProfile?.name ? "dashboard" : "onboarding")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {activeProfile?.name ? "Kembali ke Dashboard" : "Kembali ke Beranda"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Banner Informasi */}
        <div className="bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-white border border-sky-200/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Pusat Penghapusan & Reset Profil
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Menghapus profil akan membersihkan data preferensi topik minat, level kemahiran, riwayat kursus favorit, dan data personalisasi rekomendasi. Tindakan ini bersifat permanen.
              </p>
            </div>
          </div>

          {savedProfiles.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setConfirmDeleteModal({ open: true, profileName: null, isAll: true })
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua Profil ({savedProfiles.length})
            </button>
          )}
        </div>

        {/* List Profil Tersimpan */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              Daftar Profil Tersimpan
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                {savedProfiles.length}
              </span>
            </h3>
          </div>

          {savedProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Tidak Ada Profil Tersimpan</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Semua profil telah dihapus atau Anda belum pernah menyimpan profil.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setView("onboarding")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Buat Profil Baru Sekarang →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedProfiles.map((prof, idx) => {
                const isActive =
                  prof.name?.toLowerCase() === (activeProfile?.name || "").toLowerCase();
                return (
                  <ProfileCardItem
                    key={idx}
                    profile={prof}
                    isActive={isActive}
                    onSelect={() => handleSelectSavedProfile(prof)}
                    onDeleteClick={() =>
                      setConfirmDeleteModal({
                        open: true,
                        profileName: prof.name,
                        isAll: false,
                      })
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

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
