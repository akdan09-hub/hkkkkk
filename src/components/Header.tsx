import React from 'react';
import { SchoolProfile } from '../types/student';
import { 
  Building2, 
  Sparkles, 
  FileCheck2, 
  Settings, 
  Download, 
  ScanLine, 
  Users, 
  LayoutDashboard,
  ShieldCheck,
  School
} from 'lucide-react';

interface HeaderProps {
  school: SchoolProfile;
  activeTab: 'dashboard' | 'ocr' | 'students' | 'report';
  setActiveTab: (tab: 'dashboard' | 'ocr' | 'students' | 'report') => void;
  onOpenSettings: () => void;
  totalStudents: number;
  completePercent: number;
}

export const Header: React.FC<HeaderProps> = ({
  school,
  activeTab,
  setActiveTab,
  onOpenSettings,
  totalStudents,
  completePercent,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner / Identity Bar */}
      <div className="bg-slate-900 text-slate-100 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
              SD
            </span>
            <span className="font-semibold text-slate-200 tracking-wide">
              SISTEM INFORMASI OPERATOR SEKOLAH DASAR (SI-OPS SD)
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300 font-medium">
              Integrasi Berkas Dapodik &amp; OCR AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini OCR Aktif</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="text-slate-300">
              TA: <span className="font-semibold text-white">{school.tahunAjaranAktif}</span> ({school.semesterAktif})
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* School Name & NPSN */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {school.namaSekolah}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                  Akreditasi {school.akreditasi}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                NPSN: <span className="font-mono font-medium text-slate-700">{school.npsn}</span> • {school.kecamatan}, {school.kabupatenKota}
              </p>
            </div>
          </div>

          {/* Quick Metrics & Settings Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-medium">Total Siswa</p>
                <p className="text-sm font-bold text-slate-900">{totalStudents} Siswa</p>
              </div>
              <div className="w-px h-7 bg-slate-200"></div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-medium">Berkas Lengkap</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-emerald-600">{completePercent}%</span>
                  <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                      style={{ width: `${completePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
              title="Pengaturan Profil Sekolah"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Profil SD</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mt-4 border-t border-slate-100 pt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard &amp; Status</span>
          </button>

          <button
            onClick={() => setActiveTab('ocr')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 relative ${
              activeTab === 'ocr'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ScanLine className="w-4 h-4 text-amber-400" />
            <span>Pemindai &amp; OCR Dokumen</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
              AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Database Siswa ({totalStudents})</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all shrink-0 ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Laporan Bulanan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
