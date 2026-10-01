import React, { useState } from 'react';
import { SchoolProfile, Student } from '../types/student';
import { downloadJsonBackup } from '../utils/exportUtils';
import { 
  X, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Building2, 
  User, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface SchoolSettingsModalProps {
  school: SchoolProfile;
  students: Student[];
  onSaveSchool: (updatedSchool: SchoolProfile) => void;
  onRestoreBackup: (restoredStudents: Student[], restoredSchool?: SchoolProfile) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SchoolSettingsModal: React.FC<SchoolSettingsModalProps> = ({
  school,
  students,
  onSaveSchool,
  onRestoreBackup,
  onResetData,
  onClose,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>({ ...school });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchool(formData);
    setSuccessMsg('Profil sekolah berhasil diperbarui!');
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && Array.isArray(parsed.students)) {
          onRestoreBackup(parsed.students, parsed.school);
          setSuccessMsg(`Berhasil memulihkan ${parsed.students.length} data siswa dari backup!`);
          setTimeout(() => {
            setSuccessMsg(null);
            onClose();
          }, 1500);
        } else {
          alert('Format berkas cadangan JSON tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Profil Sekolah &amp; Cadangan Data</h3>
              <p className="text-xs text-slate-400">Pengaturan identitas SD untuk kop surat dan laporan Dapodik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-semibold mb-1">
                Nama Sekolah Dasar:
              </label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                NPSN (Nomor Pokok Sekolah Nasional):
              </label>
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                NSS / Status Akreditasi:
              </label>
              <input
                type="text"
                value={formData.akreditasi}
                onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                placeholder="Contoh: A (Unggul)"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-semibold mb-1">
                Alamat Lengkap Sekolah:
              </label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Kecamatan:
              </label>
              <input
                type="text"
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Kabupaten / Kota:
              </label>
              <input
                type="text"
                value={formData.kabupatenKota}
                onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Nama Kepala Sekolah:
              </label>
              <input
                type="text"
                value={formData.namaKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, namaKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                NIP Kepala Sekolah:
              </label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Nama Operator Dapodik:
              </label>
              <input
                type="text"
                value={formData.namaOperator}
                onChange={(e) => setFormData({ ...formData, namaOperator: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Tahun Ajaran Aktif:
              </label>
              <input
                type="text"
                value={formData.tahunAjaranAktif}
                onChange={(e) => setFormData({ ...formData, tahunAjaranAktif: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Backup & Restore Tools */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Cadangan &amp; Pemulihan Database (Backup JSON)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => downloadJsonBackup(students, school)}
                className="p-3 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Unduh Backup Data</div>
                  <div className="text-[11px] text-slate-500">Simpan {students.length} siswa ke file JSON</div>
                </div>
              </button>

              <label className="p-3 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left">
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Pulihkan dari Backup</div>
                  <div className="text-[11px] text-slate-500">Unggah berkas JSON cadangan</div>
                </div>
              </label>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin memuat ulang contoh data awal sekolah? Data yang diedit akan digantikan dengan data simulasi SD.')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="text-slate-500 hover:text-red-600 text-[11px] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset ke Contoh Data Awal SD</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
