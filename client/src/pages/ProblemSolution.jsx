import { EyeOff, UserX, Scale, ShieldCheck, ArrowRight } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section
      id="problem"
      className="py-24 bg-gray-950 relative overflow-hidden"
    >
      {/* Ornamen Ambient Glow di Background */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-red-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight mb-4">
            Menilai Seni & Sastra Itu Subjektif.
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">
              Tapi Tidak Harus Bias.
            </span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Karya tak terukur seperti Puisi, Desain, dan Pidato sering dinilai
            berdasarkan "siapa yang membuat". Koreksi hadir untuk meruntuhkan
            bias tersebut.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Card Masalah (Merah / Peringatan) */}
          <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl border border-red-500/20 relative group hover:border-red-500/40 transition-colors">
            {/* Top Border Highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/80 to-red-500/0 rounded-t-3xl"></div>

            <h3 className="text-xl font-bold text-white mb-10 flex items-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mr-4 border border-red-500/20">
                <UserX className="w-6 h-6 text-red-400" />
              </div>
              Masalah Saat Ini
            </h3>

            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-red-500/80 font-mono font-bold text-xl">
                    01
                  </span>
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-semibold text-gray-200">
                    Bias Identitas (Halo Effect)
                  </h4>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                    Karya sering dinilai tinggi hanya karena pembuatnya adalah
                    siswa populer atau difavoritkan, mengabaikan kualitas asli
                    karya tersebut.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-red-500/80 font-mono font-bold text-xl">
                    02
                  </span>
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-semibold text-gray-200">
                    Beban Tunggal Pengajar
                  </h4>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                    Meraba-raba standar nilai subjektif untuk puluhan siswa
                    sendirian sangat menguras energi guru dan rentan terhadap
                    selera personal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Solusi (Emerald / Aman) */}
          <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/30 relative shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)] group hover:border-emerald-500/50 transition-all">
            {/* Top Border Highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 rounded-t-3xl"></div>

            <h3 className="text-xl font-bold text-white mb-10 flex items-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-4 border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              Solusi "Koreksi"
            </h3>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <EyeOff className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="ml-5">
                  <h4 className="text-lg font-semibold text-gray-200">
                    100% Blind Peer-Review
                  </h4>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                    Nama pembuat disensor total. Siswa saling menilai karya
                    murni berdasarkan kualitas, tanpa tahu dokumen/karya
                    tersebut milik siapa.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Scale className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div className="ml-5">
                  <h4 className="text-lg font-semibold text-gray-200">
                    Crowdsourced Consensus
                  </h4>
                  <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                    Nilai akhir (0-100) dikalkulasi dari rata-rata penilaian
                    puluhan siswa di kelas. Menciptakan standar penilaian yang
                    lebih demokratis.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-800">
              <p className="text-sm font-bold text-emerald-500 flex items-center group-hover:text-emerald-400 transition-colors">
                Penilaian Objektif untuk Karya Subjektif
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
