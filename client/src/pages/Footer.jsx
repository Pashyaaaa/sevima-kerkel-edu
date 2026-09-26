import { Mail, Heart } from "lucide-react";
import Logo from "@/assets/logo-koreksi-hori.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Deskripsi */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src={Logo}
                loading="lazy"
                alt="Logo kerkel"
                className="w-36 rounded-sm"
                srcset=""
              />
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
              Platform peer-learning kolaboratif untuk mentransformasi cara
              siswa memberikan feedback dan belajar dari satu sama lain.
            </p>
            {/* SDG 4 Badge untuk Hackathon */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-blue-500/30 text-xs font-medium text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Built for SDG 4: Quality Education
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider uppercase text-sm">
              Navigasi
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#landing-page"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#problem"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Solusi
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Fitur Utama
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wider uppercase text-sm">
              Hubungi Kami
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Punya pertanyaan atau ingin mencoba demo penuh?
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} Kerkel System. All rights reserved.</p>
          <p className="flex items-center mt-4 md:mt-0">
            Made with{" "}
            <Heart className="w-4 h-4 text-red-500 mx-1" fill="currentColor" />{" "}
            by Octavian Pashya
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
