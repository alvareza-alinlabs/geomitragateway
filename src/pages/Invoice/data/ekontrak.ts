export const ekontrakData = {
  header: {
    title: "Perjanjian Kerja Sama Digital (<i>E-Kontrak</i>)",
    subtitle: "Dokumen legalitas formal pengembangan spesifikasi, hak, dan kewajiban sistem Geo Mitra Gateway.",
    publishDate: "23 Mei 2026",
    documentNumber: "KTR/2026/05/0012",
    status: "Mengikat secara elektronik sesuai UU ITE",
  },
  mukadimah: {
    intro: "Perjanjian Kerja Sama Pembuatan Aplikasi <i>Web</i> dan Dasbor Sistem (\"Perjanjian\") ini dibuat dan disepakati secara mutlak dan mengikat melalui sarana elektronik pada tanggal dua puluh tiga bulan Mei tahun dua ribu dua puluh enam (23-05-2026), oleh dan antara:",
    pihakPertama: {
      nama: "Alvareza Hilka Pratama",
      mewakili: "AlinLabs Indonesia",
      peran: "pelaksana teknis yang selanjutnya dalam Perjanjian ini disebut sebagai \"PIHAK PERTAMA\"",
    },
    pihakKedua: {
      nama: "Harry M. Gultom",
      mewakili: "Pemesan",
      peran: "selaku pengguna jasa dan pemilik dari sistem yang akan dibangun, selanjutnya dalam Perjanjian ini disebut sebagai \"PIHAK KEDUA\"",
    },
    kesepakatan: "Dalam Perjanjian ini, PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama selanjutnya disebut \"PARA PIHAK\" dan secara sendiri-sendiri disebut \"PIHAK\". PARA PIHAK sepakat untuk saling mengikatkan diri dalam Perjanjian berlandaskan ketentuan-ketentuan berikut:"
  },
  pasal: [
    {
      title: "Pasal 1 - Tujuan dan Ruang Lingkup Pekerjaan",
      ayat: [
        {
          nomor: "1.1.",
          teks: "PIHAK KEDUA dengan ini menunjuk dan memberi tugas kepada PIHAK PERTAMA, dan PIHAK PERTAMA menerima penunjukan tersebut untuk merancang, mengembangkan, melakukan uji coba, serta men-<i>deploy</i> sistem/perangkat lunak yang dinamakan \"Geo Mitra Gateway\" (selanjutnya disebut \"Sistem\")."
        },
        {
          nomor: "1.2.",
          teks: "Ruang lingkup Sistem sebagaimana dimaksud pada ayat 1.1 mencakup, namun tidak terbatas pada rancangan komponen utama sebagai berikut:",
          list: [
            "<i>Front-End</i> Publik (Beranda, Katalog Produk, Detail Produk Publik, Formulir <i>Appointment</i>).",
            "Sistem Otentikasi Terpusat untuk administrator dan staf sesuai dengan standar keamanan.",
            "Dasbor Utama (Ringkasan <i>KPI</i>, Peta Distribusi Mitra/<i>Interactive Map</i>).",
            "Modul Manajemen Data (Daftar Klien, Transaksi, Penjualan/<i>Sales</i>, Inventaris Produk).",
            "Infrastruktur <i>Cloud</i>, Konfigurasi <i>DNS/Domain</i>, <i>SSL</i>, dan proses <i>Deployment</i> Publik (<i>Host</i>)."
          ]
        },
        {
          nomor: "1.3.",
          teks: "Seluruh fitur, batasan, alur, dan fungsi yang dikerjakan merujuk kepada Rincian Biaya (<i>Invoice</i>) yang tidak terpisahkan dari Perjanjian ini. Fitur atau modul di luar Rincian Biaya akan diperlakukan sebagai <i>Change Request</i> (<i>CR</i>) atau Permintaan Perubahan yang akan diatur secara tersendiri."
        }
      ]
    },
    {
      title: "Pasal 2 - Hak dan Kewajiban Para Pihak",
      ayat: [
        {
          nomor: "2.1.",
          teks: "Hak dan Kewajiban PIHAK PERTAMA:",
          list: [
            "Berhak menerima pembayaran secara penuh dan tepat waktu sesuai dengan nominal dan jadwal termin yang disebut dalam Pasal 3.",
            "Berkewajiban untuk menyelesaikan pembuatan Sistem sesuai ruang lingkup kerja dan tenggat waktu yang ditetapkan.",
            "Berhak mendapatkan segala informasi, referensi data, logo, dokumen legal, atau aset visual yang otentik dari PIHAK KEDUA untuk kepentingan pembangunan Sistem.",
            "Berkewajiban menjaga kerahasiaan seluruh materi dan informasi internal bisnis PIHAK KEDUA yang diserahkan untuk proses pengembangan sesuai dengan pedoman Undang-Undang Perlindungan Data Pribadi (UU PDP)."
          ]
        },
        {
          nomor: "2.2.",
          teks: "Hak dan Kewajiban PIHAK KEDUA:",
          list: [
            "Berkewajiban melakukan pembayaran biaya proyek secara progresif dan penuh tanpa potongan kepada rekening resmi PIHAK PERTAMA.",
            "Berhak untuk mendapatkan hasil akhir berupa Sistem yang fungsional, <i>source-code</i> terkompilasi, serta kendali atas infrastruktur (<i>domain</i>) setelah dinyatakan Lunas.",
            "Berkewajiban memberikan kooperasi penuh untuk pengujian fungsi (<i>User Acceptance Test</i>) selambat-lambatnya 3 hari setelah modul diserahkan oleh PIHAK PERTAMA."
          ]
        }
      ]
    },
    {
      title: "Pasal 3 - Nilai Proyek & Metodologi Pembayaran",
      ayat: [
        {
          nomor: "3.1.",
          teks: "Nilai seluruh investasi proyek pembuatan Sistem ini adalah Rp6.352.500 (Enam Juta Tiga Ratus Lima Puluh Dua Ribu Lima Ratus Rupiah), yang merupakan nilai final setelah program Promosi pada bulan berjalan diaktifkan."
        },
        {
           nomor: "3.2.",
           teks: "Agar proyek dapat dilaksanakan secara simultan dan demi kepastian kesepakatan, PARA PIHAK sepakat menggunakan termin pembayaran berikut:",
           list: [
             "Termin I (Uang Muka/<i>DP</i>) Sebesar Rp3.000.000 (LUNAS): Sebagai syarat dimulainya pekerjaan operasional, desain infrastruktur dan pemesanan <i>domain/server</i> dasar. <i>DP</i> ini bersifat <i>Non-Refundable</i> (tidak dapat diuangkan kembali) bilamana proyek dihentikan secara sepihak oleh PIHAK KEDUA.",
             "Termin II (Proyek Selesai/<i>UAT</i>) Sebesar Rp2.082.000: Dibayarkan setelah seluruh rancangan Sistem dirampungkan, siap diperasikan dengan status Uji Coba Berhasil (<i>Staging Success</i>), dan dikonfirmasi kelayakannya.",
             "Termin III (Serah Terima/<i>Handover</i>) Sebesar Rp1.270.500: Dibayarkan pada tahap final serah terima (<i>handover delivery</i>), termasuk penyerahan otorisasi <i>domain</i>, penerapan revisi ringan final, dan pengaktifan <i>server</i> rilis ke publik (<i>Production Release</i>)."
           ]
        },
        {
          nomor: "3.3.",
          teks: "Segala transaksi finansial yang sah hanya diakui jika dikirimkan/ditransfer ke rekening resmi bank nasional atau institusi pembayaran digital milik PT/CV AlinLabs Indonesia atau entitas sah yang ditunjuk dalam surat tagihan."
        }
      ]
    },
    {
      title: "Pasal 4 - Jadwal dan Estimasi Pengerjaan",
      ayat: [
        {
          nomor: "4.1.",
          teks: "Proses pengerjaan Sistem diestimasi memakan waktu yang wajar terhitung sejak pembayaran Termin I (Uang Muka/<i>DP</i>) diterima dengan sah dan seluruh referensi data awal yang dibutuhkan telah diserahkan oleh PIHAK KEDUA."
        },
        {
          nomor: "4.2.",
          teks: "Estimasi waktu tersebut dapat berubah atau diperpanjang secara proporsional apabila terdapat keterlambatan penyampaian data/aset dari PIHAK KEDUA, terjadinya <i>Force Majeure</i>, batas antrean <i>feedback</i>, atau adanya penambahan fitur (<i>Change Request</i>) di tengah berjalannya proyek."
        }
      ]
    },
    {
      title: "Pasal 5 - Revisi dan Batasan Revisi",
      ayat: [
        {
          nomor: "5.1.",
          teks: "PIHAK KEDUA berhak mengajukan revisi dalam batas toleransi kewajaran pada tahapan penyelesaian (<i>User Acceptance Test</i>), dengan syarat/ketentuan mutlak bahwa revisi tidak mengubah, membongkar, atau melampaui ruang lingkup esensi utama arsitektur dan <i>database</i> yang telah dideklarasikan di awal pada Pasal 1."
        },
        {
          nomor: "5.2.",
          teks: "Format pengajuan revisi wajib diedarkan dan disalurkan secara tertulis secara akumulatif dalam satu penyampaian dokumen/rentetan poin (<i>Batch Submit</i>) agar perbaikan berjalan logis dan efisien."
        },
        {
          nomor: "5.3.",
          teks: "Bila rancang revisi terbukti memicu perombakan kerangka aplikasi dasar (<i>Major Overhaul</i>) atau membidani fungsionalitas murni yang baru, maka pengajuannya otomatis jatuh pada ketentuan tambahan ruang lingkup (<i>Change Request</i>) pada Pasal 7."
        }
      ]
    },
    {
      title: "Pasal 6 - Keterlambatan Pembayaran",
      ayat: [
        {
          nomor: "6.1.",
          teks: "PIHAK KEDUA berkewajiban untuk menyelesaikan kewajiban finansialnya sesuai dengan termin tagihan (<i>Invoice</i>) terkait. Penangguhan waktu maksimal untuk pembayaran Termin Pelunasan/Serah Terima dibatasi hingga 30 (tiga puluh) hari kerja pasca-pemberitahuan bahwa Pengerjaan telah selesai dan diserahkan."
        },
        {
          nomor: "6.2.",
          teks: "Bila mana PIHAK KEDUA abai dan melanggar kelonggaran waktu 30 (tiga puluh) hari kerja tersebut, maka PIHAK PERTAMA memegang hak penuh tak-tersanggah (<i>Veto</i>) untuk memberlakukan penangguhan akses (<i>Suspend</i>), menurunkan/mematikan visibilitas Sistem ke publik, hingga mencabut fasilitas <i>server</i> secara sepihak sampai dengan seluruh tunggakan dilunasi seutuhnya."
        }
      ]
    },
    {
      title: "Pasal 7 - Ketentuan Perubahan Ruang Lingkup (Change Request)",
      ayat: [
        {
          nomor: "7.1.",
          teks: "Setiap ada penambahan fungsi, arsitektur dasar, penambahan struktur di dalam hierarki <i>database</i>, permintaan desain <i>UI</i> mutlak yang berbeda dari <i>wireframe</i> usulan PIHAK PERTAMA, serta fitur di luar lingkup kerja awal, maka akan diterbitkan adendum baru (<i>Change Request</i>)."
        },
        {
          nomor: "7.2.",
          teks: "PIHAK PERTAMA berhak penuh menentukan biaya/kompensasi dari setiap penambahan fungsi dengan pertimbangan waktu riset dan alur logistik sistem yang bergeser."
        }
      ]
    },
    {
      title: "Pasal 8 - Layanan dan Lisensi Pihak Ketiga",
      ayat: [
        {
          nomor: "8.1.",
          teks: "Selama siklus operasional Sistem, PIHAK PERTAMA berwenang menanamkan integrasi instrumen dari pihak ketiga (<i>Third-Party Service/API</i>), contohnya namun tidak terbatas pada layanan jaringan komputasi <i>cloud</i>, rute pengiriman pesan surel (<i>SMTP</i>), pemrosesan biaya daring (<i>Payment Gateway</i>), maupun perpustakaan lisensi lainnya."
        },
        {
          nomor: "8.2.",
          teks: "Kewajiban perpanjangan retribusi tahunan, peningkatan kuota atas limit transaksi layanan eksternal, masa habis pakai lisensi setelah tanggal Serah Terima Sistem (<i>Deployment</i>), menjadi murni tanggung jawab dan beban biaya PIHAK KEDUA, yang merupakan kewajiban terpisah dan selayaknya berdiri sendiri di luar dari paket nilai biaya rintisan."
        }
      ]
    },
    {
      title: "Pasal 9 - Backup dan Tanggung Jawab Data",
      ayat: [
        {
          nomor: "9.1.",
          teks: "PIHAK PERTAMA senantiasa mengupayakan penyediaan skema cadangan data otomatis (<i>Automated Backup</i>) pasif dari bawaan layanan <i>provider cloud</i> pada tingkatan infrastruktur utama guna mencegah kegagalan perangkat keras (<i>Hardware Failure</i>)."
        },
        {
          nomor: "9.2.",
          teks: "Namun secara mendasar, pemeliharaan keselamatan informasi mutasi log, pengamanan riwayat <i>records</i>, kewaspadaan <i>phishing</i>, perlindungan dari hapus tak sengaja (<i>Human Error Deletion</i>), dan segala aktivitas penyimpanan teknis di dalam Dasbor setelah masa peralihan serah terima secara penuh wajib dilakukan berlapis oleh <i>administrator</i> yang ditunjuk oleh PIHAK KEDUA."
        },
        {
          nomor: "9.3.",
          teks: "PIHAK PERTAMA dilepaskan secara utuh dari instrumen hukum, beban moril, serta dari segala rupa delik tuntutan terhadap rusaknya sebagian atau musnahnya kepemilikan data (<i>Data Loss</i>) yang ditimbulkan oleh keteledoran kontrol akses dari sisi PIHAK KEDUA, dan/atau karena penuhnya palka kapasitas penyimpanan peladen (<i>Storage Exhaustion</i>)."
        }
      ]
    },
    {
      title: "Pasal 10 - Serah Terima & Garansi Pemeliharaan (Maintenance)",
      ayat: [
        {
          nomor: "10.1.",
          teks: "Serah terima (<i>Handover</i>) dianggap tuntas (<i>Finalizing</i>) tatkala Sistem telah dinaikkan ke Server Produksi Publik (<i>Public Production Live-Server</i>) dan PIHAK PERTAMA telah mengirimkan Hak Akses Admin (<i>Administrator Credential Rights</i>) beserta akses kepemilikan <i>Domain</i> ke <i>email</i> PIHAK KEDUA."
        },
        {
          nomor: "10.2.",
          teks: "Setelah dilakukan serah terima penuh, PIHAK PERTAMA menjamin fungsionalitas aplikasi dan memberikan perlindungan Garansi Standar berupa <i>Bug-Fixing</i> (Tanpa biaya) dengan limitasi waktu:",
          list: [
            "Durasi: 30 (Tiga puluh) hari kalender sejak tanggal serah terima diresmikan.",
            "Cakupan Garansi: Memperbaiki <i>error</i> sistematis (<i>bug</i>), kalkulasi sistem yang tidak presisi, <i>error 404/500</i> akibat kode, dan antarmuka komponen pasca-<i>deploy</i>.",
            "Pengecualian Garansi: Garansi seketika GUGUR dan TIDAK BERLAKU apabila terjadi injeksi paksa oleh staf PIHAK KEDUA ke dalam <i>source code</i>, kesalahan <i>human-error</i> staf PIHAK KEDUA menghapus data dari Dasbor, kehilangan <i>password</i> akibat kelalaian PIHAK KEDUA, migrasi <i>domain</i> tanpa pemberitahuan kepada PIHAK PERTAMA, atau tindakan peretasan/eksploitasi jaringan oleh pihak ketiga yang berada di luar jangkauan keamanan arsitektur normal."
          ]
        },
        {
          nomor: "10.3.",
          teks: "Di luar limitasi garansi tersebut, bilamana PIHAK KEDUA menginginkan PIHAK PERTAMA memonitor sistem secara berkelanjutan maka wajib membeli dan mengaktifkan layanan \"Pemeliharaan/<i>Maintenance</i> Lanjutan Bulanan (<i>RTP</i>)\"."
        }
      ]
    },
    {
      title: "Pasal 11 - Support Komunikasi",
      ayat: [
        {
          nomor: "11.1.",
          teks: "Semua alur koordinasi fungsional, laporan umpan balik teknis (<i>Progress Report & Feedback</i>), serta penyediaan asistensi komunikasi pengoperasian antara PARA PIHAK sejatinya difokuskan melalui kanal-kanal berbasis elektronik (seperti <i>WhatsApp Group</i>, <i>Email</i>, atau <i>Ticket System</i>) yang sebelumnya telah ditetapkan."
        },
        {
          nomor: "11.2.",
          teks: "Estimasi kecepatan penanganan masalah (<i>Response Time</i>) mutlak bergantung pada klasifikasi urgensi/kerumitan kendala tersebut. PIHAK PERTAMA akan menghadirkan respons profesionalisasi <i>support</i> eksklusif pada hari dan jam kerja operasional aktif, terbatas di luar intervensi jadwal perayaan libur nasional/cuti yang diakui pemerintah Indonesia."
        }
      ]
    },
    {
      title: "Pasal 12 - Penghentian Proyek",
      ayat: [
        {
          nomor: "12.1.",
          teks: "Perjanjian ini dapat disudahi/dihentikan (<i>Terminated</i>) lebih pesat dan seketika dari yang disepakati oleh salah satu PIHAK manakala PIHAK berseteru ketahuan melakukan defisit komitmen/pelanggaran vital secara terus menerus (<i>Wanprestasi</i>) maupun tidak dapat ditengahi kembali meski telah diterbitkan masa peringatan konfirmasi teguran administratif 3x24 jam."
        },
        {
          nomor: "12.2.",
          teks: "Andaikan terjadi inisiatif pembatalan rancang bangun satu sisi (sepihak) dari sudut pandang PIHAK KEDUA, dikala proses teknis sedang maupun usai beroperasi penuh, PIHAK PERTAMA dilarang keras untuk dikaitkan dengan tagihan <i>Refund</i>. Semua nilai pelunasan muka yang ditransfer menjadi Hangus (<i>Non-Refundable</i>)."
        },
        {
          nomor: "12.3.",
          teks: "Sebagai penambah bobot, PIHAK KEDUA berisiko besar terpapar penerbitan Faktur Penalti ganti rugi silang komparatif secara nilai presentase, atas akumulasi dedikasi volume logistik material, konsumsi energi tenaga/waktu progres pengerjaan (<i>Pro-rata base</i>) oleh PIHAK PERTAMA."
        }
      ]
    },
    {
      title: "Pasal 13 - Hak Kekayaan Intelektual (HKI)",
      ayat: [
        {
           nomor: "13.1.",
           teks: "Seluruh entitas hukum turunan dari proyek (contoh: <i>Database</i> transaksi, data staf PIHAK KEDUA, Nama Merek Dagang \"Geo Mitra Gateway\") dan hak guna pakai <i>domain</i> absolut mutlak menjadi hak kepemilikan PIHAK KEDUA pasca pelunasan secara utuh 100% (Termin III)."
        },
        {
           nomor: "13.2.",
           teks: "Namun, PIHAK PERTAMA mempertahankan kekayaan intelektual mutlak dan hak ekonomi (<i>Royalty-free Developer License</i>) yang melekat atas Struktur Logika Kode (<i>Source Base Logic</i>), Sistem <i>Grid</i>, Algoritma Pemetaan (<i>Maps Calculation Base</i>), serta abstraksi teknis/kerangka (<i>Framework Pattern</i>) yang dirancang khusus oleh pengembang PIHAK PERTAMA agar bebas dari klaim penguasaan tunggal."
        },
        {
           nomor: "13.3.",
           teks: "PIHAK PERTAMA senantiasa memiliki wewenang penuh untuk menjadikan abstraksi non-identitas ini sebagai portofolio pengembangan. PIHAK KEDUA tidak diperbolehkan secara hukum untuk menggandakan, menyalin-rekayasa ulang, atau menjual kembali kode sumber program (<i>Source Code</i>) sistem kepada pihak luar lain murni sebagai perangkat lunak lepas (<i>re-selling the software-as-a-service code</i>) – kecuali sistem ini dijual-belikan bersamaan secara menyeluruh sebagai bagian akuisisi sah atas seluruh Badan Usaha milik PIHAK KEDUA."
        }
      ]
    },
    {
       title: "Pasal 14 - Kebijakan Privasi & Perlindungan Data Pribadi",
       ayat: [
         {
           nomor: "14.1.",
           teks: "Mengacu secara definitif pada Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP) dan Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE) beserta peraturannya, PARA PIHAK sepakat untuk mematuhi, menjaga kerahasiaan, keamanan, serta integritas segala bentuk data pribadi yang dipertukarkan, dimasukkan, maupun diproses di dalam Sistem."
         },
         {
           nomor: "14.2.",
           teks: "PIHAK PERTAMA bertindak murni sebagai pemroses data teknis (<i>Data Processor</i>), menjamin tingkat keamanan standar dan tidak akan membagikan, menambang (<i>data-mining</i>), menjual, atau mengeksploitasi data pribadi klien, staf, maupun mitra PIHAK KEDUA kepada pihak ketiga mana pun tanpa perintah pengadilan hukum yang sah."
         },
         {
           nomor: "14.3.",
           teks: "PIHAK KEDUA bertindak utuh sebagai pengendali data (<i>Data Controller</i>), memegang kendali penuh dan kewenangan tata kelola atas seluruh informasi yang dikumpulkan di dalam Sistem. Segala bentuk sengketa hukum atau klaim komersial yang muncul akibat penyalahgunaan data operasional (seperti kebocoran data, <i>phishing</i>) yang murni timbul karena diretasnya atau kelalaian manipulasi hak akses dari lini perangkat staf/administrator PIHAK KEDUA, berada 100% pada tanggung jawab perikatan dan yurisdiksi hukum mandiri PIHAK KEDUA."
         },
         {
           nomor: "14.4.",
           teks: "Semua data yang tersimpan di infrastruktur <i>cloud</i> diproteksi oleh lapisan keamanan <i>cloud provider</i> terapan. PIHAK PERTAMA hanya berhak memiliki akses sistem temporal dan terbatas terhadap <i>log database</i> murni dalam koridor keperluan perbaikan (<i>Bug-Fixing</i>), peningkatan keamanan siber darurat, dan perawatan <i>server</i> tanpa mencederai prinsip kebebasan komunikasi/privasi."
         }
       ]
    },
    {
       title: "Pasal 15 - Keadaan Memaksa (Force Majeure)",
       ayat: [
         {
           nomor: "15.1.",
           teks: "Yang dimaksud dengan Keadaan Memaksa (<i>Force Majeure</i>) adalah kejadian-kejadian di luar kekuasaan dan kemampuan sadar manusia yang mengakibatkan terhentinya atau tertundanya pelaksanaan kewajiban, termasuk namun tidak terbatas pada: bencana alam, wabah massal, huru-hara, perang, kebijakan/regulasi mengikat aparat negara, serta amblas/gangguan massal (<i>DDoS</i>, <i>Node Issue</i>) pada jalur <i>backbone</i> jaringan <i>internet</i> nasional/internasional dari <i>provider</i> yang menimbaskan <i>down server</i> secara masif."
         },
         {
           nomor: "15.2.",
           teks: "Dalam hal terjadinya <i>Force Majeure</i>, PIHAK yang mengalami kendala wajib menginformasikan hal tersebut secara proporsional dan transparan kepada PIHAK lainnya guna dilakukan musyawarah solusi kompensasi keterlambatan jadwal tanpa menimbulkan sengketa final."
         }
       ]
    },
    {
      title: "Pasal 16 - Penyelesaian Perselisihan",
      ayat: [
        {
          nomor: "16.1.",
          teks: "Mengingat esensi Perjanjian ini terikat atas hukum Negara Kesatuan Republik Indonesia, maka bilamana di kemudian hari timbul perselisihan atau perbedaan penafsiran sehubungan dengan Perjanjian ini, PARA PIHAK sepakat untuk menyelesaikannya secara eksklusif menggunakan jalur musyawarah kekeluargaan demi mufakat dan <i>win-win solution</i>."
        },
        {
          nomor: "16.2.",
          teks: "Apabila jalan musyawarah sebagaimana disebut pada 16.1 terbukti gagal dalam tempo masa inkubasi mediasi yang panjang, maka PARA PIHAK sepakat memilih penyelesaian secara final melalui lembaga peradilan niaga/hukum yang disepakati sesuai hierarki yurisdiksi domisili domisili PIHAK PERTAMA."
        }
      ]
    },
    {
      title: "Pasal 17 - Persetujuan Digital dan Kesepakatan Mengikat",
      ayat: [
        {
          nomor: "17.1.",
          teks: "Tegas merujuk pada Pasal 18 mengenai instrumen Transaksi Elektronik menurut Undang-Undang Informasi dan Transaksi Elektronik (UU ITE), keberadaan bukti Surat Tagihan, transfer masuk kas perbankan (<i>Bank Statement</i>), dan pengaksesan <i>E-Kontrak</i> ini bersifat mutlak sah layaknya dibubuhkan penandatanganan fisik di atas Meterai Republik Indonesia."
        },
        {
          nomor: "17.2.",
          teks: "Transaksi dan pengonfirmasian pembayaran perdana (Uang Muka/<i>DP</i>) dari pihak Pemesan (PIHAK KEDUA) ini menjadi rekam digital/jejak <i>audit</i> kuat yang mentranskripsikan persetujuan (<i>Consent/Agreement of Will</i>), pengakuan legal, kepatuhan yurisdiksi, serta penerimaan konkrit atas SEMUA rumusan teknis komersial dalam Perjanjian ini terlepas dan mutlak kedudukannya meskipun tanpa adanya tanda tangan grafis/basah konvensional."
        }
      ]
    }
  ],
  footer: "Dengan menyetujui transaksi, mengirim pembayaran Termin Pertama, dan/atau menggunakan <i>platform</i> digital hasil kerjasa sama ini, Klien (PIHAK KEDUA) menyatakan secara terbukti sadar, utuh fisiknya, telah membaca, memahami secara linguistik maupun padanan hukum komersial, serta secara <i>in-absentia</i> tunduk mematuhi seluruh Syarat dan Ketentuan digital (<i>E-Kontrak Terms of Service</i>) ini tanpa satupun rekayasa, unsur paksaan, penipuan intelektual (<i>intellectual-fraud</i>), atau klausul menjebak dari perantara pihak manapun."
};

