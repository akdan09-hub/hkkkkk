import React from 'react';
import { Student, SchoolProfile, DocumentType } from '../types/student';
import { calculateMonthlyStats } from '../utils/exportUtils';
import { 
  Users, 
  FileCheck2, 
  AlertTriangle, 
  FileText, 
  CreditCard, 
  GraduationCap, 
  HeartHandshake, 
  ScanLine, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  school: SchoolProfile;
  onNavigateToOCR: (presetDocType?: DocumentType) => void;
  onNavigateToStudents: (filterMissing?: 'all' | 'kk' | 'akta' | 'rapor' | 'incomplete') => void;
  onNavigateToReport: () => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  school,
  onNavigateToOCR,
  onNavigateToStudents,
  onNavigateToReport,
  onSelectStudent,
}) => {
  const stats = calculateMonthlyStats(students);

  // Incomplete students list
  const incompleteStudents = students.filter(
    (s) => s.berkas.kk.status !== 'LENGKAP' || s.berkas.akta.status !== 'LENGKAP' || s.berkas.rapor.status !== 'LENGKAP'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg border border-blue-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium mb-3">
            <ScanLine className="w-3.5 h-3.5 text-blue-300" />
            <span>Otomasi Dapodik Sekolah Dasar Berbasis AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, Operator {school.namaSekolah}
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Sistem cerdas untuk mempercepat input data siswa dari dokumen fisik Kartu Keluarga (KK), Akta Kelahiran, dan Rapor menggunakan teknologi Optical Character Recognition (OCR) otomatis.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToOCR('auto_detect')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs sm:text-sm font-semibold transition-colors shadow-md shadow-blue-500/30"
            >
              <ScanLine className="w-4 h-4" />
              <span>Mulai Pindai Dokumen (OCR)</span>
            </button>
            <button
              onClick={onNavigateToReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Ekspor Laporan Bulanan Dapodik</span>
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 top-0 -bottom-10 w-96 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none rounded-r-2xl" />
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Siswa */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Siswa</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalStudents}</span>
            <span className="text-xs text-slate-500">terdata</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
            <span>Laki-laki: <strong>{stats.totalL}</strong></span>
            <span>Perempuan: <strong>{stats.totalP}</strong></span>
          </div>
        </div>

        {/* Berkas Lengkap 100% */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Berkas 100% Lengkap</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.completeCount}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats.completePercent}%
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Siap Sinkron Dapodik</span>
            <span className="text-emerald-600 font-medium">Validasi OK</span>
          </div>
        </div>

        {/* Siswa Perlu Verifikasi / Belum Lengkap */}
        <div 
          onClick={() => onNavigateToStudents('incomplete')}
          className="bg-white p-5 rounded-xl border border-amber-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Berkas Kurang</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-700">{incompleteStudents.length}</span>
            <span className="text-xs text-amber-600">siswa</span>
          </div>
          <div className="mt-3 text-xs text-amber-800 border-t border-amber-100 pt-2 flex items-center justify-between font-medium">
            <span>Lihat siswa &rarr;</span>
            <span>Perlu Tindak Lanjut</span>
          </div>
        </div>

        {/* Siswa Usulan KIP / PIP */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Penerima PIP / KIP</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-indigo-700">{stats.pipCount}</span>
            <span className="text-xs text-slate-500">siswa</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Dari Basis KK Terverifikasi</span>
            <span className="text-indigo-600 font-medium">Prasejahtera</span>
          </div>
        </div>
      </div>

      {/* Document Completeness Breakdown Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Statistik Kelengkapan Berkas Pokok Peserta Didik
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* KK Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Kartu Keluarga (KK)</span>
              </div>
              <span className="text-xs font-bold text-blue-700">{stats.kkPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats.kkPercent}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>{stats.kkCompleteCount} Lengkap</span>
              <span>{stats.totalStudents - stats.kkCompleteCount} Belum Ada</span>
            </div>
          </div>

          {/* Akta Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Akta Kelahiran</span>
              </div>
              <span className="text-xs font-bold text-emerald-700">{stats.aktaPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats.aktaPercent}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>{stats.aktaCompleteCount} Lengkap</span>
              <span>{stats.totalStudents - stats.aktaCompleteCount} Belum Ada</span>
            </div>
          </div>

          {/* Rapor Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-800">Rapor / Prestasi</span>
              </div>
              <span className="text-xs font-bold text-purple-700">{stats.raporPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${stats.raporPercent}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>{stats.raporCompleteCount} Lengkap</span>
              <span>{stats.totalStudents - stats.raporCompleteCount} Belum Ada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Action Hub & Incomplete Students Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick OCR Scanning Hub */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pusat Pindai Cepat (Smart OCR)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilih jenis berkas fisik yang ingin Anda masukkan ke database secara instan:
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onNavigateToOCR('kk')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  KK
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                    Pindai Kartu Keluarga (KK)
                  </h4>
                  <p className="text-xs text-slate-600">Ekstrak NIK anak, No KK, orang tua &amp; alamat</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateToOCR('akta')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  AKTA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                    Pindai Akta Kelahiran
                  </h4>
                  <p className="text-xs text-slate-600">No. Registrasi, tempat/tgl lahir, anak ke-</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateToOCR('rapor')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  RAPOR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                    Pindai Rapor Siswa
                  </h4>
                  <p className="text-xs text-slate-600">NISN, nilai mapel, kehadiran &amp; catatan wali kelas</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              <span>Standar Integrasi Dapodik</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Data hasil ekstraksi secara otomatis divalidasi sesuai standar Kemdikbudristek (NIK 16 digit, NISN 10 digit, format tanggal YYYY-MM-DD).
            </p>
          </div>
        </div>

        {/* Right: Incomplete Students Alert Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Perhatian: Siswa Berkas Belum Lengkap</h3>
                <p className="text-xs text-slate-500">
                  Daftar siswa yang memerlukan unggah susulan KK / Akta / Rapor sebelum sinkronisasi Dapodik:
                </p>
              </div>
              <button
                onClick={() => onNavigateToStudents('incomplete')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Lihat Semua &rarr;
              </button>
            </div>

            {incompleteStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-slate-700">Luar biasa! Seluruh berkas siswa 100% lengkap.</p>
                <p className="text-xs text-slate-500 mt-1">Data siap diekspor untuk laporan bulanan Dapodik.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px] bg-slate-50">
                      <th className="py-2.5 px-3">Nama Siswa</th>
                      <th className="py-2.5 px-3">Kelas</th>
                      <th className="py-2.5 px-3">Status Berkas</th>
                      <th className="py-2.5 px-3">Catatan Verifikasi</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {incompleteStudents.slice(0, 5).map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{s.nama}</div>
                          <div className="text-[11px] text-slate-500 font-mono">NISN: {s.nisn}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {s.rombel}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span 
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                s.berkas.kk.status === 'LENGKAP' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              KK
                            </span>
                            <span 
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                s.berkas.akta.status === 'LENGKAP' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              Akta
                            </span>
                            <span 
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                s.berkas.rapor.status === 'LENGKAP' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              Rapor
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                          {s.catatanOperator || 'Belum ada catatan khusus'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onSelectStudent(s)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            Lengkapi
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan max 5 siswa perlu tindakan</span>
            <button
              onClick={onNavigateToReport}
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Unduh Rekapitulasi Berkas (Excel/PDF)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
