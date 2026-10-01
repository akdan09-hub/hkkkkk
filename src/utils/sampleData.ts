import { Student, SchoolProfile } from '../types/student';

export const defaultSchoolProfile: SchoolProfile = {
  namaSekolah: 'SD NEGERI 01 NUSANTARA',
  npsn: '20219483',
  nss: '101026001001',
  akreditasi: 'A (Unggul)',
  alamat: 'Jl. Ki Hajar Dewantara No. 12, Kel. Sukamaju',
  desaKelurahan: 'Sukamaju',
  kecamatan: 'Cilengkrang',
  kabupatenKota: 'Kabupaten Bandung',
  provinsi: 'Jawa Barat',
  kodePos: '40392',
  telepon: '(022) 8721-9988',
  email: 'sdn01nusantara@kemdikbud.go.id',
  namaKepalaSekolah: 'Hj. Siti Aminah, S.Pd., M.M.',
  nipKepalaSekolah: '19740512 199803 2 004',
  namaOperator: 'Ahmad Fauzi, S.Kom.',
  tahunAjaranAktif: '2024/2025',
  semesterAktif: '1 (Ganjil)',
};

// Generates high-fidelity SVG mock images for instant OCR testing
export function generateSampleDocSvg(type: 'kk' | 'akta' | 'rapor'): string {
  if (type === 'kk') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600" style="background:#fcfbf7;font-family:'Courier New',monospace;color:#1e293b;">
      <rect width="900" height="600" fill="#fcfbf7" stroke="#cbd5e1" stroke-width="8"/>
      <rect x="20" y="20" width="860" height="560" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,2"/>
      
      <!-- Garuda Logo Header -->
      <g transform="translate(425, 30)">
        <circle cx="25" cy="20" r="18" fill="#f59e0b" opacity="0.2"/>
        <text x="25" y="26" font-size="22" text-anchor="middle" fill="#b45309" font-weight="bold">★</text>
      </g>
      <text x="450" y="78" font-size="20" text-anchor="middle" font-weight="bold" fill="#0f172a" font-family="'Plus Jakarta Sans',sans-serif">KARTU KELUARGA</text>
      <text x="450" y="98" font-size="14" text-anchor="middle" font-weight="bold" fill="#334155">No. 3204122304120015</text>
      
      <!-- Metadata Kolom Kiri & Kanan -->
      <text x="50" y="130" font-size="11" font-weight="bold">Nama Kepala Keluarga : BAMBANG HERMANTO</text>
      <text x="50" y="148" font-size="11">Alamat                 : Jl. Merdeka No. 45</text>
      <text x="50" y="166" font-size="11">RT/RW                  : 003 / 008</text>
      <text x="50" y="184" font-size="11">Desa/Kelurahan         : Sukamaju</text>
      
      <text x="520" y="130" font-size="11">Kecamatan          : Cilengkrang</text>
      <text x="520" y="148" font-size="11">Kabupaten/Kota     : Kabupaten Bandung</text>
      <text x="520" y="166" font-size="11">Kode Pos           : 40392</text>
      <text x="520" y="184" font-size="11">Provinsi           : Jawa Barat</text>

      <!-- Tabel Anggota Keluarga -->
      <rect x="40" y="205" width="820" height="26" fill="#e2e8f0" stroke="#64748b"/>
      <text x="50" y="222" font-size="10" font-weight="bold">No</text>
      <text x="80" y="222" font-size="10" font-weight="bold">Nama Lengkap</text>
      <text x="280" y="222" font-size="10" font-weight="bold">NIK</text>
      <text x="440" y="222" font-size="10" font-weight="bold">JK</text>
      <text x="470" y="222" font-size="10" font-weight="bold">Tempat Lahir</text>
      <text x="580" y="222" font-size="10" font-weight="bold">Tgl Lahir</text>
      <text x="670" y="222" font-size="10" font-weight="bold">Agama</text>
      <text x="740" y="222" font-size="10" font-weight="bold">Hubungan</text>

      <!-- Row 1 -->
      <rect x="40" y="231" width="820" height="26" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="52" y="248" font-size="10">1</text>
      <text x="80" y="248" font-size="10">BAMBANG HERMANTO</text>
      <text x="280" y="248" font-size="10" font-weight="bold">3204121005820001</text>
      <text x="445" y="248" font-size="10">L</text>
      <text x="470" y="248" font-size="10">Bandung</text>
      <text x="580" y="248" font-size="10">10-05-1982</text>
      <text x="670" y="248" font-size="10">ISLAM</text>
      <text x="740" y="248" font-size="10">KEPALA KELUARGA</text>

      <!-- Row 2 -->
      <rect x="40" y="257" width="820" height="26" fill="#f8fafc" stroke="#cbd5e1"/>
      <text x="52" y="274" font-size="10">2</text>
      <text x="80" y="274" font-size="10">SITI NURJANAH</text>
      <text x="280" y="274" font-size="10" font-weight="bold">3204125208850004</text>
      <text x="445" y="274" font-size="10">P</text>
      <text x="470" y="274" font-size="10">Cimahi</text>
      <text x="580" y="274" font-size="10">12-08-1985</text>
      <text x="670" y="274" font-size="10">ISLAM</text>
      <text x="740" y="274" font-size="10">ISTRI</text>

      <!-- Row 3 - Siswa Calon SD -->
      <rect x="40" y="283" width="820" height="28" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="52" y="301" font-size="10" font-weight="bold" fill="#1d4ed8">3</text>
      <text x="80" y="301" font-size="10" font-weight="bold" fill="#1d4ed8">MUHAMMAD RIZKY PRATAMA</text>
      <text x="280" y="301" font-size="10" font-weight="bold" fill="#1d4ed8">3204121508170003</text>
      <text x="445" y="301" font-size="10" font-weight="bold" fill="#1d4ed8">L</text>
      <text x="470" y="301" font-size="10" fill="#1d4ed8">Bandung</text>
      <text x="580" y="301" font-size="10" font-weight="bold" fill="#1d4ed8">15-08-2017</text>
      <text x="670" y="301" font-size="10" fill="#1d4ed8">ISLAM</text>
      <text x="740" y="301" font-size="10" font-weight="bold" fill="#1d4ed8">ANAK (CALON SISWA)</text>

      <!-- Tabel Bagian 2 (Pendidikan & Orang Tua) -->
      <rect x="40" y="330" width="820" height="24" fill="#e2e8f0" stroke="#64748b"/>
      <text x="50" y="346" font-size="9" font-weight="bold">No</text>
      <text x="80" y="346" font-size="9" font-weight="bold">Pendidikan Terakhir</text>
      <text x="280" y="346" font-size="9" font-weight="bold">Pekerjaan</text>
      <text x="490" y="346" font-size="9" font-weight="bold">Nama Ayah</text>
      <text x="680" y="346" font-size="9" font-weight="bold">Nama Ibu</text>

      <rect x="40" y="354" width="820" height="22" fill="#fff" stroke="#cbd5e1"/>
      <text x="52" y="369" font-size="9">3</text>
      <text x="80" y="369" font-size="9">BELUM SEKOLAH</text>
      <text x="280" y="369" font-size="9">TIDAK BEKERJA</text>
      <text x="490" y="369" font-size="9">BAMBANG HERMANTO</text>
      <text x="680" y="369" font-size="9">SITI NURJANAH</text>

      <!-- Footer & TTD -->
      <text x="650" y="440" font-size="10" text-anchor="center">Dikeluarkan Tanggal: 14-01-2020</text>
      <text x="650" y="460" font-size="10" font-weight="bold">KEPALA DINAS KEPENDUDUKAN</text>
      <text x="650" y="520" font-size="10" font-weight="bold">Drs. H. KUSNADI, M.Si</text>
      <text x="80" y="520" font-size="9" fill="#64748b">[QR Code Dukcapil Terverifikasi Kemendagri]</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  if (type === 'akta') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="920" viewBox="0 0 700 920" style="background:#fefce8;font-family:'Times New Roman',serif;color:#1e293b;">
      <rect width="700" height="920" fill="#fffdfa" stroke="#d97706" stroke-width="6"/>
      <rect x="25" y="25" width="650" height="870" fill="none" stroke="#b45309" stroke-width="2"/>
      
      <!-- Garuda Stamp -->
      <circle cx="350" cy="90" r="30" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <text x="350" y="98" font-size="28" text-anchor="middle" fill="#b45309">★</text>
      
      <text x="350" y="145" font-size="16" text-anchor="middle" font-weight="bold" fill="#0f172a" font-family="'Plus Jakarta Sans',sans-serif">REPUBLIK INDONESIA</text>
      <text x="350" y="168" font-size="12" text-anchor="middle" fill="#475569">PENCATATAN SIPIL</text>
      <text x="350" y="186" font-size="12" text-anchor="middle" fill="#475569">WARGA NEGARA INDONESIA</text>
      
      <line x1="100" y1="205" x2="600" y2="205" stroke="#b45309" stroke-width="1.5"/>
      
      <text x="350" y="240" font-size="22" text-anchor="middle" font-weight="bold" fill="#1e293b">KUTIPAN AKTA KELAHIRAN</text>
      <text x="350" y="265" font-size="13" text-anchor="middle" font-weight="bold" fill="#0369a1">Nomor Registrasi: 3204-LT-14072017-0042</text>
      
      <text x="80" y="320" font-size="14">Berdasarkan Akta Kelahiran Nomor:</text>
      <text x="80" y="340" font-size="14" font-weight="bold">3204-LT-14072017-0042</text>
      <text x="80" y="375" font-size="14">bahwa di <tspan font-weight="bold">BANDUNG</tspan></text>
      <text x="80" y="405" font-size="14">pada tanggal <tspan font-weight="bold">LIMA BELAS AGUSTUS DUA RIBU TUJUH BELAS</tspan></text>
      <text x="80" y="425" font-size="12" fill="#64748b">(15-08-2017)</text>
      
      <text x="80" y="465" font-size="14">telah lahir seorang anak <tspan font-weight="bold">LAKI-LAKI</tspan>:</text>
      <rect x="75" y="485" width="550" height="42" fill="#eff6ff" stroke="#3b82f6" rx="4"/>
      <text x="350" y="512" font-size="18" text-anchor="middle" font-weight="bold" fill="#1d4ed8" font-family="'Plus Jakarta Sans',sans-serif">MUHAMMAD RIZKY PRATAMA</text>
      
      <text x="80" y="555" font-size="13">NIK: <tspan font-weight="bold">3204121508170003</tspan></text>
      <text x="80" y="585" font-size="14">anak ke <tspan font-weight="bold">KEDUA (2)</tspan>, dari pasangan suami-istri:</text>
      <text x="80" y="620" font-size="15" font-weight="bold">BAMBANG HERMANTO</text>
      <text x="80" y="645" font-size="14">dan</text>
      <text x="80" y="670" font-size="15" font-weight="bold">SITI NURJANAH</text>
      
      <line x1="80" y1="710" x2="620" y2="710" stroke="#cbd5e1"/>
      
      <text x="420" y="745" font-size="12">Kutipan ini dikeluarkan di: Soreang</text>
      <text x="420" y="765" font-size="12">Pada tanggal: 25 Agustus 2017</text>
      <text x="420" y="785" font-size="12" font-weight="bold">Kepala Dinas Kependudukan dan</text>
      <text x="420" y="802" font-size="12" font-weight="bold">Pencatatan Sipil Kab. Bandung</text>
      
      <!-- Stempel Resmi -->
      <circle cx="500" cy="850" r="30" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3,1" opacity="0.6"/>
      <text x="500" y="855" font-size="8" text-anchor="middle" fill="#2563eb">DISDUKCAPIL</text>
      <text x="80" y="860" font-size="9" fill="#94a3b8">Barcode TTE Terverifikasi Balai Sertifikasi Elektronik (BSrE)</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Rapor Siswa
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="960" viewBox="0 0 750 960" style="background:#ffffff;font-family:'Plus Jakarta Sans',sans-serif;color:#1e293b;">
    <rect width="750" height="960" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    
    <!-- Header Rapor -->
    <rect x="0" y="0" width="750" height="110" fill="#0f172a"/>
    <text x="40" y="42" font-size="18" font-weight="bold" fill="#ffffff">RAPOR PESERTA DIDIK (KURIKULUM MERDEKA)</text>
    <text x="40" y="66" font-size="13" fill="#94a3b8">SEKOLAH DASAR NEGERI 01 NUSANTARA</text>
    <text x="40" y="88" font-size="11" fill="#cbd5e1">NPSN: 20219483 | Akreditasi A | Tahun Ajaran 2024/2025</text>
    
    <!-- Identitas Siswa -->
    <rect x="30" y="125" width="690" height="90" fill="#f8fafc" stroke="#e2e8f0" rx="6"/>
    <text x="50" y="150" font-size="12">Nama Peserta Didik : <tspan font-weight="bold" fill="#0f172a">MUHAMMAD RIZKY PRATAMA</tspan></text>
    <text x="50" y="172" font-size="12">NISN / NIS          : <tspan font-weight="bold" fill="#0369a1">0178492011</tspan> / 242501042</text>
    <text x="50" y="194" font-size="12">Sekolah Asal       : TK Islam Al-Fajar Bandung</text>
    
    <text x="460" y="150" font-size="12">Kelas / Rombel : <tspan font-weight="bold">Kelas 1A</tspan></text>
    <text x="460" y="172" font-size="12">Fase          : <tspan font-weight="bold">Fase A</tspan></text>
    <text x="460" y="194" font-size="12">Semester      : 1 (Ganjil)</text>
    
    <!-- Tabel Nilai -->
    <text x="35" y="240" font-size="14" font-weight="bold">A. LAPORAN CAPAIAN KOMPETENSI MATA PELAJARAN</text>
    <rect x="30" y="255" width="690" height="28" fill="#1e293b"/>
    <text x="45" y="274" font-size="11" font-weight="bold" fill="#ffffff">No</text>
    <text x="75" y="274" font-size="11" font-weight="bold" fill="#ffffff">Muatan Pembelajaran</text>
    <text x="280" y="274" font-size="11" font-weight="bold" fill="#ffffff">Nilai Akhir</text>
    <text x="360" y="274" font-size="11" font-weight="bold" fill="#ffffff">Predikat</text>
    <text x="430" y="274" font-size="11" font-weight="bold" fill="#ffffff">Deskripsi Capaian Kompetensi</text>

    <!-- Mapel 1 -->
    <rect x="30" y="283" width="690" height="34" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="47" y="304" font-size="11">1</text>
    <text x="75" y="304" font-size="11">Pendidikan Agama Islam</text>
    <text x="295" y="304" font-size="12" font-weight="bold">88</text>
    <text x="375" y="304" font-size="11" font-weight="bold" fill="#16a34a">A</text>
    <text x="430" y="304" font-size="10">Sangat baik memahami rukun iman &amp; doa harian</text>

    <!-- Mapel 2 -->
    <rect x="30" y="317" width="690" height="34" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="47" y="338" font-size="11">2</text>
    <text x="75" y="338" font-size="11">Pendidikan Pancasila</text>
    <text x="295" y="338" font-size="12" font-weight="bold">86</text>
    <text x="375" y="338" font-size="11" font-weight="bold" fill="#16a34a">B+</text>
    <text x="430" y="338" font-size="10">Mengenal simbol sila Pancasila dan gotong royong</text>

    <!-- Mapel 3 -->
    <rect x="30" y="351" width="690" height="34" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="47" y="372" font-size="11">3</text>
    <text x="75" y="372" font-size="11">Bahasa Indonesia</text>
    <text x="295" y="372" font-size="12" font-weight="bold">85</text>
    <text x="375" y="372" font-size="11" font-weight="bold" fill="#16a34a">B+</text>
    <text x="430" y="372" font-size="10">Menyimak cerita pendek, menulis huruf dengan rapi</text>

    <!-- Mapel 4 -->
    <rect x="30" y="385" width="690" height="34" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="47" y="406" font-size="11">4</text>
    <text x="75" y="406" font-size="11">Matematika</text>
    <text x="295" y="406" font-size="12" font-weight="bold">90</text>
    <text x="375" y="406" font-size="11" font-weight="bold" fill="#16a34a">A</text>
    <text x="430" y="406" font-size="10">Sangat mahir dalam membilang &amp; penjumlahan 1-20</text>

    <!-- Mapel 5 -->
    <rect x="30" y="419" width="690" height="34" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="47" y="440" font-size="11">5</text>
    <text x="75" y="440" font-size="11">PJOK (Olahraga)</text>
    <text x="295" y="440" font-size="12" font-weight="bold">88</text>
    <text x="375" y="440" font-size="11" font-weight="bold" fill="#16a34a">A</text>
    <text x="430" y="440" font-size="10">Aktif dan disiplin dalam gerak tubuh &amp; kebugaran</text>

    <!-- Mapel 6 -->
    <rect x="30" y="453" width="690" height="34" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="47" y="474" font-size="11">6</text>
    <text x="75" y="474" font-size="11">Seni Rupa</text>
    <text x="295" y="474" font-size="12" font-weight="bold">88</text>
    <text x="375" y="474" font-size="11" font-weight="bold" fill="#16a34a">A</text>
    <text x="430" y="474" font-size="10">Terampil memadukan pola warna dasar &amp; menggambar</text>

    <!-- Rata-rata -->
    <rect x="30" y="487" width="690" height="30" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="75" y="507" font-size="11" font-weight="bold" fill="#1e40af">RATA-RATA NILAI AKHIR</text>
    <text x="295" y="507" font-size="13" font-weight="bold" fill="#1e40af">87.5</text>
    <text x="375" y="507" font-size="11" font-weight="bold" fill="#1e40af">A</text>

    <!-- Kehadiran -->
    <text x="35" y="550" font-size="13" font-weight="bold">B. KEHADIRAN / KETIDAKHADIRAN</text>
    <rect x="30" y="562" width="690" height="40" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="60" y="587" font-size="11">Sakit: <tspan font-weight="bold">1 hari</tspan></text>
    <text x="220" y="587" font-size="11">Izin: <tspan font-weight="bold">0 hari</tspan></text>
    <text x="380" y="587" font-size="11">Tanpa Keterangan: <tspan font-weight="bold">0 hari</tspan></text>

    <!-- Catatan Guru -->
    <text x="35" y="630" font-size="13" font-weight="bold">C. CATATAN WALI KELAS &amp; PERKEMBANGAN KARAKTER</text>
    <rect x="30" y="642" width="690" height="60" fill="#fffbeb" stroke="#fde68a" rx="4"/>
    <text x="45" y="665" font-size="11" fill="#78350f">"Ananda Rizky memiliki sikap santun, rasa ingin tahu tinggi, serta aktif bertanya di kelas.</text>
    <text x="45" y="683" font-size="11" fill="#78350f">Pertahankan semangat belajar dan terus kembangkan kemampuan literasi membacanya."</text>

    <!-- Tanda Tangan -->
    <text x="100" y="760" font-size="11" text-anchor="middle">Mengetahui Orang Tua / Wali,</text>
    <text x="100" y="830" font-size="11" font-weight="bold" text-anchor="middle">( BAMBANG HERMANTO )</text>

    <text x="600" y="740" font-size="11" text-anchor="middle">Bandung, 20 Desember 2024</text>
    <text x="600" y="760" font-size="11" text-anchor="middle">Guru Kelas / Wali Kelas,</text>
    <text x="600" y="830" font-size="11" font-weight="bold" text-anchor="middle">DEWI RATNASARI, S.Pd.</text>
    <text x="600" y="845" font-size="9" text-anchor="middle">NIP. 19890415 201503 2 003</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const initialStudents: Student[] = [
  {
    id: 'std-001',
    nisn: '0178492011',
    nis: '242501042',
    nik: '3204121508170003',
    nama: 'MUHAMMAD RIZKY PRATAMA',
    jenisKelamin: 'L',
    tempatLahir: 'Bandung',
    tanggalLahir: '2017-08-15',
    agama: 'ISLAM',
    rombel: 'Kelas 1A',
    tingkatKelas: 1,
    tahunAjaran: '2024/2025',
    semester: '1 (Ganjil)',
    alamat: {
      jalan: 'Jl. Merdeka No. 45',
      rt: '003',
      rw: '008',
      dusunDesa: 'Sukamaju',
      kecamatan: 'Cilengkrang',
      kabupatenKota: 'Kabupaten Bandung',
      provinsi: 'Jawa Barat',
      kodePos: '40392',
    },
    keluarga: {
      nomorKK: '3204122304120015',
      namaKepalaKeluarga: 'BAMBANG HERMANTO',
      namaAyah: 'BAMBANG HERMANTO',
      nikAyah: '3204121005820001',
      pekerjaanAyah: 'KARYAWAN SWASTA',
      namaIbu: 'SITI NURJANAH',
      nikIbu: '3204125208850004',
      pekerjaanIbu: 'GURU',
      teleponOrtu: '081223456789',
      penerimaKPS_PIP: false,
    },
    akta: {
      nomorAkta: '3204-LT-14072017-0042',
      anakKe: 2,
      dinasPenerbit: 'Dinas Kependudukan dan Pencatatan Sipil Kabupaten Bandung',
      tanggalTerbit: '2017-08-25',
    },
    rapor: {
      asalSekolah: 'TK Islam Al-Fajar Bandung',
      fase: 'Fase A',
      nilaiRataRata: 87.5,
      nilaiMapel: [
        { mapel: 'Pendidikan Agama Islam', nilai: 88, predikat: 'A', capaian: 'Sangat baik memahami rukun iman & doa harian' },
        { mapel: 'Pendidikan Pancasila', nilai: 86, predikat: 'B+', capaian: 'Mengenal simbol sila Pancasila' },
        { mapel: 'Bahasa Indonesia', nilai: 85, predikat: 'B+', capaian: 'Menyimak cerita pendek, menulis huruf rapi' },
        { mapel: 'Matematika', nilai: 90, predikat: 'A', capaian: 'Sangat mahir membilang 1-20' },
        { mapel: 'PJOK', nilai: 88, predikat: 'A', capaian: 'Aktif dalam gerak dasar' },
        { mapel: 'Seni Rupa', nilai: 88, predikat: 'A', capaian: 'Kreatif memadukan warna primer' },
      ],
      kehadiran: { sakit: 1, izin: 0, tanpaKeterangan: 0 },
      catatanWaliKelas: 'Ananda memiliki antusiasme belajar tinggi dan gemar membaca di pojok baca.',
      statusKenaikan: 'Memenuhi Kriteria Ketercapaian Pembelajaran',
    },
    berkas: {
      kk: { status: 'LENGKAP', fileName: 'KK_RizkyPratama.jpg', scanDate: '2024-07-10' },
      akta: { status: 'LENGKAP', fileName: 'Akta_RizkyPratama.jpg', scanDate: '2024-07-10' },
      rapor: { status: 'LENGKAP', fileName: 'Rapor_TK_RizkyPratama.pdf', scanDate: '2024-07-12' },
    },
    statusVerifikasi: 'VALID',
    catatanOperator: 'Data lengkap 100%, sinkronisasi Dapodik terverifikasi Dukcapil.',
    createdAt: '2024-07-10T08:30:00Z',
    updatedAt: '2024-09-15T10:00:00Z',
  },
  {
    id: 'std-002',
    nisn: '0165439902',
    nis: '232402018',
    nik: '3204126203160002',
    nama: 'AISYAH PUTRI MAHARANI',
    jenisKelamin: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2016-03-22',
    agama: 'ISLAM',
    rombel: 'Kelas 2A',
    tingkatKelas: 2,
    tahunAjaran: '2024/2025',
    semester: '1 (Ganjil)',
    alamat: {
      jalan: 'Kp. Pasir Impun No. 12',
      rt: '002',
      rw: '004',
      dusunDesa: 'Sukamaju',
      kecamatan: 'Cilengkrang',
      kabupatenKota: 'Kabupaten Bandung',
      provinsi: 'Jawa Barat',
      kodePos: '40392',
    },
    keluarga: {
      nomorKK: '3204121908100088',
      namaKepalaKeluarga: 'HENDRA WIJAYA',
      namaAyah: 'HENDRA WIJAYA',
      nikAyah: '3204121102790005',
      pekerjaanAyah: 'BURUH HARIAN LEPAS',
      namaIbu: 'ENDAH SULASTRI',
      nikIbu: '3204125506820003',
      pekerjaanIbu: 'IBU RUMAH TANGGA',
      teleponOrtu: '085799112233',
      penerimaKPS_PIP: true,
      noKKS_KPS: 'KPS-2024-99812',
    },
    akta: {
      nomorAkta: '3204-LT-29032016-0112',
      anakKe: 1,
      dinasPenerbit: 'Dinas Kependudukan dan Pencatatan Sipil Kabupaten Bandung',
      tanggalTerbit: '2016-04-05',
    },
    rapor: {
      asalSekolah: 'SD NEGERI 01 NUSANTARA',
      fase: 'Fase A',
      nilaiRataRata: 89.2,
      nilaiMapel: [
        { mapel: 'Pendidikan Agama Islam', nilai: 92, predikat: 'A', capaian: 'Sangat baik dalam hafalan surah pendek' },
        { mapel: 'Pendidikan Pancasila', nilai: 88, predikat: 'A', capaian: 'Sangat patuh aturan kelas' },
        { mapel: 'Bahasa Indonesia', nilai: 88, predikat: 'A', capaian: 'Lancar membaca dongeng dan puisi anak' },
        { mapel: 'Matematika', nilai: 86, predikat: 'B+', capaian: 'Memahami nilai tempat puluhan dan satuan' },
        { mapel: 'PJOK', nilai: 90, predikat: 'A', capaian: 'Lincah dan sportif' },
        { mapel: 'Seni Rupa', nilai: 91, predikat: 'A', capaian: 'Bakat menggambar sangat menonjol' },
      ],
      kehadiran: { sakit: 0, izin: 1, tanpaKeterangan: 0 },
      catatanWaliKelas: 'Aisyah sangat cerdas dan rajin, direkomendasikan beasiswa PIP jalur prasejahtera.',
      statusKenaikan: 'Naik ke Kelas 2',
    },
    berkas: {
      kk: { status: 'LENGKAP', fileName: 'KK_Aisyah.jpg', scanDate: '2023-06-20' },
      akta: { status: 'LENGKAP', fileName: 'Akta_Aisyah.jpg', scanDate: '2023-06-20' },
      rapor: { status: 'LENGKAP', fileName: 'Rapor_Kelas1_Aisyah.pdf', scanDate: '2024-06-25' },
    },
    statusVerifikasi: 'VALID',
    catatanOperator: 'Penerima Bantuan PIP SK Tahap 1 2024 telah diinput ke Sipintar.',
    createdAt: '2023-06-20T09:00:00Z',
    updatedAt: '2024-08-10T11:20:00Z',
  },
  {
    id: 'std-003',
    nisn: '0159823145',
    nis: '222303009',
    nik: '3204121804150007',
    nama: 'DIMAS SETIAWAN',
    jenisKelamin: 'L',
    tempatLahir: 'Semarang',
    tanggalLahir: '2015-04-18',
    agama: 'ISLAM',
    rombel: 'Kelas 3B',
    tingkatKelas: 3,
    tahunAjaran: '2024/2025',
    semester: '1 (Ganjil)',
    alamat: {
      jalan: 'Gg. Saluyu 3 No. 8',
      rt: '001',
      rw: '006',
      dusunDesa: 'Sukamaju',
      kecamatan: 'Cilengkrang',
      kabupatenKota: 'Kabupaten Bandung',
      provinsi: 'Jawa Barat',
      kodePos: '40392',
    },
    keluarga: {
      nomorKK: '3204120901140023',
      namaKepalaKeluarga: 'SUGENG PRIYONO',
      namaAyah: 'SUGENG PRIYONO',
      nikAyah: '3374011209770001',
      pekerjaanAyah: 'WIRASWASTA',
      namaIbu: 'TRI WAHYUNI',
      nikIbu: '3374015011800004',
      pekerjaanIbu: 'WIRASWASTA',
      teleponOrtu: '081399887766',
      penerimaKPS_PIP: false,
    },
    akta: {
      nomorAkta: '',
      anakKe: 1,
      dinasPenerbit: '',
      tanggalTerbit: '',
    },
    rapor: {
      asalSekolah: 'SD NEGERI 01 NUSANTARA',
      fase: 'Fase B',
      nilaiRataRata: 82.4,
      nilaiMapel: [
        { mapel: 'Pendidikan Agama Islam', nilai: 84, predikat: 'B+', capaian: 'Cukup baik' },
        { mapel: 'Pendidikan Pancasila', nilai: 82, predikat: 'B', capaian: 'Memahami hak dan kewajiban' },
        { mapel: 'Bahasa Indonesia', nilai: 80, predikat: 'B', capaian: 'Perlu latihan menulis paragraf' },
        { mapel: 'Matematika', nilai: 85, predikat: 'B+', capaian: 'Perkalian dan pembagian dasar baik' },
        { mapel: 'IPAS', nilai: 83, predikat: 'B', capaian: 'Memahami ekosistem di lingkungan sekitar' },
      ],
      kehadiran: { sakit: 2, izin: 1, tanpaKeterangan: 1 },
      catatanWaliKelas: 'Fokus belajar cukup baik, perlu terus didorong dalam tugas kelompok.',
      statusKenaikan: 'Naik ke Kelas 3',
    },
    berkas: {
      kk: { status: 'LENGKAP', fileName: 'KK_Sugeng_Priyono.pdf', scanDate: '2022-07-02' },
      akta: { status: 'BELUM', fileName: '' },
      rapor: { status: 'LENGKAP', fileName: 'Rapor_Kelas2_Dimas.pdf', scanDate: '2024-06-26' },
    },
    statusVerifikasi: 'PERLU_PERBAIKAN',
    catatanOperator: 'Akta Kelahiran belum diserahkan oleh orang tua. Menunggu konfirmasi mutasi dari Disdukcapil Semarang.',
    createdAt: '2022-07-02T10:15:00Z',
    updatedAt: '2024-09-02T08:45:00Z',
  },
  {
    id: 'std-004',
    nisn: '0142345678',
    nis: '212204015',
    nik: '3204125010140006',
    nama: 'NURUL FADHILAH',
    jenisKelamin: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2014-10-10',
    agama: 'ISLAM',
    rombel: 'Kelas 4A',
    tingkatKelas: 4,
    tahunAjaran: '2024/2025',
    semester: '1 (Ganjil)',
    alamat: {
      jalan: 'Jl. Raya Cipadung No. 70',
      rt: '004',
      rw: '002',
      dusunDesa: 'Sukamaju',
      kecamatan: 'Cilengkrang',
      kabupatenKota: 'Kabupaten Bandung',
      provinsi: 'Jawa Barat',
      kodePos: '40392',
    },
    keluarga: {
      nomorKK: '3204120108130099',
      namaKepalaKeluarga: 'AHMAD HIDAYAT',
      namaAyah: 'AHMAD HIDAYAT',
      nikAyah: '3204121503760002',
      pekerjaanAyah: 'PNS / ASN',
      namaIbu: 'LINA MARLINA',
      nikIbu: '3204124905790008',
      pekerjaanIbu: 'PNS / GURU',
      teleponOrtu: '081211223344',
      penerimaKPS_PIP: false,
    },
    akta: {
      nomorAkta: '3204-LT-20102014-0091',
      anakKe: 1,
      dinasPenerbit: 'Dinas Kependudukan dan Pencatatan Sipil Kabupaten Bandung',
      tanggalTerbit: '2014-11-01',
    },
    rapor: {
      asalSekolah: 'SD NEGERI 01 NUSANTARA',
      fase: 'Fase B',
      nilaiRataRata: 92.8,
      nilaiMapel: [
        { mapel: 'Pendidikan Agama Islam', nilai: 95, predikat: 'A', capaian: 'Prestasi istimewa MTQ' },
        { mapel: 'Pendidikan Pancasila', nilai: 92, predikat: 'A', capaian: 'Pemimpin upacara teladan' },
        { mapel: 'Bahasa Indonesia', nilai: 94, predikat: 'A', capaian: 'Juara 1 Lomba Cipta Puisi tingkat kecamatan' },
        { mapel: 'Matematika', nilai: 90, predikat: 'A', capaian: 'Sangat mahir pecahan dan geometri' },
        { mapel: 'IPAS', nilai: 92, predikat: 'A', capaian: 'Peneliti cilik sains lingkungan' },
        { mapel: 'Bahasa Inggris', nilai: 94, predikat: 'A', capaian: 'Percakapan sangat lancar' },
      ],
      kehadiran: { sakit: 0, izin: 0, tanpaKeterangan: 0 },
      catatanWaliKelas: 'Siswa berprestasi peringkat 1 di kelas. Berperilaku teladan dan mandiri.',
      statusKenaikan: 'Naik ke Kelas 4',
    },
    berkas: {
      kk: { status: 'LENGKAP', fileName: 'KK_Ahmad_Hidayat.pdf', scanDate: '2021-06-15' },
      akta: { status: 'LENGKAP', fileName: 'Akta_Nurul.jpg', scanDate: '2021-06-15' },
      rapor: { status: 'LENGKAP', fileName: 'Rapor_Kelas3_Nurul.pdf', scanDate: '2024-06-24' },
    },
    statusVerifikasi: 'VALID',
    catatanOperator: 'Berkas lengkap dan data padan Dukcapil Pusat.',
    createdAt: '2021-06-15T08:00:00Z',
    updatedAt: '2024-09-10T14:30:00Z',
  },
  {
    id: 'std-005',
    nisn: '0139871234',
    nis: '202105022',
    nik: '3204121206130005',
    nama: 'KEVIN JONATHAN SIMANJUNTAK',
    jenisKelamin: 'L',
    tempatLahir: 'Medan',
    tanggalLahir: '2013-06-12',
    agama: 'KRISTEN',
    rombel: 'Kelas 5B',
    tingkatKelas: 5,
    tahunAjaran: '2024/2025',
    semester: '1 (Ganjil)',
    alamat: {
      jalan: 'Komp. Graha Asri Blok B No. 4',
      rt: '005',
      rw: '007',
      dusunDesa: 'Sukamaju',
      kecamatan: 'Cilengkrang',
      kabupatenKota: 'Kabupaten Bandung',
      provinsi: 'Jawa Barat',
      kodePos: '40392',
    },
    keluarga: {
      nomorKK: '3204121809180011',
      namaKepalaKeluarga: 'POLTAK SIMANJUNTAK',
      namaAyah: 'POLTAK SIMANJUNTAK',
      nikAyah: '1271041002750003',
      pekerjaanAyah: 'WIRASWASTA',
      namaIbu: 'TIURMA BORU TOBING',
      nikIbu: '1271045204780007',
      pekerjaanIbu: 'PERAWAT',
      teleponOrtu: '081288990011',
      penerimaKPS_PIP: false,
    },
    akta: {
      nomorAkta: '1271-LT-25062013-0089',
      anakKe: 2,
      dinasPenerbit: 'Dinas Kependudukan dan Pencatatan Sipil Kota Medan',
      tanggalTerbit: '2013-07-01',
    },
    rapor: {
      asalSekolah: 'SD NEGERI 01 NUSANTARA',
      fase: 'Fase C',
      nilaiRataRata: 85.0,
      nilaiMapel: [
        { mapel: 'Pendidikan Agama Kristen', nilai: 88, predikat: 'A', capaian: 'Aktif dalam kegiatan kerohanian' },
        { mapel: 'Pendidikan Pancasila', nilai: 84, predikat: 'B+', capaian: 'Toleran dan menghargai perbedaan' },
        { mapel: 'Bahasa Indonesia', nilai: 82, predikat: 'B', capaian: 'Baik dalam presentasi lisan' },
        { mapel: 'Matematika', nilai: 88, predikat: 'A', capaian: 'Cepat dalam perhitungan aljabar dasar' },
        { mapel: 'IPAS', nilai: 86, predikat: 'B+', capaian: 'Memahami organ tubuh manusia' },
        { mapel: 'PJOK', nilai: 92, predikat: 'A', capaian: 'Anggota tim bulu tangkis sekolah' },
      ],
      kehadiran: { sakit: 1, izin: 1, tanpaKeterangan: 0 },
      catatanWaliKelas: 'Kevin memiliki semangat sportivitas tinggi dan gemar berolahraga.',
      statusKenaikan: 'Naik ke Kelas 5',
    },
    berkas: {
      kk: { status: 'LENGKAP', fileName: 'KK_Poltak.pdf', scanDate: '2020-07-01' },
      akta: { status: 'LENGKAP', fileName: 'Akta_Kevin.jpg', scanDate: '2020-07-01' },
      rapor: { status: 'LENGKAP', fileName: 'Rapor_Kelas4_Kevin.pdf', scanDate: '2024-06-25' },
    },
    statusVerifikasi: 'VALID',
    catatanOperator: 'Data lengkap 100%, sinkron.',
    createdAt: '2020-07-01T09:30:00Z',
    updatedAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 'std-006',
    nisn: '0123984561',
    nis: '192006004',
    nik: '3204122011120008',
    nama: 'BAGAS ARDIANSYAH',
    jenisKelamin: 'L',
    tempatLahir: 'Bandung',
    tanggalLahir: '2012-11-20',
    agama: 'ISLAM',
    rombel: 'Kelas 6A',
    tingkatKelas: 6,
    tahunAjaran: '2024/2025',
    semester: '1 (Ganjil)',
    alamat: {
      jalan: 'Kp. Babakan RT 03 RW 09',
      rt: '003',
      rw: '009',
      dusunDesa: 'Sukamaju',
      kecamatan: 'Cilengkrang',
      kabupatenKota: 'Kabupaten Bandung',
      provinsi: 'Jawa Barat',
      kodePos: '40392',
    },
    keluarga: {
      nomorKK: '3204121501100045',
      namaKepalaKeluarga: 'DEDI SURYADI',
      namaAyah: 'DEDI SURYADI',
      nikAyah: '3204120807720004',
      pekerjaanAyah: 'PETANI / PEKEBUN',
      namaIbu: 'MIMIN RUKMINI',
      nikIbu: '3204124409760002',
      pekerjaanIbu: 'IBU RUMAH TANGGA',
      teleponOrtu: '085812348765',
      penerimaKPS_PIP: true,
      noKKS_KPS: 'KPS-2024-77120',
    },
    akta: {
      nomorAkta: '3204-LT-01122012-0056',
      anakKe: 3,
      dinasPenerbit: 'Dinas Kependudukan dan Pencatatan Sipil Kabupaten Bandung',
      tanggalTerbit: '2012-12-05',
    },
    rapor: {
      asalSekolah: 'SD NEGERI 01 NUSANTARA',
      fase: 'Fase C',
      nilaiRataRata: 83.6,
      nilaiMapel: [
        { mapel: 'Pendidikan Agama Islam', nilai: 85, predikat: 'B+', capaian: 'Hafalan juz amma lancar' },
        { mapel: 'Pendidikan Pancasila', nilai: 82, predikat: 'B', capaian: 'Memahami tata kelola pemerintahan' },
        { mapel: 'Bahasa Indonesia', nilai: 84, predikat: 'B+', capaian: 'Menulis teks pidato dengan baik' },
        { mapel: 'Matematika', nilai: 80, predikat: 'B', capaian: 'Perlu bimbingan volume bangun ruang' },
        { mapel: 'IPAS', nilai: 86, predikat: 'B+', capaian: 'Kreatif membuat rangkaian listrik' },
      ],
      kehadiran: { sakit: 2, izin: 0, tanpaKeterangan: 0 },
      catatanWaliKelas: 'Persiapan Ujian Akhir Sekolah berjalan baik, perlu jam belajar tambahan matematika.',
      statusKenaikan: 'Naik ke Kelas 6 (Calon Lulusan)',
    },
    berkas: {
      kk: { status: 'LENGKAP', fileName: 'KK_Dedi_Suryadi.jpg', scanDate: '2019-07-05' },
      akta: { status: 'LENGKAP', fileName: 'Akta_Bagas.jpg', scanDate: '2019-07-05' },
      rapor: { status: 'LENGKAP', fileName: 'Rapor_Kelas5_Bagas.pdf', scanDate: '2024-06-25' },
    },
    statusVerifikasi: 'VALID',
    catatanOperator: 'Calon peserta Asesmen Nasional (ANBK) & kelulusan SD 2025.',
    createdAt: '2019-07-05T08:00:00Z',
    updatedAt: '2024-09-12T16:00:00Z',
  },
];
