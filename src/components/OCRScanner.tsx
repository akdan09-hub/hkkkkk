import React, { useState, useRef, useEffect } from 'react';
import { 
  Student, 
  ExtractedOCRResult, 
  DocumentType, 
  KKAnggotaExtracted, 
  SubjectGrade, 
  AttendanceRecord 
} from '../types/student';
import { generateSampleDocSvg } from '../utils/sampleData';
import { 
  ScanLine, 
  Upload, 
  Camera, 
  FileText, 
  CreditCard, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Plus, 
  Save, 
  Layers, 
  Trash2,
  FileCheck,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface OCRScannerProps {
  students: Student[];
  onSaveExtractedStudent: (studentData: Partial<Student>, originalDocImage: string, docType: 'kk' | 'akta' | 'rapor') => void;
  presetDocType?: DocumentType;
}

export const OCRScanner: React.FC<OCRScannerProps> = ({
  students,
  onSaveExtractedStudent,
  presetDocType = 'auto_detect',
}) => {
  const [docType, setDocType] = useState<DocumentType>(presetDocType);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [ocrResult, setOcrResult] = useState<ExtractedOCRResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Batch Mode State
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  const [batchQueue, setBatchQueue] = useState<Array<{ id: string; file: File; dataUrl: string; status: 'pending' | 'processing' | 'done' | 'error'; result?: ExtractedOCRResult }>>([]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(0);

  // Verification Review Form State
  const [matchedStudentId, setMatchedStudentId] = useState<string>('new');
  const [targetRombel, setTargetRombel] = useState<string>('Kelas 1A');
  const [editedData, setEditedData] = useState<any>({});
  const [selectedKKMemberIndex, setSelectedKKMemberIndex] = useState<number>(0);

  // Image zoom and rotation
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Sync preset if prop changes
  useEffect(() => {
    if (presetDocType) setDocType(presetDocType);
  }, [presetDocType]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isBatchMode && files.length > 1) {
      handleBatchFiles(Array.from(files));
      return;
    }

    const file = files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);
      setOcrResult(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // Batch file handler
  const handleBatchFiles = (files: File[]) => {
    const newItems = files.map((f, i) => {
      return new Promise<any>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: `batch-${Date.now()}-${i}`,
            file: f,
            dataUrl: e.target?.result as string,
            status: 'pending',
          });
        };
        reader.readAsDataURL(f);
      });
    });

    Promise.all(newItems).then((items) => {
      setBatchQueue(items);
      setCurrentBatchIndex(0);
      if (items.length > 0) {
        setSelectedImage(items[0].dataUrl);
        setFileName(items[0].file.name);
      }
    });
  };

  // Quick Sample Loader
  const loadQuickSample = (type: 'kk' | 'akta' | 'rapor') => {
    const sampleSvg = generateSampleDocSvg(type);
    setSelectedImage(sampleSvg);
    setFileName(`Contoh_Dokumen_Resmi_${type.toUpperCase()}.svg`);
    setDocType(type);
    setOcrResult(null);
    setErrorMsg(null);
  };

  // Camera Handler
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setErrorMsg('Gagal mengakses kamera. Pastikan izin kamera aktif pada browser.');
      setIsCameraActive(false);
    }
  };

  const captureCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImage(dataUrl);
      setFileName(`Kamera_Scan_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.jpg`);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Perform OCR API call
  const runOCR = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setProcessingStep('Menyiapkan citra dokumen...');

    try {
      setTimeout(() => setProcessingStep('Gemini OCR sedang membaca teks dan struktur dokumen...'), 500);
      setTimeout(() => setProcessingStep('Menganalisis NIK, Nomor KK / NISN, dan validasi Dukcapil...'), 1200);

      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: selectedImage.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
          documentType: docType,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Terjadi kesalahan saat memproses OCR.');
      }

      const extracted: ExtractedOCRResult = json.data;
      setOcrResult(extracted);
      initializeVerificationForm(extracted);

      // Check if student with matching NIK/NISN/Name exists
      autoMatchStudent(extracted);

    } catch (err: any) {
      console.error('OCR Error:', err);
      setErrorMsg(err.message || 'Gagal memproses OCR. Silakan coba lagi atau cek koneksi server.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // Initialize form values from OCR
  const initializeVerificationForm = (result: ExtractedOCRResult) => {
    if (result.detectedType === 'kk' && result.kkData) {
      const kk = result.kkData;
      const studentIdx = kk.selectedStudentIndex ?? 0;
      setSelectedKKMemberIndex(studentIdx);
      const candidate = kk.anggotaKeluarga?.[studentIdx] || kk.anggotaKeluarga?.[0];

      setEditedData({
        nomorKK: kk.nomorKK,
        namaKepalaKeluarga: kk.namaKepalaKeluarga,
        alamatJalan: kk.alamat,
        rtRw: kk.rtRw,
        desaKelurahan: kk.desaKelurahan,
        kecamatan: kk.kecamatan,
        kabupatenKota: kk.kabupatenKota,
        provinsi: kk.provinsi,
        kodePos: kk.kodePos,
        // Candidate student
        namaSiswa: candidate?.namaLengkap || '',
        nikSiswa: candidate?.nik || '',
        jenisKelamin: candidate?.jenisKelamin || 'L',
        tempatLahir: candidate?.tempatLahir || '',
        tanggalLahir: candidate?.tanggalLahir || '',
        agama: candidate?.agama || 'ISLAM',
        namaAyah: candidate?.namaAyah || kk.namaKepalaKeluarga || '',
        namaIbu: candidate?.namaIbu || '',
      });
    } else if (result.detectedType === 'akta' && result.aktaData) {
      const akta = result.aktaData;
      setEditedData({
        nomorAkta: akta.nomorAkta,
        namaSiswa: akta.namaAnak,
        nikSiswa: akta.nik || '',
        jenisKelamin: akta.jenisKelamin || 'L',
        tempatLahir: akta.tempatLahir,
        tanggalLahir: akta.tanggalLahir,
        anakKe: akta.anakKe || 1,
        namaAyah: akta.namaAyah,
        namaIbu: akta.namaIbu,
        dinasPenerbit: akta.dinasPenerbit,
        tanggalTerbit: akta.tanggalTerbit,
      });
    } else if (result.detectedType === 'rapor' && result.raporData) {
      const rapor = result.raporData;
      setEditedData({
        namaSiswa: rapor.namaSiswa,
        nisn: rapor.nisn,
        nis: rapor.nis || '',
        namaSekolahAsal: rapor.namaSekolah,
        kelas: rapor.kelas,
        fase: rapor.fase,
        semester: rapor.semester,
        tahunAjaran: rapor.tahunAjaran,
        nilaiRataRata: rapor.nilaiRataRata,
        mataPelajaran: rapor.mataPelajaran || [],
        kehadiran: rapor.kehadiran || { sakit: 0, izin: 0, tanpaKeterangan: 0 },
        catatanWaliKelas: rapor.catatanWaliKelas,
      });
    }
  };

  // Find if student already exists in database by NIK, NISN, or Name
  const autoMatchStudent = (result: ExtractedOCRResult) => {
    let candidateNik = '';
    let candidateNisn = '';
    let candidateName = '';

    if (result.detectedType === 'kk' && result.kkData) {
      const cand = result.kkData.anggotaKeluarga?.[result.kkData.selectedStudentIndex ?? 0];
      candidateNik = cand?.nik || '';
      candidateName = cand?.namaLengkap || '';
    } else if (result.detectedType === 'akta' && result.aktaData) {
      candidateNik = result.aktaData.nik || '';
      candidateName = result.aktaData.namaAnak || '';
    } else if (result.detectedType === 'rapor' && result.raporData) {
      candidateNisn = result.raporData.nisn || '';
      candidateName = result.raporData.namaSiswa || '';
    }

    const matched = students.find((s) => {
      if (candidateNik && s.nik === candidateNik) return true;
      if (candidateNisn && s.nisn === candidateNisn) return true;
      if (candidateName && s.nama.toLowerCase().trim() === candidateName.toLowerCase().trim()) return true;
      return false;
    });

    if (matched) {
      setMatchedStudentId(matched.id);
    } else {
      setMatchedStudentId('new');
    }
  };

  // Handle KK member selection switch
  const handleSelectKKMember = (index: number) => {
    if (!ocrResult?.kkData?.anggotaKeluarga) return;
    setSelectedKKMemberIndex(index);
    const member = ocrResult.kkData.anggotaKeluarga[index];
    setEditedData((prev: any) => ({
      ...prev,
      namaSiswa: member.namaLengkap,
      nikSiswa: member.nik,
      jenisKelamin: member.jenisKelamin,
      tempatLahir: member.tempatLahir,
      tanggalLahir: member.tanggalLahir,
      agama: member.agama,
      namaAyah: member.namaAyah || prev.namaAyah,
      namaIbu: member.namaIbu || prev.namaIbu,
    }));

    // Auto-match check for this new child
    const matched = students.find((s) => s.nik === member.nik || s.nama.toLowerCase() === member.namaLengkap.toLowerCase());
    setMatchedStudentId(matched ? matched.id : 'new');
  };

  // Save to database
  const handleSaveToDatabase = () => {
    if (!ocrResult || !selectedImage) return;

    const detectedType = ocrResult.detectedType;
    let studentPayload: Partial<Student> = {};

    if (matchedStudentId === 'new') {
      // Create new student
      const newId = `std-${Date.now().toString().slice(-6)}`;
      const splittedRtRw = (editedData.rtRw || '001/001').split('/');
      const rt = splittedRtRw[0]?.trim() || '001';
      const rw = splittedRtRw[1]?.trim() || '001';

      studentPayload = {
        id: newId,
        nisn: editedData.nisn || `017${Math.floor(1000000 + Math.random() * 9000000)}`,
        nis: editedData.nis || `242501${Math.floor(100 + Math.random() * 900)}`,
        nik: editedData.nikSiswa || '3204120000000000',
        nama: editedData.namaSiswa || 'SISWA BARU',
        jenisKelamin: editedData.jenisKelamin || 'L',
        tempatLahir: editedData.tempatLahir || 'Bandung',
        tanggalLahir: editedData.tanggalLahir || '2017-08-01',
        agama: editedData.agama || 'ISLAM',
        rombel: targetRombel,
        tingkatKelas: parseInt(targetRombel.replace(/\D/g, ''), 10) || 1,
        tahunAjaran: '2024/2025',
        semester: '1 (Ganjil)',
        alamat: {
          jalan: editedData.alamatJalan || 'Jl. Raya Pendidikan',
          rt,
          rw,
          dusunDesa: editedData.desaKelurahan || 'Sukamaju',
          kecamatan: editedData.kecamatan || 'Cilengkrang',
          kabupatenKota: editedData.kabupatenKota || 'Kabupaten Bandung',
          provinsi: editedData.provinsi || 'Jawa Barat',
          kodePos: editedData.kodePos || '40392',
        },
        keluarga: {
          nomorKK: editedData.nomorKK || '',
          namaKepalaKeluarga: editedData.namaKepalaKeluarga || editedData.namaAyah || '',
          namaAyah: editedData.namaAyah || '',
          nikAyah: '',
          pekerjaanAyah: 'WIRASWASTA',
          namaIbu: editedData.namaIbu || '',
          nikIbu: '',
          pekerjaanIbu: 'IBU RUMAH TANGGA',
          teleponOrtu: '08123456789',
          penerimaKPS_PIP: false,
        },
        akta: {
          nomorAkta: editedData.nomorAkta || '',
          anakKe: editedData.anakKe || 1,
          dinasPenerbit: editedData.dinasPenerbit || '',
          tanggalTerbit: editedData.tanggalTerbit || '',
        },
        rapor: {
          asalSekolah: editedData.namaSekolahAsal || 'TK Asal',
          fase: editedData.fase || 'Fase A',
          nilaiRataRata: editedData.nilaiRataRata || 85,
          nilaiMapel: editedData.mataPelajaran || [],
          kehadiran: editedData.kehadiran || { sakit: 0, izin: 0, tanpaKeterangan: 0 },
          catatanWaliKelas: editedData.catatanWaliKelas || 'Peserta didik baru terdaftar melalui OCR.',
          statusKenaikan: 'Terdaftar Aktif',
        },
        berkas: {
          kk: {
            status: detectedType === 'kk' ? 'LENGKAP' : 'BELUM',
            fileName: detectedType === 'kk' ? fileName : '',
            scanDate: detectedType === 'kk' ? new Date().toISOString().slice(0, 10) : undefined,
          },
          akta: {
            status: detectedType === 'akta' ? 'LENGKAP' : 'BELUM',
            fileName: detectedType === 'akta' ? fileName : '',
            scanDate: detectedType === 'akta' ? new Date().toISOString().slice(0, 10) : undefined,
          },
          rapor: {
            status: detectedType === 'rapor' ? 'LENGKAP' : 'BELUM',
            fileName: detectedType === 'rapor' ? fileName : '',
            scanDate: detectedType === 'rapor' ? new Date().toISOString().slice(0, 10) : undefined,
          },
        },
        statusVerifikasi: 'VALID',
        catatanOperator: `Input otomatis via OCR Dokumen (${detectedType.toUpperCase()}) pada ${new Date().toLocaleDateString('id-ID')}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Update existing student with scanned document
      const existing = students.find((s) => s.id === matchedStudentId);
      if (!existing) return;

      studentPayload = {
        ...existing,
        updatedAt: new Date().toISOString(),
      };

      if (detectedType === 'kk') {
        studentPayload.keluarga = {
          ...studentPayload.keluarga!,
          nomorKK: editedData.nomorKK || studentPayload.keluarga?.nomorKK || '',
          namaKepalaKeluarga: editedData.namaKepalaKeluarga || studentPayload.keluarga?.namaKepalaKeluarga || '',
          namaAyah: editedData.namaAyah || studentPayload.keluarga?.namaAyah || '',
          namaIbu: editedData.namaIbu || studentPayload.keluarga?.namaIbu || '',
        };
        studentPayload.berkas = {
          ...studentPayload.berkas!,
          kk: {
            status: 'LENGKAP',
            fileName,
            scanDate: new Date().toISOString().slice(0, 10),
          },
        };
      } else if (detectedType === 'akta') {
        studentPayload.akta = {
          nomorAkta: editedData.nomorAkta || studentPayload.akta?.nomorAkta || '',
          anakKe: editedData.anakKe || studentPayload.akta?.anakKe || 1,
          dinasPenerbit: editedData.dinasPenerbit || studentPayload.akta?.dinasPenerbit || '',
          tanggalTerbit: editedData.tanggalTerbit || studentPayload.akta?.tanggalTerbit || '',
        };
        studentPayload.berkas = {
          ...studentPayload.berkas!,
          akta: {
            status: 'LENGKAP',
            fileName,
            scanDate: new Date().toISOString().slice(0, 10),
          },
        };
      } else if (detectedType === 'rapor') {
        if (editedData.nisn) studentPayload.nisn = editedData.nisn;
        studentPayload.rapor = {
          ...studentPayload.rapor!,
          nilaiRataRata: editedData.nilaiRataRata || studentPayload.rapor?.nilaiRataRata || 85,
          nilaiMapel: editedData.mataPelajaran || studentPayload.rapor?.nilaiMapel || [],
          kehadiran: editedData.kehadiran || studentPayload.rapor?.kehadiran || { sakit: 0, izin: 0, tanpaKeterangan: 0 },
          catatanWaliKelas: editedData.catatanWaliKelas || studentPayload.rapor?.catatanWaliKelas || '',
        };
        studentPayload.berkas = {
          ...studentPayload.berkas!,
          rapor: {
            status: 'LENGKAP',
            fileName,
            scanDate: new Date().toISOString().slice(0, 10),
          },
        };
      }
    }

    onSaveExtractedStudent(studentPayload, selectedImage, detectedType);

    // Reset or advance batch
    if (isBatchMode && batchQueue.length > currentBatchIndex + 1) {
      const nextIdx = currentBatchIndex + 1;
      setCurrentBatchIndex(nextIdx);
      setSelectedImage(batchQueue[nextIdx].dataUrl);
      setFileName(batchQueue[nextIdx].file.name);
      setOcrResult(null);
    } else {
      setOcrResult(null);
      setSelectedImage(null);
      setFileName('');
    }
  };

  // Calculate age helper
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return null;
    const birth = new Date(dateStr);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    return { years, months };
  };

  const studentAge = editedData.tanggalLahir ? calculateAge(editedData.tanggalLahir) : null;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ScanLine className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Pemindai Cerdas Berkas Siswa SD (OCR Gemini)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Unggah atau foto dokumen fisik Kartu Keluarga, Akta Kelahiran, dan Rapor. Sistem mengekstrak teks, tabel, dan memvalidasi ke format standar Dapodik secara otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBatchMode(!isBatchMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isBatchMode
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isBatchMode ? 'Mode Batch Aktif' : 'Mode Banyak Berkas (Batch)'}</span>
            </button>
          </div>
        </div>

        {/* Preset Document Type Selector */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => setDocType('auto_detect')}
            className={`p-3 rounded-xl border text-left transition-all ${
              docType === 'auto_detect'
                ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold">Deteksi Otomatis</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">AI mendeteksi jenis dokumen secara cerdas</p>
          </button>

          <button
            onClick={() => setDocType('kk')}
            className={`p-3 rounded-xl border text-left transition-all ${
              docType === 'kk'
                ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold">Kartu Keluarga (KK)</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Ekstrak NIK anak, No KK &amp; orang tua</p>
          </button>

          <button
            onClick={() => setDocType('akta')}
            className={`p-3 rounded-xl border text-left transition-all ${
              docType === 'akta'
                ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold">Akta Kelahiran</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">No. Registrasi &amp; tanggal lahir resmi</p>
          </button>

          <button
            onClick={() => setDocType('rapor')}
            className={`p-3 rounded-xl border text-left transition-all ${
              docType === 'rapor'
                ? 'border-purple-600 bg-purple-50/80 text-purple-900 ring-2 ring-purple-500/20'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold">Rapor Siswa</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Nilai mapel, NISN &amp; kehadiran</p>
          </button>
        </div>

        {/* Quick Demo Test Samples Section */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tidak punya dokumen fisik saat ini? Uji coba instan dengan contoh siap pakai:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadQuickSample('kk')}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              + Contoh Scan KK
            </button>
            <button
              onClick={() => loadQuickSample('akta')}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              + Contoh Scan Akta
            </button>
            <button
              onClick={() => loadQuickSample('rapor')}
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              + Contoh Scan Rapor
            </button>
          </div>
        </div>
      </div>

      {/* Main Upload / Camera / Viewer Section */}
      {!ocrResult ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Upload Area */}
          <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            {!selectedImage && !isCameraActive ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/40 rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center cursor-pointer transition-all text-center group min-h-[300px]">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple={isBatchMode}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-blue-100 group-hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors mb-4 shadow-xs">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-700">
                  {isBatchMode ? 'Pilih atau Tarik Banyak Berkas Dokumen Sekaligus' : 'Pilih Berkas Scan Dokumen'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Format gambar JPG, PNG, WebP atau scan PDF (hingga 50 MB per dokumen).
                </p>
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-xs group-hover:bg-blue-700">
                  <span>Pilih dari Komputer</span>
                </div>
              </label>
            ) : isCameraActive ? (
              <div className="relative rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center min-h-[360px]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-h-[460px] object-contain"
                />
                {/* Visual Scanner Guide Box */}
                <div className="absolute inset-8 border-2 border-dashed border-white/60 pointer-events-none rounded-lg flex items-center justify-center">
                  <span className="text-white/80 text-xs bg-black/60 px-3 py-1 rounded-full">
                    Arahkan Dokumen KK / Akta / Rapor ke dalam bingkai
                  </span>
                </div>

                <div className="absolute bottom-4 flex items-center gap-4">
                  <button
                    onClick={captureCamera}
                    className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Foto Dokumen</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              /* Selected Image Preview before processing */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{fileName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">Siap Diproses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setFileName('');
                      }}
                      className="text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>

                {/* Document Display with Laser Scan Overlay during processing */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-[420px] p-2">
                  <img
                    src={selectedImage!}
                    alt="Pratinjau Dokumen"
                    className="max-h-[400px] w-auto object-contain rounded"
                  />

                  {/* Animated Laser Scanning Sweep */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce shadow-lg shadow-cyan-400" />
                      <div className="bg-slate-900/90 text-white p-5 rounded-2xl border border-cyan-500/40 shadow-2xl max-w-sm space-y-3">
                        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                        <h4 className="text-sm font-bold text-cyan-200">
                          Sedang Membaca Dokumen dengan OCR AI...
                        </h4>
                        <p className="text-xs text-slate-300 animate-pulse">
                          {processingStep}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action button to execute OCR */}
                {!isProcessing && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={runOCR}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all"
                    >
                      <ScanLine className="w-4 h-4 text-amber-300" />
                      <span>Ekstrak Teks &amp; Data Siswa (Proses OCR)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Gagal Mengekstrak Dokumen</p>
                  <p className="mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tools & Camera Hub */}
          <div className="md:col-span-4 space-y-4">
            {/* Camera Option */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Gunakan Kamera Perangkat
              </h3>
              <p className="text-xs text-slate-500">
                Arahkan kamera HP / laptop Anda langsung ke dokumen fisik siswa di atas meja operator:
              </p>
              <button
                onClick={startCamera}
                disabled={isCameraActive || isProcessing}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-2xs disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Buka Kamera Pemindai</span>
              </button>
            </div>

            {/* Verification Checklist Information */}
            <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-blue-950">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>Petunjuk Scan Dokumen SD</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-blue-800/90 list-disc pl-4">
                <li>Pastikan tulisan nomor NIK (16 digit) dan No. KK tidak terlipat atau buram.</li>
                <li>Pada Kartu Keluarga, sistem secara cerdas akan menyajikan daftar seluruh anak dalam keluarga untuk dipilih.</li>
                <li>Pada Rapor, nilai mata pelajaran Kurikulum Merdeka / K13 akan langsung diekstrak ke rekap nilai.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* OCR Verification & Review Split Screen Interface */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Top Banner Verification Status */}
          <div className="bg-slate-900 text-white p-4 px-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Hasil Ekstraksi OCR ({ocrResult.detectedType.toUpperCase()})
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-semibold">
                    Akurasi {ocrResult.confidenceScore || 95}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{ocrResult.rawSummary}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOcrResult(null);
                  setSelectedImage(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                Scan Ulang
              </button>
            </div>
          </div>

          {/* Split Screen Layout: Left Document Image, Right Editable Verification Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Left Viewer (Original Document) */}
            <div className="lg:col-span-5 bg-slate-950 p-4 flex flex-col justify-between min-h-[500px]">
              {/* Zoom & Rotate Controls */}
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                <span>Pratinjau Dokumen Asli</span>
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-2 py-1 rounded-md">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                    className="p-1 hover:text-white"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[10px] text-white">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                    className="p-1 hover:text-white"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3 bg-slate-600 mx-1"></div>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1 hover:text-white"
                    title="Putar 90 Derajat"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Image Container with Zoom & Rotate */}
              <div className="flex-1 overflow-auto flex items-center justify-center p-2 rounded-lg bg-black/40 border border-slate-800 max-h-[600px]">
                <img
                  src={selectedImage!}
                  alt="Dokumen Terpindai"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease',
                  }}
                  className="max-h-[550px] w-auto object-contain rounded"
                />
              </div>

              <div className="mt-3 text-center text-[11px] text-slate-400">
                Pencocokan data visual: Periksa apakah NIK dan nama pada dokumen sesuai dengan kolom di sebelah kanan.
              </div>
            </div>

            {/* Right Verification Form */}
            <div className="lg:col-span-7 p-6 space-y-5 overflow-y-auto max-h-[750px]">
              {/* Match or Create Student Header */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Tujuan Penyimpanan Database
                    </span>
                  </div>
                  {matchedStudentId !== 'new' && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      Data Siswa Terdeteksi di Database!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 text-[11px] font-semibold mb-1">
                      Aksi Database:
                    </label>
                    <select
                      value={matchedStudentId}
                      onChange={(e) => setMatchedStudentId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    >
                      <option value="new">+ Daftarkan Sebagai Siswa Baru (PPDB / Mutasi Masuk)</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          Perbarui Berkas: {s.nama} ({s.rombel} - NISN: {s.nisn})
                        </option>
                      ))}
                    </select>
                  </div>

                  {matchedStudentId === 'new' && (
                    <div>
                      <label className="block text-slate-500 text-[11px] font-semibold mb-1">
                        Pilih Rombongan Belajar (Kelas):
                      </label>
                      <select
                        value={targetRombel}
                        onChange={(e) => setTargetRombel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      >
                        <option value="Kelas 1A">Kelas 1A (Fase A)</option>
                        <option value="Kelas 1B">Kelas 1B (Fase A)</option>
                        <option value="Kelas 2A">Kelas 2A (Fase A)</option>
                        <option value="Kelas 2B">Kelas 2B (Fase A)</option>
                        <option value="Kelas 3A">Kelas 3A (Fase B)</option>
                        <option value="Kelas 3B">Kelas 3B (Fase B)</option>
                        <option value="Kelas 4A">Kelas 4A (Fase B)</option>
                        <option value="Kelas 4B">Kelas 4B (Fase B)</option>
                        <option value="Kelas 5A">Kelas 5A (Fase C)</option>
                        <option value="Kelas 5B">Kelas 5B (Fase C)</option>
                        <option value="Kelas 6A">Kelas 6A (Fase C)</option>
                        <option value="Kelas 6B">Kelas 6B (Fase C)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Special KK Multi-Child Selector */}
              {ocrResult.detectedType === 'kk' && ocrResult.kkData?.anggotaKeluarga && (
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950">
                      Pilih Anggota Keluarga yang Didaftarkan sebagai Siswa SD:
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold">
                      {ocrResult.kkData.anggotaKeluarga.length} Jiwa Terbaca di KK
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {ocrResult.kkData.anggotaKeluarga.map((member, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectKKMember(idx)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                          selectedKKMemberIndex === idx
                            ? 'bg-blue-600 text-white border-blue-700 shadow-2xs font-semibold'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-blue-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                              selectedKKMemberIndex === idx ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-bold">{member.namaLengkap}</span>
                            <span className="ml-2 font-mono text-[11px] opacity-80">({member.nik})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded ${
                            selectedKKMemberIndex === idx ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {member.statusHubungan}
                          </span>
                          {member.isCandidateStudent && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-900 text-[10px] font-bold">
                              Rekomendasi SD
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Input Verification Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  1. Identitas Pokok Peserta Didik
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Nama Lengkap Siswa:
                    </label>
                    <input
                      type="text"
                      value={editedData.namaSiswa || ''}
                      onChange={(e) => setEditedData({ ...editedData, namaSiswa: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-600 font-semibold">
                        NIK Siswa (16 Digit):
                      </label>
                      <span className={`text-[10px] font-bold ${
                        (editedData.nikSiswa || '').length === 16 ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {(editedData.nikSiswa || '').length}/16 Digit
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={16}
                      value={editedData.nikSiswa || ''}
                      onChange={(e) => setEditedData({ ...editedData, nikSiswa: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Jenis Kelamin:
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="jk"
                          checked={editedData.jenisKelamin === 'L'}
                          onChange={() => setEditedData({ ...editedData, jenisKelamin: 'L' })}
                          className="text-blue-600"
                        />
                        <span>Laki-laki (L)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="jk"
                          checked={editedData.jenisKelamin === 'P'}
                          onChange={() => setEditedData({ ...editedData, jenisKelamin: 'P' })}
                          className="text-blue-600"
                        />
                        <span>Perempuan (P)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Tempat Lahir:
                    </label>
                    <input
                      type="text"
                      value={editedData.tempatLahir || ''}
                      onChange={(e) => setEditedData({ ...editedData, tempatLahir: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Tanggal Lahir:
                    </label>
                    <input
                      type="date"
                      value={editedData.tanggalLahir || ''}
                      onChange={(e) => setEditedData({ ...editedData, tanggalLahir: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    {studentAge && (
                      <p className="text-[10px] text-blue-700 font-semibold mt-1">
                        Usia: {studentAge.years} tahun {studentAge.months} bulan ({studentAge.years >= 6 ? 'Memenuhi Syarat SD' : 'Kurang dari 6 tahun'})
                      </p>
                    )}
                  </div>

                  {/* NISN (for Rapor or manual) */}
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      NISN (Nomor Induk Siswa Nasional):
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="10 digit NISN"
                      value={editedData.nisn || ''}
                      onChange={(e) => setEditedData({ ...editedData, nisn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Section 2: Data Orang Tua & KK */}
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 pt-3">
                  2. Data Orang Tua &amp; Kartu Keluarga (KK)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Nomor Kartu Keluarga (KK):
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      value={editedData.nomorKK || ''}
                      onChange={(e) => setEditedData({ ...editedData, nomorKK: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Nama Kepala Keluarga:
                    </label>
                    <input
                      type="text"
                      value={editedData.namaKepalaKeluarga || ''}
                      onChange={(e) => setEditedData({ ...editedData, namaKepalaKeluarga: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Nama Ayah Kandung:
                    </label>
                    <input
                      type="text"
                      value={editedData.namaAyah || ''}
                      onChange={(e) => setEditedData({ ...editedData, namaAyah: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Nama Ibu Kandung:
                    </label>
                    <input
                      type="text"
                      value={editedData.namaIbu || ''}
                      onChange={(e) => setEditedData({ ...editedData, namaIbu: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">
                      Alamat Sesuai KK:
                    </label>
                    <input
                      type="text"
                      value={editedData.alamatJalan || ''}
                      onChange={(e) => setEditedData({ ...editedData, alamatJalan: e.target.value })}
                      placeholder="Jalan / Kampung / Dusun"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Section 3: Data Akta Kelahiran */}
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 pt-3">
                  3. Kutipan Akta Kelahiran
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Nomor Registrasi Akta:
                    </label>
                    <input
                      type="text"
                      value={editedData.nomorAkta || ''}
                      onChange={(e) => setEditedData({ ...editedData, nomorAkta: e.target.value })}
                      placeholder="Contoh: 3204-LT-14072017-0042"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Anak Ke-:
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={editedData.anakKe || 1}
                      onChange={(e) => setEditedData({ ...editedData, anakKe: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Section 4: If Rapor was scanned, show extracted grades */}
                {ocrResult.detectedType === 'rapor' && editedData.mataPelajaran?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 pt-3">
                      4. Nilai Capaian Rapor Siswa
                    </h4>
                    <div className="overflow-x-auto mt-2 border border-slate-200 rounded-lg">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                          <tr>
                            <th className="py-2 px-3">Mata Pelajaran</th>
                            <th className="py-2 px-2 text-center">Nilai</th>
                            <th className="py-2 px-2 text-center">Predikat</th>
                            <th className="py-2 px-3">Capaian Kompetensi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {editedData.mataPelajaran.map((m: SubjectGrade, i: number) => (
                            <tr key={i}>
                              <td className="py-2 px-3 font-medium text-slate-800">{m.mapel}</td>
                              <td className="py-2 px-2 text-center font-bold text-blue-600">{m.nilai}</td>
                              <td className="py-2 px-2 text-center font-bold">{m.predikat}</td>
                              <td className="py-2 px-3 text-slate-600 text-[11px]">{m.capaian}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Save Button */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOcrResult(null);
                    setSelectedImage(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSaveToDatabase}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan ke Database Siswa SD</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
