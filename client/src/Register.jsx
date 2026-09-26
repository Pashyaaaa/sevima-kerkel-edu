import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";

const RegisterPage = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const passwordChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    if (
      !passwordChecks.length ||
      !passwordChecks.upper ||
      !passwordChecks.number
    ) {
      setError("Password belum memenuhi syarat keamanan.");
      return;
    }
    if (!agree) {
      setError("Kamu harus menyetujui Syarat & Ketentuan.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Registrasi berhasil untuk ${form.email}`);
    }, 1400);
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
            Buat Akun Baru
          </h1>
          <p className="text-secondary/60 text-sm mt-2">
            Bergabung dan mulai menjadi kurator
          </p>
        </div>

        {/* Card */}
        <div className="bg-secondary rounded-2xl p-6 md:p-8 border border-primary/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap kamu"
                  className="w-full bg-transparent border border-primary/20 text-primary placeholder-primary/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
            </div>

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
              <label className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
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

              {/* Password strength */}
              {form.password && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <CheckItem ok={passwordChecks.length} label="8+ karakter" />
                  <CheckItem ok={passwordChecks.upper} label="Huruf besar" />
                  <CheckItem ok={passwordChecks.number} label="Angka" />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <input
                  type={showPass ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  autoComplete="new-password"
                  className="w-full bg-transparent border border-primary/20 text-primary placeholder-primary/40 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-600 mt-2">
                  Password tidak cocok.
                </p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-primary rounded"
              />
              <span className="text-xs text-primary/70 leading-relaxed">
                Saya menyetujui{" "}
                <span className="text-primary font-semibold hover:underline cursor-pointer">
                  Syarat & Ketentuan
                </span>{" "}
                serta{" "}
                <span className="text-primary font-semibold hover:underline cursor-pointer">
                  Kebijakan Privasi
                </span>
                .
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Membuat akun...
                </>
              ) : (
                <>
                  Daftar <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-primary/10 text-center text-sm text-primary/60">
            Sudah punya akun?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary font-semibold hover:underline"
            >
              Masuk di sini
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

export default RegisterPage;

/* ---- Small helper ---- */
const CheckItem = ({ ok, label }) => (
  <div
    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border transition-colors ${
      ok
        ? "border-primary/30 text-primary"
        : "border-primary/10 text-primary/40"
    }`}
  >
    <Check
      className={`w-3 h-3 ${ok ? "opacity-100" : "opacity-30"}`}
      strokeWidth={3}
    />
    <span className="truncate">{label}</span>
  </div>
);
