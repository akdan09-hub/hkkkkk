export type DocumentType = 'kk' | 'akta' | 'rapor' | 'auto_detect';

export type VerificationStatus = 'VALID' | 'PERLU_PERBAIKAN' | 'DRAFT';

export type FileStatus = 'LENGKAP' | 'BELUM' | 'PERIKSA';

export interface SubjectGrade {
  mapel: string;
  nilai: number;
  predikat: string;
  capaian?: string;
}

export interface AttendanceRecord {
  sakit: number;
  izin: number;
  tanpaKeterangan: number;
}

export interface AttachedDocument {
  status: FileStatus;
  fileData?: string; // base64 or URL
  fileName?: string;
  scanDate?: string;
  extractedMeta?: Record<string, any>;
}

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  nik: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  agama: string;
  rombel: string; // misal "Kelas 1A", "Kelas 2B", dst.
  tingkatKelas: number; // 1-6
  tahunAjaran: string; // misal "2024/2025"
  semester: string; // "1 (Ganjil)" atau "2 (Genap)"
  
  // Alamat sesuai KK
  alamat: {
    jalan: string;
    rt: string;
    rw: string;
    dusunDesa: string;
    kecamatan: string;
    kabupatenKota: string;
    provinsi: string;
    kodePos: string;
  };

  // Data Keluarga
  keluarga: {
    nomorKK: string;
    namaKepalaKeluarga: string;
    namaAyah: string;
    nikAyah: string;
    pekerjaanAyah: string;
    namaIbu: string;
    nikIbu: string;
    pekerjaanIbu: string;
    teleponOrtu: string;
    penerimaKPS_PIP: boolean;
    noKKS_KPS?: string;
  };

  // Data Akta Kelahiran
  akta: {
    nomorAkta: string;
    anakKe: number;
    dinasPenerbit: string;
    tanggalTerbit: string;
  };

  // Data Rapor / Prestasi Terakhir
  rapor: {
    asalSekolah: string;
    fase: string; // Fase A, Fase B, Fase C
    nilaiRataRata: number;
    nilaiMapel: SubjectGrade[];
    kehadiran: AttendanceRecord;
    catatanWaliKelas: string;
    statusKenaikan: string;
  };

  // Status Kelengkapan Berkas Fisik / Scan
  berkas: {
    kk: AttachedDocument;
    akta: AttachedDocument;
    rapor: AttachedDocument;
  };

  statusVerifikasi: VerificationStatus;
  catatanOperator: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  nss: string;
  akreditasi: string;
  alamat: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaOperator: string;
  tahunAjaranAktif: string;
  semesterAktif: string;
}

export interface KKAnggotaExtracted {
  nik: string;
  namaLengkap: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  pendidikan: string;
  jenisPekerjaan: string;
  statusHubungan: string;
  namaAyah: string;
  namaIbu: string;
  isCandidateStudent?: boolean;
}

export interface ExtractedOCRResult {
  detectedType: 'kk' | 'akta' | 'rapor';
  confidenceScore: number;
  rawSummary: string;
  kkData?: {
    nomorKK: string;
    namaKepalaKeluarga: string;
    alamat: string;
    rtRw: string;
    desaKelurahan: string;
    kecamatan: string;
    kabupatenKota: string;
    provinsi: string;
    kodePos: string;
    anggotaKeluarga: KKAnggotaExtracted[];
    selectedStudentIndex?: number;
  };
  aktaData?: {
    nomorAkta: string;
    namaAnak: string;
    nik: string;
    jenisKelamin: 'L' | 'P';
    tempatLahir: string;
    tanggalLahir: string;
    anakKe: number;
    namaAyah: string;
    namaIbu: string;
    dinasPenerbit: string;
    tanggalTerbit: string;
  };
  raporData?: {
    namaSiswa: string;
    nisn: string;
    nis: string;
    namaSekolah: string;
    kelas: string;
    fase: string;
    semester: string;
    tahunAjaran: string;
    nilaiRataRata: number;
    mataPelajaran: SubjectGrade[];
    kehadiran: AttendanceRecord;
    catatanWaliKelas: string;
    statusKenaikan: string;
  };
}
