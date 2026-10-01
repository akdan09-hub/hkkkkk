import React, { useState } from 'react';
import { Student, SchoolProfile } from '../types/student';
import { 
  X, 
  Printer, 
  CreditCard, 
  FileCheck2, 
  GraduationCap, 
  User, 
  MapPin, 
  Users, 
  Calendar, 
  Phone, 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student;
  school: SchoolProfile;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onScanDocument: (student: Student, docType: 'kk' | 'akta' | 'rapor') => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  school,
  onClose,
  onEdit,
  onScanDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'biodata' | 'keluarga' | 'akta' | 'rapor' | 'berkas'>('biodata');

  // Trigger print view for student biodata
  const handlePrintFPD = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base">
              {student.jenisKelamin}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {student.nama}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold">
                  {student.rombel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                NISN: <span className="font-mono text-slate-200">{student.nisn}</span> | NIK: <span className="font-mono text-slate-200">{student.nik}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintFPD}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              title="Cetak Formulir Peserta Didik (F-PD)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak F-PD</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tabs Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('biodata')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'biodata'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Data Pribadi Siswa
          </button>
          <button
            onClick={() => setActiveTab('keluarga')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'keluarga'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Orang Tua &amp; KK
          </button>
          <button
            onClick={() => setActiveTab('akta')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'akta'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Akta Kelahiran
          </button>
          <button
            onClick={() => setActiveTab('rapor')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'rapor'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Nilai Rapor &amp; Prestasi
          </button>
          <button
            onClick={() => setActiveTab('berkas')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'berkas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Berkas Scan Digital
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Tab 1: Biodata */}
          {activeTab === 'biodata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Nama Lengkap</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{student.nama}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Jenis Kelamin</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {student.jenisKelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Tempat, Tanggal Lahir</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {student.tempatLahir}, {student.tanggalLahir}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Agama &amp; Kepercayaan</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{student.agama}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">NISN / NIS</span>
                  <p className="text-sm font-mono font-bold text-blue-700 mt-0.5">
                    {student.nisn} / {student.nis}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Rombel &amp; Tingkat</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {student.rombel} (Kelas {student.tingkatKelas})
                  </p>
                </div>
              </div>

              {/* Alamat */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Alamat Tempat Tinggal (Sesuai Kartu Keluarga)</span>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {student.alamat.jalan}, RT {student.alamat.rt} / RW {student.alamat.rw}, Desa/Kel. {student.alamat.dusunDesa}, Kec. {student.alamat.kecamatan}, {student.alamat.kabupatenKota}, Prov. {student.alamat.provinsi} (Kode Pos: {student.alamat.kodePos})
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Keluarga */}
          {activeTab === 'keluarga' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Nomor Kartu Keluarga (KK)</span>
                  <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{student.keluarga.nomorKK}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Nama Kepala Keluarga</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{student.keluarga.namaKepalaKeluarga}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Nama Ayah Kandung</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{student.keluarga.namaAyah}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Pekerjaan: {student.keluarga.pekerjaanAyah || '-'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Nama Ibu Kandung</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{student.keluarga.namaIbu}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Pekerjaan: {student.keluarga.pekerjaanIbu || '-'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Nomor Kontak / Telepon Ortu</span>
                  <p className="text-sm font-mono font-semibold text-slate-800 mt-0.5">{student.keluarga.teleponOrtu || '-'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Status Bantuan PIP / KPS</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {student.keluarga.penerimaKPS_PIP ? (
                      <span className="text-indigo-600 font-bold">Ya (Penerima Manfaat PIP / KPS)</span>
                    ) : (
                      <span>Bukan Penerima Bantuan</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Akta */}
          {activeTab === 'akta' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Nomor Registrasi Akta Kelahiran</span>
                  <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{student.akta.nomorAkta || 'Belum Terdaftar'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Kelahiran Anak Ke-</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">Anak ke-{student.akta.anakKe || 1}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Dinas Kependudukan Penerbit</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{student.akta.dinasPenerbit || '-'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Rapor */}
          {activeTab === 'rapor' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
                <div>
                  <span className="text-purple-800 uppercase text-[10px] font-bold">Nilai Rata-rata Akhir</span>
                  <p className="text-2xl font-bold text-purple-900 mt-0.5">{student.rapor.nilaiRataRata}</p>
                </div>
                <div className="text-right">
                  <span className="text-purple-800 uppercase text-[10px] font-bold">Kehadiran Siswa</span>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    Sakit: {student.rapor.kehadiran.sakit} | Izin: {student.rapor.kehadiran.izin} | Alpa: {student.rapor.kehadiran.tanpaKeterangan}
                  </p>
                </div>
              </div>

              {/* Grades Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Mata Pelajaran</th>
                      <th className="py-2.5 px-2 text-center">Nilai</th>
                      <th className="py-2.5 px-2 text-center">Predikat</th>
                      <th className="py-2.5 px-3">Deskripsi Capaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.rapor.nilaiMapel.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-800">{m.mapel}</td>
                        <td className="py-2 px-2 text-center font-bold text-blue-600">{m.nilai}</td>
                        <td className="py-2 px-2 text-center font-bold">{m.predikat}</td>
                        <td className="py-2 px-3 text-slate-600 text-[11px]">{m.capaian}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Catatan Wali Kelas */}
              {student.rapor.catatanWaliKelas && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                  <span className="text-amber-800 uppercase text-[10px] font-bold">Catatan Wali Kelas</span>
                  <p className="text-amber-950 font-medium italic mt-1">"{student.rapor.catatanWaliKelas}"</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Berkas */}
          {activeTab === 'berkas' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* KK Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">Scan Kartu Keluarga</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          student.berkas.kk.status === 'LENGKAP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {student.berkas.kk.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {student.berkas.kk.fileName || 'Belum ada berkas KK terunggah'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => onScanDocument(student, 'kk')}
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                    >
                      {student.berkas.kk.status === 'LENGKAP' ? 'Pindai Ulang KK' : 'Pindai Scan KK Sekarang'}
                    </button>
                  </div>
                </div>

                {/* Akta Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">Scan Akta Kelahiran</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          student.berkas.akta.status === 'LENGKAP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {student.berkas.akta.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {student.berkas.akta.fileName || 'Belum ada kutipan akta terunggah'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => onScanDocument(student, 'akta')}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                    >
                      {student.berkas.akta.status === 'LENGKAP' ? 'Pindai Ulang Akta' : 'Pindai Scan Akta Sekarang'}
                    </button>
                  </div>
                </div>

                {/* Rapor Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">Scan Rapor / Ijazah</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          student.berkas.rapor.status === 'LENGKAP'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {student.berkas.rapor.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {student.berkas.rapor.fileName || 'Belum ada rapor terunggah'}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => onScanDocument(student, 'rapor')}
                      className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors"
                    >
                      {student.berkas.rapor.status === 'LENGKAP' ? 'Pindai Ulang Rapor' : 'Pindai Scan Rapor Sekarang'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Terdaftar sejak: {new Date(student.createdAt).toLocaleDateString('id-ID')}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(student)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Edit Data Siswa
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
