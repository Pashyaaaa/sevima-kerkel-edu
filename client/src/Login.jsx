import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onSwitchToRegister }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 font-dmsans">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-secondary tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-secondary/60 text-sm mt-2">
            Masuk untuk melanjutkan penilaian
          </p>
        </div>

        {/* Card */}
        <div className="bg-secondary rounded-2xl p-6 md:p-8 border border-primary/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@sekolah.id"
                  autoComplete="email"
                  className="w-full bg-transparent border border-primary/20 text-primary placeholder-primary/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-primary">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary/60 hover:text-primary transition-colors"
                >
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-transparent border border-primary/20 text-primary placeholder-primary/40 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 hover:text-primary transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="text-sm text-primary/70">
                Ingat saya selama 30 hari
              </span>
            </label>

            {error && (
              <div className="text-xs text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 text-secondary font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  Masuk <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-primary/10 text-center text-sm text-primary/60">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary font-semibold hover:underline"
            >
              Daftar sekarang
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-secondary/40 mt-6">
          © 2025 Koreksian. Semua hak cipta dilindungi.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
