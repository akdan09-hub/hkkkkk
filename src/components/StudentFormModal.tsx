import React, { useState } from 'react';
import { Student } from '../types/student';
import { X, Save, UserPlus, Check } from 'lucide-react';

interface StudentFormModalProps {
  student?: Student | null; // if null, add new
  onSave: (studentData: Student) => void;
  onClose: () => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  student,
  onSave,
  onClose,
}) => {
  const isEditing = Boolean(student);

  const [formData, setFormData] = useState<Student>(
    student || {
      id: `std-${Date.now().toString().slice(-6)}`,
      nisn: '',
      nis: '',
      nik: '',
      nama: '',
      jenisKelamin: 'L',
      tempatLahir: '',
      tanggalLahir: '',
      agama: 'ISLAM',
      rombel: 'Kelas 1A',
      tingkatKelas: 1,
      tahunAjaran: '2024/2025',
      semester: '1 (Ganjil)',
      alamat: {
        jalan: '',
        rt: '001',
        rw: '001',
        dusunDesa: '',
        kecamatan: '',
        kabupatenKota: '',
        provinsi: 'Jawa Barat',
        kodePos: '',
      },
      keluarga: {
        nomorKK: '',
        namaKepalaKeluarga: '',
        namaAyah: '',
        nikAyah: '',
        pekerjaanAyah: '',
        namaIbu: '',
        nikIbu: '',
        pekerjaanIbu: '',
        teleponOrtu: '',
        penerimaKPS_PIP: false,
      },
      akta: {
        nomorAkta: '',
        anakKe: 1,
        dinasPenerbit: '',
        tanggalTerbit: '',
      },
      rapor: {
        asalSekolah: '',
        fase: 'Fase A',
        nilaiRataRata: 85,
        nilaiMapel: [],
        kehadiran: { sakit: 0, izin: 0, tanpaKeterangan: 0 },
        catatanWaliKelas: '',
        statusKenaikan: 'Aktif',
      },
      berkas: {
        kk: { status: 'BELUM' },
        akta: { status: 'BELUM' },
        rapor: { status: 'BELUM' },
      },
      statusVerifikasi: 'VALID',
      catatanOperator: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      alert('Nama siswa wajib diisi.');
      return;
    }
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? `Edit Data: ${formData.nama}` : 'Tambah Peserta Didik Baru (Manual)'}
              </h3>
              <p className="text-xs text-slate-400">Pengisian biodata Dapodik Formulir Peserta Didik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1.5">
              1. Identitas Pokok Siswa
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">NIK (16 Digit) *</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">NISN (10 Digit) *</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Jenis Kelamin</label>
                <select
                  value={formData.jenisKelamin}
                  onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Rombel (Kelas)</label>
                <select
                  value={formData.rombel}
                  onChange={(e) => {
                    const r = e.target.value;
                    const tk = parseInt(r.replace(/\D/g, ''), 10) || 1;
                    setFormData({ ...formData, rombel: r, tingkatKelas: tk });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Kelas 1A">Kelas 1A</option>
                  <option value="Kelas 1B">Kelas 1B</option>
                  <option value="Kelas 2A">Kelas 2A</option>
                  <option value="Kelas 2B">Kelas 2B</option>
                  <option value="Kelas 3A">Kelas 3A</option>
                  <option value="Kelas 3B">Kelas 3B</option>
                  <option value="Kelas 4A">Kelas 4A</option>
                  <option value="Kelas 4B">Kelas 4B</option>
                  <option value="Kelas 5A">Kelas 5A</option>
                  <option value="Kelas 5B">Kelas 5B</option>
                  <option value="Kelas 6A">Kelas 6A</option>
                  <option value="Kelas 6B">Kelas 6B</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tempat Lahir</label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1.5">
              2. Data Keluarga &amp; Orang Tua
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nomor Kartu Keluarga (KK)</label>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.keluarga.nomorKK}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keluarga: { ...formData.keluarga, nomorKK: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Kepala Keluarga</label>
                <input
                  type="text"
                  value={formData.keluarga.namaKepalaKeluarga}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keluarga: { ...formData.keluarga, namaKepalaKeluarga: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Ayah Kandung</label>
                <input
                  type="text"
                  value={formData.keluarga.namaAyah}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keluarga: { ...formData.keluarga, namaAyah: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Ibu Kandung</label>
                <input
                  type="text"
                  value={formData.keluarga.namaIbu}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keluarga: { ...formData.keluarga, namaIbu: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">No. Kontak / Telepon Orang Tua</label>
                <input
                  type="text"
                  value={formData.keluarga.teleponOrtu}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keluarga: { ...formData.keluarga, teleponOrtu: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Status PIP / KIP</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="pipCheck"
                    checked={formData.keluarga.penerimaKPS_PIP}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        keluarga: { ...formData.keluarga, penerimaKPS_PIP: e.target.checked },
                      })
                    }
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <label htmlFor="pipCheck" className="text-slate-800 font-medium">
                    Siswa Penerima Bantuan PIP / KPS
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-1.5">
              3. Data Akta Kelahiran
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nomor Registrasi Akta</label>
                <input
                  type="text"
                  value={formData.akta.nomorAkta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      akta: { ...formData.akta, nomorAkta: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kelahiran Anak Ke-</label>
                <input
                  type="number"
                  min={1}
                  value={formData.akta.anakKe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      akta: { ...formData.akta, anakKe: parseInt(e.target.value, 10) || 1 },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

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
              <span>Simpan Siswa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
