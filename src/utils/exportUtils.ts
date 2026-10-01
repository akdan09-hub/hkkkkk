import * as XLSX from 'xlsx';
import { Student, SchoolProfile } from '../types/student';

export interface MonthlyStats {
  totalStudents: number;
  totalL: number;
  totalP: number;
  completeCount: number;
  completePercent: number;
  kkCompleteCount: number;
  kkPercent: number;
  aktaCompleteCount: number;
  aktaPercent: number;
  raporCompleteCount: number;
  raporPercent: number;
  pipCount: number;
  classBreakdown: Record<string, { total: number; L: number; P: number; complete: number }>;
}

export function calculateMonthlyStats(students: Student[]): MonthlyStats {
  const total = students.length;
  if (total === 0) {
    return {
      totalStudents: 0,
      totalL: 0,
      totalP: 0,
      completeCount: 0,
      completePercent: 0,
      kkCompleteCount: 0,
      kkPercent: 0,
      aktaCompleteCount: 0,
      aktaPercent: 0,
      raporCompleteCount: 0,
      raporPercent: 0,
      pipCount: 0,
      classBreakdown: {},
    };
  }

  const totalL = students.filter((s) => s.jenisKelamin === 'L').length;
  const totalP = students.filter((s) => s.jenisKelamin === 'P').length;

  const kkComplete = students.filter((s) => s.berkas.kk.status === 'LENGKAP').length;
  const aktaComplete = students.filter((s) => s.berkas.akta.status === 'LENGKAP').length;
  const raporComplete = students.filter((s) => s.berkas.rapor.status === 'LENGKAP').length;
  
  const allComplete = students.filter(
    (s) => s.berkas.kk.status === 'LENGKAP' && s.berkas.akta.status === 'LENGKAP' && s.berkas.rapor.status === 'LENGKAP'
  ).length;

  const pipCount = students.filter((s) => s.keluarga.penerimaKPS_PIP).length;

  const classBreakdown: Record<string, { total: number; L: number; P: number; complete: number }> = {};
  students.forEach((s) => {
    const rombel = s.rombel || 'Belum Ditentukan';
    if (!classBreakdown[rombel]) {
      classBreakdown[rombel] = { total: 0, L: 0, P: 0, complete: 0 };
    }
    classBreakdown[rombel].total += 1;
    if (s.jenisKelamin === 'L') classBreakdown[rombel].L += 1;
    if (s.jenisKelamin === 'P') classBreakdown[rombel].P += 1;
    if (s.berkas.kk.status === 'LENGKAP' && s.berkas.akta.status === 'LENGKAP' && s.berkas.rapor.status === 'LENGKAP') {
      classBreakdown[rombel].complete += 1;
    }
  });

  return {
    totalStudents: total,
    totalL,
    totalP,
    completeCount: allComplete,
    completePercent: Math.round((allComplete / total) * 100),
    kkCompleteCount: kkComplete,
    kkPercent: Math.round((kkComplete / total) * 100),
    aktaCompleteCount: aktaComplete,
    aktaPercent: Math.round((aktaComplete / total) * 100),
    raporCompleteCount: raporComplete,
    raporPercent: Math.round((raporComplete / total) * 100),
    pipCount,
    classBreakdown,
  };
}

export function exportMonthlyReportToExcel(
  students: Student[],
  school: SchoolProfile,
  monthName: string,
  year: number
) {
  const stats = calculateMonthlyStats(students);
  const wb = XLSX.utils.book_new();

  // --- Sheet 1: Ringkasan Eksekutif Dapodik Bulanan ---
  const summaryRows = [
    ['KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI'],
    [`DINAS PENDIDIKAN DAN KEBUDAYAAN ${school.kabupatenKota.toUpperCase()}`],
    [`LAPORAN BULANAN KELENGKAPAN BERKAS & KEADAAN SISWA`],
    [`SEKOLAH DASAR: ${school.namaSekolah}`],
    [`NPSN: ${school.npsn} | Periode: Bulan ${monthName} Tahun ${year}`],
    [],
    ['PARAMETER LAPORAN', 'JUMLAH / NILAI', 'PERSENTASE / KETERANGAN'],
    ['Total Peserta Didik Aktif', stats.totalStudents, '100%'],
    ['Siswa Laki-laki (L)', stats.totalL, `${Math.round((stats.totalL / (stats.totalStudents || 1)) * 100)}%`],
    ['Siswa Perempuan (P)', stats.totalP, `${Math.round((stats.totalP / (stats.totalStudents || 1)) * 100)}%`],
    ['Siswa Berkas 100% Lengkap (KK + Akta + Rapor)', stats.completeCount, `${stats.completePercent}%`],
    ['Kelengkapan Kartu Keluarga (KK)', stats.kkCompleteCount, `${stats.kkPercent}%`],
    ['Kelengkapan Kutipan Akta Kelahiran', stats.aktaCompleteCount, `${stats.aktaPercent}%`],
    ['Kelengkapan Rapor / Buku Induk', stats.raporCompleteCount, `${stats.raporPercent}%`],
    ['Siswa Penerima / Usulan KIP / PIP', stats.pipCount, `${Math.round((stats.pipCount / (stats.totalStudents || 1)) * 100)}%`],
    [],
    ['REKAPITULASI PER KELAS / ROMBEL'],
    ['Rombongan Belajar', 'Laki-laki', 'Perempuan', 'Total Siswa', 'Berkas Lengkap', '% Kelengkapan'],
  ];

  Object.entries(stats.classBreakdown).forEach(([rombel, data]) => {
    summaryRows.push([
      rombel,
      String(data.L),
      String(data.P),
      String(data.total),
      String(data.complete),
      `${Math.round((data.complete / data.total) * 100)}%`,
    ]);
  });

  summaryRows.push([]);
  summaryRows.push(['Mengetahui,', '', '', '', 'Disusun oleh,']);
  summaryRows.push(['Kepala Sekolah,', '', '', '', 'Operator Sekolah (Dapodik),']);
  summaryRows.push([]);
  summaryRows.push([]);
  summaryRows.push([school.namaKepalaSekolah, '', '', '', school.namaOperator]);
  summaryRows.push([`NIP. ${school.nipKepalaSekolah}`, '', '', '', 'Unit Pengelola Data SD']);

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Bulanan');

  // --- Sheet 2: Data Lengkap Siswa & Status Berkas ---
  const studentRows = students.map((s, idx) => ({
    'No': idx + 1,
    'NISN': s.nisn,
    'NIS': s.nis,
    'NIK Siswa': s.nik,
    'Nama Lengkap': s.nama,
    'Jenis Kelamin': s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
    'Rombel': s.rombel,
    'Tempat Lahir': s.tempatLahir,
    'Tanggal Lahir': s.tanggalLahir,
    'Agama': s.agama,
    'Nomor KK': s.keluarga.nomorKK,
    'Nama Kepala Keluarga': s.keluarga.namaKepalaKeluarga,
    'Nama Ayah': s.keluarga.namaAyah,
    'Pekerjaan Ayah': s.keluarga.pekerjaanAyah,
    'Nama Ibu': s.keluarga.namaIbu,
    'Pekerjaan Ibu': s.keluarga.pekerjaanIbu,
    'Nomor Akta Kelahiran': s.akta.nomorAkta || 'Belum Ada',
    'Anak Ke-': s.akta.anakKe || 1,
    'Status Berkas KK': s.berkas.kk.status,
    'Status Berkas Akta': s.berkas.akta.status,
    'Status Berkas Rapor': s.berkas.rapor.status,
    'Status Verifikasi': s.statusVerifikasi,
    'Penerima PIP': s.keluarga.penerimaKPS_PIP ? 'YA' : 'TIDAK',
    'Alamat Lengkap': `${s.alamat.jalan} RT ${s.alamat.rt} / RW ${s.alamat.rw}, ${s.alamat.dusunDesa}, ${s.alamat.kecamatan}, ${s.alamat.kabupatenKota}`,
    'No Telepon Ortu': s.keluarga.teleponOrtu,
    'Catatan Operator': s.catatanOperator,
  }));

  const wsStudents = XLSX.utils.json_to_sheet(studentRows);
  XLSX.utils.book_append_sheet(wb, wsStudents, 'Daftar Siswa & Berkas');

  // --- Sheet 3: Rekap Siswa Penerima PIP / KIP ---
  const pipStudents = students.filter((s) => s.keluarga.penerimaKPS_PIP);
  const pipRows = pipStudents.map((s, idx) => ({
    'No': idx + 1,
    'NISN': s.nisn,
    'Nama Siswa': s.nama,
    'Kelas': s.rombel,
    'NIK Siswa': s.nik,
    'Nomor KK': s.keluarga.nomorKK,
    'Nama Orang Tua / Wali': s.keluarga.namaAyah || s.keluarga.namaIbu,
    'Pekerjaan Orang Tua': s.keluarga.pekerjaanAyah,
    'Nomor KPS / KKS': s.keluarga.noKKS_KPS || 'Terdata Desil 1-2',
    'Alamat': `${s.alamat.jalan}, RT ${s.alamat.rt}/RW ${s.alamat.rw}, ${s.alamat.dusunDesa}`,
    'Status Berkas Pendukung': s.berkas.kk.status === 'LENGKAP' ? 'KK Lengkap' : 'KK Belum Verifikasi',
  }));

  const wsPip = XLSX.utils.json_to_sheet(pipRows.length > 0 ? pipRows : [{ 'Keterangan': 'Tidak ada siswa penerima PIP terdaftar' }]);
  XLSX.utils.book_append_sheet(wb, wsPip, 'Siswa Penerima KIP-PIP');

  // --- Sheet 4: Rekap Nilai Akademik Rapor ---
  const gradeRows = students.map((s, idx) => ({
    'No': idx + 1,
    'NISN': s.nisn,
    'Nama Siswa': s.nama,
    'Kelas': s.rombel,
    'Fase': s.rapor.fase || 'Fase A',
    'Nilai Rata-rata': s.rapor.nilaiRataRata || 0,
    'Kehadiran Sakit': s.rapor.kehadiran.sakit,
    'Kehadiran Izin': s.rapor.kehadiran.izin,
    'Kehadiran Alpa': s.rapor.kehadiran.tanpaKeterangan,
    'Catatan Perkembangan': s.rapor.catatanWaliKelas || '-',
  }));

  const wsGrades = XLSX.utils.json_to_sheet(gradeRows);
  XLSX.utils.book_append_sheet(wb, wsGrades, 'Rekap Nilai Rapor');

  // Generate binary Excel file and trigger download
  const cleanSchool = school.namaSekolah.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Laporan_Bulanan_${cleanSchool}_${monthName}_${year}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportStudentsToCsv(students: Student[]) {
  const headers = [
    'NISN',
    'NIS',
    'NIK',
    'Nama Siswa',
    'Jenis Kelamin',
    'Kelas',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Nomor KK',
    'Nama Ayah',
    'NIK Ayah',
    'Nama Ibu',
    'NIK Ibu',
    'No Akta Kelahiran',
    'Anak Ke',
    'Status Berkas KK',
    'Status Berkas Akta',
    'Status Berkas Rapor',
    'Status Verifikasi',
    'Penerima PIP',
  ];

  const rows = students.map((s) => [
    `"${s.nisn}"`,
    `"${s.nis}"`,
    `"${s.nik}"`,
    `"${s.nama}"`,
    `"${s.jenisKelamin}"`,
    `"${s.rombel}"`,
    `"${s.tempatLahir}"`,
    `"${s.tanggalLahir}"`,
    `"${s.keluarga.nomorKK}"`,
    `"${s.keluarga.namaAyah}"`,
    `"${s.keluarga.nikAyah}"`,
    `"${s.keluarga.namaIbu}"`,
    `"${s.keluarga.nikIbu}"`,
    `"${s.akta.nomorAkta}"`,
    s.akta.anakKe,
    `"${s.berkas.kk.status}"`,
    `"${s.berkas.akta.status}"`,
    `"${s.berkas.rapor.status}"`,
    `"${s.statusVerifikasi}"`,
    s.keluarga.penerimaKPS_PIP ? 'YA' : 'TIDAK',
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Data_Siswa_Dapodik_SD_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJsonBackup(students: Student[], school: SchoolProfile) {
  const backupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    school,
    totalRecords: students.length,
    students,
  };
  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Backup_Database_Siswa_${school.npsn}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
