import React, { useState, useEffect } from 'react';
import { Student, SchoolProfile, DocumentType } from './types/student';
import { initialStudents, defaultSchoolProfile } from './utils/sampleData';
import { calculateMonthlyStats } from './utils/exportUtils';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { OCRScanner } from './components/OCRScanner';
import { StudentListView } from './components/StudentListView';
import { MonthlyReportView } from './components/MonthlyReportView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { StudentFormModal } from './components/StudentFormModal';
import { SchoolSettingsModal } from './components/SchoolSettingsModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const STORAGE_KEY_STUDENTS = 'siops_sd_students_v1';
const STORAGE_KEY_SCHOOL = 'siops_sd_school_v1';

export default function App() {
  // Load persistent students or fallback to sample
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load students from localStorage:', e);
    }
    return initialStudents;
  });

  // Load persistent school profile or fallback
  const [school, setSchool] = useState<SchoolProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCHOOL);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load school profile from localStorage:', e);
    }
    return defaultSchoolProfile;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ocr' | 'students' | 'report'>('dashboard');

  // OCR Preset selection
  const [ocrPreset, setOcrPreset] = useState<DocumentType>('auto_detect');

  // Student filter missing preset
  const [studentFilterPreset, setStudentFilterPreset] = useState<'all' | 'kk' | 'akta' | 'rapor' | 'incomplete'>('all');

  // Modal states
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(school));
    } catch (e) {
      console.error('Failed to save school profile to localStorage:', e);
    }
  }, [school]);

  // Handle saving extracted student from OCR
  const handleSaveExtractedStudent = (
    studentData: Partial<Student>,
    originalDocImage: string,
    docType: 'kk' | 'akta' | 'rapor'
  ) => {
    if (!studentData.id) return;

    setStudents((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === studentData.id);
      if (existingIdx >= 0) {
        // Update existing student
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...studentData,
          updatedAt: new Date().toISOString(),
        } as Student;
        showToast(`Berkas ${docType.toUpperCase()} untuk "${updated[existingIdx].nama}" berhasil diperbarui ke database!`, 'success');
        return updated;
      } else {
        // Insert new student
        const newStudent = studentData as Student;
        showToast(`Peserta didik baru "${newStudent.nama}" berhasil didaftarkan via OCR (${docType.toUpperCase()})!`, 'success');
        return [newStudent, ...prev];
      }
    });

    // Navigate to students tab to view the result
    setTimeout(() => {
      setActiveTab('students');
    }, 600);
  };

  // Handle manual add/edit
  const handleSaveStudent = (saved: Student) => {
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === saved.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        showToast(`Data siswa "${saved.nama}" berhasil diperbarui.`, 'success');
        return updated;
      } else {
        showToast(`Siswa baru "${saved.nama}" berhasil ditambahkan.`, 'success');
        return [saved, ...prev];
      }
    });
    setSelectedStudentForEdit(null);
    setIsAddStudentOpen(false);
  };

  const handleDeleteStudent = (studentId: string) => {
    const target = students.find((s) => s.id === studentId);
    if (!target) return;
    if (confirm(`Hapus data siswa "${target.nama}" (NISN: ${target.nisn}) dari basis data?`)) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
      showToast(`Data siswa "${target.nama}" telah dihapus.`, 'info');
    }
  };

  // Trigger scan for a specific student's missing document
  const handleScanForStudent = (student: Student, docType: 'kk' | 'akta' | 'rapor') => {
    setOcrPreset(docType);
    setActiveTab('ocr');
    showToast(`Mode pindai ${docType.toUpperCase()} disiapkan untuk ${student.nama}.`, 'info');
  };

  // Quick navigation helpers
  const handleNavigateToOCR = (presetDoc: DocumentType = 'auto_detect') => {
    setOcrPreset(presetDoc);
    setActiveTab('ocr');
  };

  const handleNavigateToStudentsWithFilter = (filterMissing: 'all' | 'kk' | 'akta' | 'rapor' | 'incomplete' = 'all') => {
    setStudentFilterPreset(filterMissing);
    setActiveTab('students');
  };

  // Reset to initial sample data
  const handleResetData = () => {
    setStudents(initialStudents);
    setSchool(defaultSchoolProfile);
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_SCHOOL);
    showToast('Data simulasi awal SD berhasil dimuat ulang.', 'info');
  };

  const stats = calculateMonthlyStats(students);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs sm:text-sm font-semibold flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : toast.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-blue-600 text-white border-blue-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-white shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-200 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/20 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main App Header */}
      <Header
        school={school}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalStudents={students.length}
        completePercent={stats.completePercent}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            students={students}
            school={school}
            onNavigateToOCR={handleNavigateToOCR}
            onNavigateToStudents={handleNavigateToStudentsWithFilter}
            onNavigateToReport={() => setActiveTab('report')}
            onSelectStudent={(s) => setSelectedStudentForDetail(s)}
          />
        )}

        {activeTab === 'ocr' && (
          <OCRScanner
            students={students}
            onSaveExtractedStudent={handleSaveExtractedStudent}
            presetDocType={ocrPreset}
          />
        )}

        {activeTab === 'students' && (
          <StudentListView
            students={students}
            school={school}
            onSelectStudent={(s) => setSelectedStudentForDetail(s)}
            onEditStudent={(s) => setSelectedStudentForEdit(s)}
            onDeleteStudent={handleDeleteStudent}
            onAddNewStudent={() => setIsAddStudentOpen(true)}
            onScanForStudent={handleScanForStudent}
            initialFilterMissing={studentFilterPreset}
          />
        )}

        {activeTab === 'report' && (
          <MonthlyReportView
            students={students}
            school={school}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            SI-OPS SD © 2024 - Sistem Otomasi Berkas Dapodik Sekolah Dasar (KK, Akta, Rapor)
          </p>
          <p className="text-slate-400">
            Terintegrasi Standar Pendataan Kemdikbudristek &amp; Disdukcapil RI
          </p>
        </div>
      </footer>

      {/* Modals */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          school={school}
          onClose={() => setSelectedStudentForDetail(null)}
          onEdit={(s) => {
            setSelectedStudentForDetail(null);
            setSelectedStudentForEdit(s);
          }}
          onScanDocument={(s, docType) => {
            setSelectedStudentForDetail(null);
            handleScanForStudent(s, docType);
          }}
        />
      )}

      {(selectedStudentForEdit || isAddStudentOpen) && (
        <StudentFormModal
          student={selectedStudentForEdit}
          onSave={handleSaveStudent}
          onClose={() => {
            setSelectedStudentForEdit(null);
            setIsAddStudentOpen(false);
          }}
        />
      )}

      {isSettingsOpen && (
        <SchoolSettingsModal
          school={school}
          students={students}
          onSaveSchool={(updated) => {
            setSchool(updated);
            showToast('Profil sekolah berhasil disimpan.', 'success');
          }}
          onRestoreBackup={(restoredStudents, restoredSchool) => {
            setStudents(restoredStudents);
            if (restoredSchool) setSchool(restoredSchool);
            showToast(`Data cadangan berhasil dipulihkan (${restoredStudents.length} siswa).`, 'success');
          }}
          onResetData={handleResetData}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
