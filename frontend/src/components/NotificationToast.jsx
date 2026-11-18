import { CheckCircle2 } from "lucide-react";

export function NotificationToast({ saveNotif, deleteNotif, customName }) {
  return (
    <>
      {saveNotif && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          Profil "{customName}" berhasil disimpan!
        </div>
      )}

      {deleteNotif && (
        <div className="fixed bottom-5 right-5 z-50 bg-rose-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          {deleteNotif}
        </div>
      )}
    </>
  );
}
