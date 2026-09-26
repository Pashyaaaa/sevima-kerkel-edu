import { KeyRound, FileArchive, EyeOff, BarChart4 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <KeyRound className="w-7 h-7 text-cyan-400" />,
      title: "Private Class Code",
      description:
        "Guru cukup membagikan 6-digit kode unik. Siswa bergabung ke kelas tertutup dengan aman, menjaga privasi karya dan penilaian agar tidak bocor ke publik.",
      glow: "group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)]",
      borderColor: "group-hover:border-cyan-500/50",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: <FileArchive className="w-7 h-7 text-purple-400" />,
      title: "Sanitized Multi-Format",
      description:
        "Mendukung upload Gambar, Audio, PDF, atau Link (Figma/Vercel). Sistem otomatis membersihkan metadata file (sanitize) agar nama pembuat asli tidak bisa dilacak.",
      glow: "group-hover:shadow-[0_0_30px_-5px_rgba(192,132,252,0.2)]",
      borderColor: "group-hover:border-purple-500/50",
      iconBg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: <EyeOff className="w-7 h-7 text-emerald-400" />,
      title: "100% Blind Peer-Review",
      description:
        "Identitas pembuat disembunyikan dari penilai, dan identitas penilai disembunyikan dari pembuat. Fokus 100% pada kualitas karya, bebas dari bias pertemanan.",
      glow: "group-hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.2)]",
      borderColor: "group-hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: <BarChart4 className="w-7 h-7 text-amber-400" />,
      title: "Consensus Score (0-100)",
      description:
        "Menggunakan sistem skor 0-100 yang presisi. Nilai akhir merupakan hasil agregasi/rata-rata dari seluruh siswa, menciptakan standar kurasi ala juri profesional.",
      glow: "group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.2)]",
      borderColor: "group-hover:border-amber-500/50",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-gray-950 relative overflow-hidden"
    >
      {/* Background Ornamen */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight mb-4">
            Dirancang Untuk Objektivitas
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Sistem di balik "Koreksi" memastikan setiap tugas seni dan sastra
            mendapatkan penilaian yang paling adil dari komunitas kelas.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feat, index) => (
            <div
              key={index}
              className={`group bg-gray-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 transition-all duration-300 ${feat.glow} ${feat.borderColor}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                {/* Icon Wrapper */}
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border ${feat.iconBg} transform group-hover:-translate-y-1 group-hover:scale-105 transition-all duration-300`}
                >
                  {feat.icon}
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-white transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                    {feat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
