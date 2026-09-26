import ProfileCard from "@/components/ProfileCard";
import { Target, Users, Globe } from "lucide-react";
import ProfileImg from "@/assets/solo_himatif_png.png";

const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-gray-950 text-white relative overflow-hidden"
    >
      {/* Background Ornamen */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-cyan-600/10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= SECTION 1: ABOUT PROJECT KOREKSI ================= */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Tentang Koreksi
            </h2>
            <div className="w-20 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="bg-gray-900/60 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[80px] pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50"></div>

            <p className="text-lg text-gray-300 leading-relaxed text-center mb-12 relative z-10">
              Aplikasi "Koreksi" dibangun dari sebuah keyakinan bahwa{" "}
              <strong className="text-white font-semibold">
                Pendidikan Berkualitas (SDG 4)
              </strong>{" "}
              menuntut keadilan mutlak, bahkan pada karya yang sifatnya
              subjektif seperti seni dan sastra. Kami mendemokratisasi evaluasi
              belajar melalui sistem *blind peer-review* agar setiap karya
              dihargai murni karena esensinya, bukan karena siapa pembuatnya.
            </p>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {/* Point 1 */}
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold mb-3">
                  Objektivitas Penuh
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Menghilangkan bias personal dan *Halo Effect* dalam proses
                  mengkurasi karya-karya tak terukur.
                </p>
              </div>

              {/* Point 2 */}
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-cyan-500/20 shadow-[0_0_15px_-3px_rgba(34,211,238,0.2)]">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold mb-3">
                  Penilaian Kolektif
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Menggantikan beban satu penilai dengan nilai konsensus
                  (rata-rata) dari seluruh siswa di kelas.
                </p>
              </div>

              {/* Point 3 */}
              <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-purple-500/20 shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]">
                  <Globe className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold mb-3">
                  Ruang Aman Berkarya
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Mendorong keberanian siswa bereksperimen tanpa rasa takut
                  dihakimi identitasnya oleh teman.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: ABOUT DEVELOPER ================= */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tentang Pengembang
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
            {/* Kiri: Komponen ProfileCard */}
            <div className="w-full md:w-auto flex justify-center">
              <ProfileCard
                name="Octavian Pashya Ramadhan"
                title="Software Engineer"
                handle="octavianpashya"
                status="Online"
                contactText="Hubungi Saya"
                avatarUrl={ProfileImg} // Ganti dengan path fotomu nanti
                showUserInfo={false}
                enableTilt={true}
                enableMobileTilt={false}
                onContactClick={() =>
                  window.open("mailto:octavianpashya20@gmail.com")
                } // Ganti emailmu
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                iconUrl="" // Isi jika ada background pattern
                behindGlowEnabled={true}
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
              />
            </div>

            {/* Kanan: Teks Biografi */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-300 mb-2">
                Di Balik Layar Kerkel
              </h3>
              <p className="text-secondary font-medium mb-6">
                Mahasiswa Teknik Informatika, Universitas Trunojoyo Madura '25
              </p>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Halo! Saya Octavian, pengembang utama di balik Kerkel System.
                  Saya memiliki fokus kuat di bidang{" "}
                  <em>Software Engineering</em> dan teknologi{" "}
                  <em>Full-Stack Web Development</em>.
                </p>
                <p>
                  Aplikasi ini saya rancang khusus untuk hackathon ini karena
                  saya percaya teknologi harus bisa menyelesaikan masalah nyata.
                  Dengan memadukan UI/UX yang modern dan sistem logika database
                  yang kuat, Kerkel diharapkan bisa menjadi standar baru
                  bagaimana siswa berkolaborasi di era digital.
                </p>
                <p>
                  Ke depannya, saya memiliki visi untuk terus menciptakan
                  perangkat lunak yang *scalable* dengan mimpi berkarir sebagai
                  Software Engineer di industri teknologi global, khususnya di
                  Jepang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
