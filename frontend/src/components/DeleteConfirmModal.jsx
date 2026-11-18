import { AlertTriangle, Trash2 } from "lucide-react";

export function DeleteConfirmModal({ modalState, onClose, onConfirm }) {
  if (!modalState.open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {modalState.isAll
              ? "Hapus Semua Profil Tersimpan?"
              : `Hapus Profil "${modalState.profileName}"?`}
          </h3>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {modalState.isAll
              ? "Tindakan ini akan menghapus semua profil beserta preferensi minat, riwayat kursus favorit, dan data personalisasi yang tersimpan. Data yang dihapus tidak dapat dipulihkan."
              : `Apakah Anda yakin ingin menghapus profil "${modalState.profileName}" secara permanen? Data rekomendasi dan preferensi untuk profil ini akan hilang.`}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {modalState.isAll ? "Ya, Hapus Semua" : "Ya, Hapus Profil"}
          </button>
        </div>
      </div>
    </div>
  );
}
