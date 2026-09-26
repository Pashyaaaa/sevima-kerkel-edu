import { useState } from "react";
import {
  Star,
  Users,
  Clock,
  Plus,
  ArrowRight,
  Upload,
  EyeOff,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const Demo = () => {
  const [classCode, setClassCode] = useState("");

  const handleJoinClass = (e) => {
    e.preventDefault();
    if (classCode.length !== 6) {
      alert("Kode kelas harus 6 digit!");
      return;
    }
    alert(`Mencoba bergabung dengan kode: ${classCode}`);
    setClassCode("");
  };

  const stats = [
    {
      label: "Reputasi Kurator",
      value: "85",
      suffix: "/100",
      icon: Star,
      color: "amber",
      progress: 85,
    },
    {
      label: "Kelas Aktif",
      value: "3",
      suffix: "Ruang",
      icon: Users,
      color: "cyan",
      progress: 60,
    },
    {
      label: "Menunggu Aksi",
      value: "4",
      suffix: "Tugas",
      icon: Clock,
      color: "purple",
      progress: 40,
    },
  ];

  const colorMap = {
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      bar: "bg-amber-400",
      glow: "shadow-amber-500/20",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      bar: "bg-cyan-400",
      glow: "shadow-cyan-500/20",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      bar: "bg-purple-400",
      glow: "shadow-purple-500/20",
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0e14] relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10 space-y-8">
        {/* ============ HERO WELCOME ============ */}
        <div className="relative rounded-3xl overflow-hidden border border-gray-800 bg-primary">
          <div className="absolute inset-0 bg-primary from-emerald-500/10 via-transparent to-cyan-500/10" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Semester Ganjil 2024/2025
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Selamat datang,{" "}
                <span className="bg-secondary bg-clip-text text-transparent">
                  Siswa Demo
                </span>{" "}
                👋
              </h2>
              <p className="text-gray-400 mt-2 text-sm md:text-base max-w-lg">
                Siap memberikan penilaian yang objektif dan membangun hari ini?
              </p>
            </div>

            {/* Join Class Widget */}
            <form
              onSubmit={handleJoinClass}
              className="w-full md:w-auto flex-shrink-0"
            >
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
                Gabung Kelas Baru
              </label>
              <div className="flex items-center bg-gray-950/80 border border-gray-800 rounded-xl p-1 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <input
                  type="text"
                  placeholder="KODE6"
                  maxLength={6}
                  value={classCode}
                  onChange={(e) =>
                    setClassCode(
                      e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
                    )
                  }
                  className="bg-transparent text-white placeholder-gray-600 px-4 py-2.5 focus:outline-none w-32 md:w-40 font-mono tracking-[0.3em] text-center text-sm"
                />
                <button
                  type="submit"
                  disabled={classCode.length !== 6}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-gray-950 font-bold px-4 py-2.5 rounded-lg transition-all flex items-center text-sm shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4 mr-1" /> Gabung
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ============ STATS GRID ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {stats.map((s) => {
            const c = colorMap[s.color];
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={`group relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-gray-700 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.glow}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center border ${c.border}`}
                  >
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                </div>

                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  {s.label}
                </p>
                <p className="text-3xl font-bold text-white">
                  {s.value}
                  <span className="text-sm text-gray-500 font-normal ml-1">
                    {s.suffix}
                  </span>
                </p>

                {/* Progress bar */}
                <div className="mt-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${c.bar} rounded-full transition-all duration-1000`}
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ============ TASK COLUMNS ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* ---- To Submit ---- */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-cyan-400" />
                </div>
                Target Kumpul
              </h3>
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/20">
                2 Aktif
              </span>
            </div>

            <TaskCard
              category="Seni Budaya - XI IPA 2"
              title="Analisis Lukisan Abstrak"
              desc="Kumpulkan karya lukisan digital abstrak beserta esai interpretasi singkat berformat PDF."
              deadline="Sisa 2 Jam"
              urgent
              actionLabel="Kumpulkan"
              accent="cyan"
            />
            <TaskCard
              category="Matematika - XI IPA 2"
              title="Studi Kasus Limit Fungsi"
              desc="Kerjakan 5 soal studi kasus limit fungsi dan unggah dalam bentuk PDF."
              deadline="Sisa 1 Hari"
              actionLabel="Kumpulkan"
              accent="cyan"
            />
          </section>

          {/* ---- To Review ---- */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <EyeOff className="w-4 h-4 text-emerald-400" />
                </div>
                Target Koreksi
              </h3>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                2 Menunggu
              </span>
            </div>

            <TaskCard
              category="Sastra Indonesia"
              title="Tugas Puisi Kontemporer (Karya #A89B)"
              desc="Berikan penilaian konsensus untuk rima, diksi, dan pesan moral dari karya anonim ini."
              deadline="Deadline besok"
              anonymous
              actionLabel="Nilai Sekarang"
              accent="emerald"
              withArrow
            />
            <TaskCard
              category="Bahasa Inggris"
              title="Essay Review (Karya #C12D)"
              desc="Nilai struktur grammar dan kohesi antar paragraf pada esai anonim ini."
              deadline="Deadline 2 hari"
              anonymous
              actionLabel="Nilai Sekarang"
              accent="emerald"
              withArrow
            />
          </section>
        </div>
      </div>
    </div>
  );
};

/* ============ Reusable TaskCard ============ */
const TaskCard = ({
  category,
  title,
  desc,
  deadline,
  urgent,
  anonymous,
  actionLabel,
  accent = "cyan",
  withArrow,
}) => {
  const accents = {
    cyan: {
      hoverBorder: "hover:border-cyan-500/40",
      hoverText: "group-hover:text-cyan-400",
      btn: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500 hover:text-gray-950 hover:border-cyan-500",
      glow: "hover:shadow-cyan-500/10",
    },
    emerald: {
      hoverBorder: "hover:border-emerald-500/40",
      hoverText: "group-hover:text-emerald-400",
      btn: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-gray-950 hover:border-emerald-500",
      glow: "hover:shadow-emerald-500/10",
    },
  };
  const a = accents[accent];

  return (
    <div
      className={`group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 ${a.hoverBorder} rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${a.glow}`}
    >
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
            {category}
          </p>
          {anonymous && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-400 border border-gray-700">
              Anonim
            </span>
          )}
        </div>
        <h4
          className={`text-white font-bold text-base md:text-lg ${a.hoverText} transition-colors leading-snug`}
        >
          {title}
        </h4>
      </div>

      <p className="text-sm text-gray-400 mb-5 line-clamp-2 leading-relaxed">
        {desc}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
        <div
          className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
            urgent
              ? "bg-red-500/10 text-red-400 border border-red-500/20"
              : "bg-gray-800/60 text-gray-400 border border-gray-700/60"
          }`}
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {deadline}
        </div>
        <button
          className={`text-sm font-bold px-4 py-2 rounded-lg transition-all border flex items-center ${a.btn}`}
        >
          {actionLabel}
          {withArrow && <ArrowRight className="w-4 h-4 ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default Demo;
