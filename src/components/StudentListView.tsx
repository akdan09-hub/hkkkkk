import React, { useState, useMemo } from 'react';
import { Student, SchoolProfile } from '../types/student';
import { exportStudentsToCsv } from '../utils/exportUtils';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  FileCheck2, 
  CreditCard, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical, 
  Printer, 
  Trash2, 
  Eye, 
  FilePlus, 
  FileText,
  User,
  ShieldCheck,
  Building
} from 'lucide-react';

interface StudentListViewProps {
  students: Student[];
  school: SchoolProfile;
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onAddNewStudent: () => void;
  onScanForStudent: (student: Student, docType: 'kk' | 'akta' | 'rapor') => void;
  initialFilterMissing?: 'all' | 'kk' | 'akta' | 'rapor' | 'incomplete';
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  school,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onAddNewStudent,
  onScanForStudent,
  initialFilterMissing = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRombel, setSelectedRombel] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(initialFilterMissing);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Unique rombel list
  const rombelOptions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.rombel));
    return Array.from(set).sort();
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      const searchMatch =
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn.includes(searchTerm) ||
        s.nik.includes(searchTerm) ||
        s.keluarga.nomorKK.includes(searchTerm) ||
        s.keluarga.namaAyah.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      // Rombel filter
      if (selectedRombel !== 'all' && s.rombel !== selectedRombel) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter === 'complete') {
        return (
          s.berkas.kk.status === 'LENGKAP' &&
          s.berkas.akta.status === 'LENGKAP' &&
          s.berkas.rapor.status === 'LENGKAP'
        );
      }
      if (selectedStatusFilter === 'incomplete') {
        return (
          s.berkas.kk.status !== 'LENGKAP' ||
          s.berkas.akta.status !== 'LENGKAP' ||
          s.berkas.rapor.status !== 'LENGKAP'
        );
      }
      if (selectedStatusFilter === 'kk') {
        return s.berkas.kk.status !== 'LENGKAP';
      }
      if (selectedStatusFilter === 'akta') {
        return s.berkas.akta.status !== 'LENGKAP';
      }
      if (selectedStatusFilter === 'rapor') {
        return s.berkas.rapor.status !== 'LENGKAP';
      }
      if (selectedStatusFilter === 'pip') {
        return s.keluarga.penerimaKPS_PIP;
      }

      return true;
    });
  }, [students, searchTerm, selectedRombel, selectedStatusFilter]);

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((item) => item !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Basis Data Siswa SD Terpadu ({students.length} Peserta Didik)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap siswa hasil integrasi berkas KK, Akta Kelahiran, dan Rapor sekolah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => exportStudentsToCsv(filteredStudents)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV Dapodik</span>
          </button>

          <button
            onClick={onAddNewStudent}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa Manual</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Nama Siswa, NIK (16 digit), NISN, atau No KK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Rombel Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedRombel}
              onChange={(e) => setSelectedRombel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
            >
              <option value="all">Semua Rombel (Kelas 1 - 6)</option>
              {rombelOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Document Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
            >
              <option value="all">Semua Kelengkapan Berkas</option>
              <option value="complete">Berkas 100% Lengkap (KK+Akta+Rapor)</option>
              <option value="incomplete">Berkas Masih Kurang</option>
              <option value="kk">Belum Ada Scan KK</option>
              <option value="akta">Belum Ada Scan Akta</option>
              <option value="rapor">Belum Ada Rapor</option>
              <option value="pip">Siswa Penerima KIP / PIP</option>
            </select>
          </div>
        </div>

        {/* Filter Quick Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px] font-medium">Filter Cepat:</span>
          <button
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              selectedStatusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({students.length})
          </button>

          <button
            onClick={() => setSelectedStatusFilter('complete')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              selectedStatusFilter === 'complete'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Lengkap 100% ({students.filter((s) => s.berkas.kk.status === 'LENGKAP' && s.berkas.akta.status === 'LENGKAP' && s.berkas.rapor.status === 'LENGKAP').length})
          </button>

          <button
            onClick={() => setSelectedStatusFilter('incomplete')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              selectedStatusFilter === 'incomplete'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Perlu Dilengkapi ({students.filter((s) => s.berkas.kk.status !== 'LENGKAP' || s.berkas.akta.status !== 'LENGKAP' || s.berkas.rapor.status !== 'LENGKAP').length})
          </button>

          <button
            onClick={() => setSelectedStatusFilter('pip')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
              selectedStatusFilter === 'pip'
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            Penerima PIP ({students.filter((s) => s.keluarga.penerimaKPS_PIP).length})
          </button>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredStudents.length > 0 &&
                      selectedStudentIds.length === filteredStudents.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-3">Identitas Siswa</th>
                <th className="py-3 px-3">NISN &amp; NIK</th>
                <th className="py-3 px-3">Rombel</th>
                <th className="py-3 px-3">Orang Tua &amp; KK</th>
                <th className="py-3 px-3 text-center">Status Berkas Dokumen</th>
                <th className="py-3 px-3">Status Dapodik</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">Tidak ada data siswa yang cocok dengan filter</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter rombel</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const isSelected = selectedStudentIds.includes(s.id);
                  const isAllComplete =
                    s.berkas.kk.status === 'LENGKAP' &&
                    s.berkas.akta.status === 'LENGKAP' &&
                    s.berkas.rapor.status === 'LENGKAP';

                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectStudent(s.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>

                      {/* Name & Gender & TTL */}
                      <td className="py-3 px-3">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                              s.jenisKelamin === 'L'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-pink-100 text-pink-700'
                            }`}
                          >
                            {s.jenisKelamin}
                          </div>
                          <div>
                            <button
                              onClick={() => onSelectStudent(s)}
                              className="font-bold text-slate-900 hover:text-blue-600 text-left transition-colors"
                            >
                              {s.nama}
                            </button>
                            <div className="text-[11px] text-slate-500">
                              {s.tempatLahir}, {s.tanggalLahir}
                            </div>
                            {s.keluarga.penerimaKPS_PIP && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-bold">
                                KIP / PIP
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* NISN & NIK */}
                      <td className="py-3 px-3 font-mono">
                        <div className="text-slate-900 font-semibold">{s.nisn}</div>
                        <div className="text-[11px] text-slate-500">NIK: {s.nik}</div>
                      </td>

                      {/* Rombel */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-800 text-[11px]">
                          {s.rombel}
                        </span>
                      </td>

                      {/* Parents & KK */}
                      <td className="py-3 px-3">
                        <div className="text-slate-800 font-medium truncate max-w-[140px]">
                          {s.keluarga.namaAyah || s.keluarga.namaIbu || '-'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          KK: {s.keluarga.nomorKK}
                        </div>
                      </td>

                      {/* Document Completeness Badges */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {/* KK Badge */}
                          <button
                            onClick={() => onScanForStudent(s, 'kk')}
                            title={s.berkas.kk.status === 'LENGKAP' ? `KK Lengkap (${s.berkas.kk.fileName})` : 'Klik untuk pindai KK'}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-transform hover:scale-105 ${
                              s.berkas.kk.status === 'LENGKAP'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            KK {s.berkas.kk.status === 'LENGKAP' ? '✓' : '+'}
                          </button>

                          {/* Akta Badge */}
                          <button
                            onClick={() => onScanForStudent(s, 'akta')}
                            title={s.berkas.akta.status === 'LENGKAP' ? `Akta Lengkap (${s.berkas.akta.fileName})` : 'Klik untuk pindai Akta'}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-transform hover:scale-105 ${
                              s.berkas.akta.status === 'LENGKAP'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            Akta {s.berkas.akta.status === 'LENGKAP' ? '✓' : '+'}
                          </button>

                          {/* Rapor Badge */}
                          <button
                            onClick={() => onScanForStudent(s, 'rapor')}
                            title={s.berkas.rapor.status === 'LENGKAP' ? `Rapor Lengkap (${s.berkas.rapor.fileName})` : 'Klik untuk pindai Rapor'}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-transform hover:scale-105 ${
                              s.berkas.rapor.status === 'LENGKAP'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            Rapor {s.berkas.rapor.status === 'LENGKAP' ? '✓' : '+'}
                          </button>
                        </div>
                      </td>

                      {/* Dapodik Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isAllComplete
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isAllComplete ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Valid / Siap Sync</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Belum Lengkap</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectStudent(s)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                            title="Lihat Detail Lengkap (Buku Induk)"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditStudent(s)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-amber-600 transition-colors"
                            title="Edit Data Siswa"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteStudent(s.id)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan <strong>{filteredStudents.length}</strong> dari total{' '}
            <strong>{students.length}</strong> siswa
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Tips: Klik tombol KK / Akta / Rapor berwarna merah untuk memindai berkas susulan siswa tersebut secara langsung.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
