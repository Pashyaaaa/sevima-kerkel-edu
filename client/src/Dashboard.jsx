import { useState } from "react";
import {
  Star,
  Users,
  Clock,
  Plus,
  ArrowRight,
  Upload,
  EyeOff,
} from "lucide-react";

const Dashboard = () => {
  const [classCode, setClassCode] = useState("");

  const handleJoinClass = (e) => {
    e.preventDefault();
    // Logic untuk memvalidasi kode kelas ke backend
    alert(`Mencoba bergabung dengan kode: ${classCode}`);
    setClassCode("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Profil Singkat */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Selamat datang, <span className="text-emerald-400">Siswa Demo</span>{" "}
            👋
          </h2>
          <p className="text-gray-400 mt-1">
            Siap untuk memberikan penilaian yang objektif hari ini?
          </p>
        </div>

        {/* Widget Join Kelas Cepat */}
        <form
          onSubmit={handleJoinClass}
          className="flex items-center relative group"
        >
          <input
            type="text"
            placeholder="Kode Kelas (6 Digit)"
            maxLength={6}
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-l-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-48 transition-all font-mono uppercase tracking-widest"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold px-4 py-2.5 rounded-r-xl transition-colors flex items-center border border-emerald-500 hover:border-emerald-400"
          >
            <Plus className="w-5 h-5 mr-1" /> Gabung
          </button>
        </form>
      </div>

      {/* Grid Statistik Gamifikasi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex items-center shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mr-4">
            <Star className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">
              Reputasi Kurator
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              85<span className="text-sm text-gray-500 font-normal">/100</span>
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex items-center shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mr-4">
            <Users className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Kelas Aktif</p>
            <p className="text-2xl font-bold text-white mt-1">
              3 <span className="text-sm text-gray-500 font-normal">Ruang</span>
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 flex items-center shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mr-4">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Menunggu Aksi</p>
            <p className="text-2xl font-bold text-white mt-1">
              4 <span className="text-sm text-gray-500 font-normal">Tugas</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Kolom Kiri: Tugas yang Harus Dikumpulkan (To Submit) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Upload className="w-5 h-5 mr-2 text-cyan-400" /> Target Kumpul
            </h3>
            <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2.5 py-1 rounded-full border border-cyan-500/20">
              2 Aktif
            </span>
          </div>

          {/* Card Tugas 1 */}
          <div className="bg-gray-900/40 border border-gray-800 hover:border-cyan-500/40 rounded-2xl p-5 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  Seni Budaya - XI IPA 2
                </p>
                <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                  Analisis Lukisan Abstrak
                </h4>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5 line-clamp-2">
              Kumpulkan karya lukisan digital abstrak beserta esai interpretasi
              singkat berformat PDF.
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center text-red-400 text-sm font-medium">
                <Clock className="w-4 h-4 mr-1" /> Sisa 2 Jam
              </div>
              <button className="bg-white/5 hover:bg-cyan-500 hover:text-gray-950 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-white/10 hover:border-cyan-500">
                Kumpulkan
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tugas yang Harus Dinilai (To Review - Blind) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center">
              <EyeOff className="w-5 h-5 mr-2 text-emerald-400" /> Target
              Koreksi
            </h3>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
              2 Menunggu
            </span>
          </div>

          {/* Card Review 1 */}
          <div className="bg-gray-900/40 border border-gray-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Sastra Indonesia
                  </p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-800 text-gray-400 border border-gray-700">
                    Anonim
                  </span>
                </div>
                <h4 className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">
                  Tugas Puisi Kontemporer (Karya #A89B)
                </h4>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5 line-clamp-2">
              Berikan penilaian konsensus untuk rima, diksi, dan pesan moral
              dari karya anonim ini.
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center text-gray-400 text-sm font-medium">
                <Clock className="w-4 h-4 mr-1" /> Deadline besok
              </div>
              <button className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-gray-950 text-sm font-bold px-4 py-2 rounded-lg transition-colors border border-emerald-500/30 hover:border-emerald-500 flex items-center">
                Nilai Sekarang <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
