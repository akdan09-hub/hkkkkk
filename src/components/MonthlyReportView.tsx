import React, { useState } from 'react';
import { Student, SchoolProfile } from '../types/student';
import { calculateMonthlyStats, exportMonthlyReportToExcel, exportStudentsToCsv } from '../utils/exportUtils';
import { 
  Download, 
  Printer, 
  Sparkles, 
  FileSpreadsheet, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  HeartHandshake, 
  FileText,
  RotateCw,
  School,
  FileCheck
} from 'lucide-react';

interface MonthlyReportViewProps {
  students: Student[];
  school: SchoolProfile;
}

export const MonthlyReportView: React.FC<MonthlyReportViewProps> = ({
  students,
  school,
}) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState<string>(months[currentMonthIndex]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);

  const stats = calculateMonthlyStats(students);

  // Generate AI Executive narrative analysis
  const handleGenerateAnalysis = async () => {
    setIsLoadingAnalysis(true);
    try {
      const res = await fetch('/api/monthly-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: school.namaSekolah,
          month: selectedMonth,
          year: selectedYear,
          stats,
          issuesCount: stats.totalStudents - stats.completeCount,
        }),
      });
      const data = await res.json();
      setAiAnalysis(data.summary || 'Analisis berhasil dibuat.');
    } catch (err) {
      console.error('Failed to generate analysis:', err);
      setAiAnalysis(
        `Laporan Rekapitulasi Dapodik SD Bulan ${selectedMonth} ${selectedYear} untuk ${school.namaSekolah} mencatat total ${stats.totalStudents} siswa. Kelengkapan dokumen pokok mencapai ${stats.completePercent}%. Sebanyak ${stats.pipCount} siswa tercatat sebagai calon penerima PIP. Rekomendasi: percepat pemenuhan berkas fisik sebelum penutupan cut-off semester.`
      );
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Configuration & Export Hub */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Laporan Bulanan &amp; Ekspor Dapodik Otomatis
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hasilkan rekapitulasi berkas, keadaan siswa bulanan, dan laporan resmi berformat Dinas Pendidikan SD dengan satu kali klik.
            </p>
          </div>

          {/* Month & Year Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  Bulan {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value={2024}>Tahun 2024</option>
              <option value={2025}>Tahun 2025</option>
              <option value={2026}>Tahun 2026</option>
            </select>

            {/* Excel Download Button */}
            <button
              onClick={() => exportMonthlyReportToExcel(students, school, selectedMonth, selectedYear)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Excel (.xlsx)</span>
            </button>

            {/* Print Official Report Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak / Cetak PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Executive Narrative Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 rounded-2xl border border-indigo-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Analisis Naratif Eksekutif Laporan Bulanan (AI Gemini)
              </h3>
              <p className="text-xs text-slate-300">
                Ringkasan otomatis untuk pengantar laporan resmi Kepala Sekolah kepada Pengawas dan Dinas Pendidikan.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAnalysis}
            disabled={isLoadingAnalysis}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 shrink-0"
          >
            {isLoadingAnalysis ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menganalisis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hasilkan Narasi AI</span>
              </>
            )}
          </button>
        </div>

        {aiAnalysis ? (
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs leading-relaxed text-slate-100 whitespace-pre-line space-y-2">
            {aiAnalysis}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 text-center">
            Klik tombol "Hasilkan Narasi AI" untuk membuat narasi evaluasi kelengkapan berkas Dapodik bulan {selectedMonth} {selectedYear} secara otomatis.
          </div>
        )}
      </div>

      {/* Official Form Document Paper Preview (Ready for Print / PDF) */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Kop Surat Resmi Sekolah Dasar */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1 relative">
          {/* Logo Tut Wuri Handayani / SD */}
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-xs bg-slate-50">
              <School className="w-8 h-8 text-blue-900" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-700">
                PEMERINTAH {school.provinsi.toUpperCase()}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                DINAS PENDIDIKAN DAN KEBUDAYAAN {school.kabupatenKota.toUpperCase()}
              </p>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase mt-0.5">
                {school.namaSekolah}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            {school.alamat}, Kec. {school.kecamatan}, {school.kabupatenKota}, Prov. {school.provinsi} • Kode Pos: {school.kodePos}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            NPSN: {school.npsn} | NSS: {school.nss} | Akreditasi: {school.akreditasi} | Telp: {school.telepon}
          </p>
        </div>

        {/* Title of Document */}
        <div className="text-center my-6 space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide underline underline-offset-4">
            LAPORAN BULANAN KELENGKAPAN BERKAS &amp; KEADAAN SISWA
          </h3>
          <p className="text-xs font-semibold text-slate-600">
            Nomor: 421.2 / {new Date().getMonth() + 1}.SDN / {selectedYear}
          </p>
          <p className="text-xs font-medium text-slate-500">
            Periode: Bulan {selectedMonth} {selectedYear} | Tahun Ajaran {school.tahunAjaranAktif}
          </p>
        </div>

        {/* Section 1: Executive Summary Table */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            I. REKAPITULASI KEADAAN SISWA &amp; STATUS KELENGKAPAN BERKAS
          </h4>

          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Indikator Data Pokok</th>
                  <th className="py-2.5 px-3 text-center">Jumlah Siswa</th>
                  <th className="py-2.5 px-3 text-center">Persentase (%)</th>
                  <th className="py-2.5 px-3">Keterangan / Status Dapodik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-800">Total Peserta Didik Terdaftar</td>
                  <td className="py-2 px-3 text-center font-bold">{stats.totalStudents}</td>
                  <td className="py-2 px-3 text-center font-bold">100%</td>
                  <td className="py-2 px-3 text-slate-600">Terdaftar aktif pada rombel</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">- Siswa Laki-laki (L)</td>
                  <td className="py-2 px-3 text-center">{stats.totalL}</td>
                  <td className="py-2 px-3 text-center">
                    {Math.round((stats.totalL / (stats.totalStudents || 1)) * 100)}%
                  </td>
                  <td className="py-2 px-3 text-slate-600">Rasio gender seimbang</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">- Siswa Perempuan (P)</td>
                  <td className="py-2 px-3 text-center">{stats.totalP}</td>
                  <td className="py-2 px-3 text-center">
                    {Math.round((stats.totalP / (stats.totalStudents || 1)) * 100)}%
                  </td>
                  <td className="py-2 px-3 text-slate-600">Rasio gender seimbang</td>
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="py-2 px-3 font-bold text-emerald-950">Berkas 100% Lengkap (KK + Akta + Rapor)</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-700">{stats.completeCount}</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-700">{stats.completePercent}%</td>
                  <td className="py-2 px-3 text-emerald-800 font-semibold">Siap sinkronisasi cut-off BOS</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Berkas Kartu Keluarga (KK) Terverifikasi</td>
                  <td className="py-2 px-3 text-center">{stats.kkCompleteCount}</td>
                  <td className="py-2 px-3 text-center">{stats.kkPercent}%</td>
                  <td className="py-2 px-3 text-slate-600">Terpadankan NIK &amp; Dukcapil</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Kutipan Akta Kelahiran Lengkap</td>
                  <td className="py-2 px-3 text-center">{stats.aktaCompleteCount}</td>
                  <td className="py-2 px-3 text-center">{stats.aktaPercent}%</td>
                  <td className="py-2 px-3 text-slate-600">Verifikasi tanggal &amp; tempat lahir</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-700">Buku Induk / Rapor Siswa Terarsip</td>
                  <td className="py-2 px-3 text-center">{stats.raporCompleteCount}</td>
                  <td className="py-2 px-3 text-center">{stats.raporPercent}%</td>
                  <td className="py-2 px-3 text-slate-600">Riwayat nilai &amp; kehadiran tersimpan</td>
                </tr>
                <tr className="bg-indigo-50/50">
                  <td className="py-2 px-3 font-bold text-indigo-950">Siswa Calon / Penerima Manfaat PIP / KIP</td>
                  <td className="py-2 px-3 text-center font-bold text-indigo-700">{stats.pipCount}</td>
                  <td className="py-2 px-3 text-center font-bold text-indigo-700">
                    {Math.round((stats.pipCount / (stats.totalStudents || 1)) * 100)}%
                  </td>
                  <td className="py-2 px-3 text-indigo-800 font-medium">Usulan bantuan siswa prasejahtera</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Table Breakdown per Rombel */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            II. REKAPITULASI DISTRIBUSI KELAS &amp; KELENGKAPAN BERKAS
          </h4>

          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="py-2 px-3">Rombongan Belajar</th>
                  <th className="py-2 px-3 text-center">Laki-laki (L)</th>
                  <th className="py-2 px-3 text-center">Perempuan (P)</th>
                  <th className="py-2 px-3 text-center">Total Siswa</th>
                  <th className="py-2 px-3 text-center">Berkas Lengkap</th>
                  <th className="py-2 px-3 text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(stats.classBreakdown).map(([rombel, data]) => (
                  <tr key={rombel}>
                    <td className="py-2 px-3 font-semibold text-slate-800">{rombel}</td>
                    <td className="py-2 px-3 text-center">{data.L}</td>
                    <td className="py-2 px-3 text-center">{data.P}</td>
                    <td className="py-2 px-3 text-center font-bold">{data.total}</td>
                    <td className="py-2 px-3 text-center font-semibold text-emerald-700">{data.complete}</td>
                    <td className="py-2 px-3 text-center font-medium">
                      {Math.round((data.complete / (data.total || 1)) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Signature Block */}
        <div className="mt-12 pt-6 border-t border-slate-300 flex items-start justify-between text-xs text-slate-800">
          <div className="text-center w-64 space-y-1">
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala {school.namaSekolah}</p>
            <div className="h-20"></div>
            <p className="font-bold underline underline-offset-2">{school.namaKepalaSekolah}</p>
            <p className="text-[11px] text-slate-600">NIP. {school.nipKepalaSekolah}</p>
          </div>

          <div className="text-center w-64 space-y-1">
            <p>{school.kabupatenKota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold">Operator Pendataan Dapodik,</p>
            <div className="h-20"></div>
            <p className="font-bold underline underline-offset-2">{school.namaOperator}</p>
            <p className="text-[11px] text-slate-600">NUPTK / ID Operator Sekolah</p>
          </div>
        </div>
      </div>
    </div>
  );
};
