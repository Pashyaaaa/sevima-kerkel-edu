import { useState, useMemo } from "react";
import {
  Sparkles,
  Bell,
  Settings,
  Plus,
  ArrowRight,
  Star,
  Users,
  Clock,
  Upload,
  EyeOff,
  ChevronRight,
  Hash,
  BookOpen,
  Copy,
  Check,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { MASTER_CLASSES, MASTER_TASKS, INITIAL_STATE } from "./data/seedData";
import ReviewModal from "./components/ReviewModal";

const STORAGE_KEY = "koreksi.state.v1";

/* ============================================================
   DASHBOARD
============================================================ */
const Dashboard = ({
  user = {
    name: "Siswa Demo",
    role: "Siswa",
    kelas: "XI IPA 2",
    inisial: "SD",
  },
}) => {
  const [state, setState, resetState] = useLocalStorage(
    STORAGE_KEY,
    INITIAL_STATE,
  );
  const [classCode, setClassCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeReview, setActiveReview] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  /* ---------- Derivasi data ---------- */
  const myClasses = useMemo(
    () =>
      state.joinedClasses.map((code) => MASTER_CLASSES[code]).filter(Boolean),
    [state.joinedClasses],
  );

  const toSubmit = useMemo(
    () =>
      MASTER_TASKS.filter(
        (t) =>
          t.type === "submit" &&
          state.joinedClasses.includes(t.classCode) &&
          !state.submittedTasks.includes(t.id),
      ),
    [state.joinedClasses, state.submittedTasks],
  );

  const toReview = useMemo(
    () =>
      MASTER_TASKS.filter(
        (t) =>
          t.type === "review" &&
          state.joinedClasses.includes(t.classCode) &&
          !state.reviewedTasks.includes(t.id),
      ),
    [state.joinedClasses, state.reviewedTasks],
  );

  const stats = [
    {
      label: "Kelas Aktif",
      value: myClasses.length,
      suffix: "kelas",
      icon: Users,
    },
    {
      label: "Perlu Dikumpul",
      value: toSubmit.length,
      suffix: "tugas",
      icon: Upload,
    },
    {
      label: "Perlu Dinilai",
      value: toReview.length,
      suffix: "karya",
      icon: EyeOff,
    },
    {
      label: "Reputasi",
      value: state.reputation,
      suffix: "/100",
      icon: Star,
    },
  ];

  /* ---------- Aksi ---------- */
  const handleJoinClass = (e) => {
    e.preventDefault();
    if (classCode.length !== 6) return;

    if (!MASTER_CLASSES[classCode]) {
      showToast(`Kode "${classCode}" tidak ditemukan.`, "error");
      return;
    }
    if (state.joinedClasses.includes(classCode)) {
      showToast("Kamu sudah tergabung di kelas ini.", "error");
      return;
    }

    setJoining(true);
    setTimeout(() => {
      setState((s) => ({
        ...s,
        joinedClasses: [...s.joinedClasses, classCode],
      }));
      setClassCode("");
      setJoining(false);
      showToast(`Berhasil bergabung ke ${MASTER_CLASSES[classCode].name}!`);
    }, 700);
  };

  const handleSubmitTask = (taskId) => {
    setState((s) =>
      s.submittedTasks.includes(taskId)
        ? s
        : { ...s, submittedTasks: [...s.submittedTasks, taskId] },
    );
    showToast("Karya berhasil dikumpulkan!");
  };

  const handleReviewTask = (taskId) => {
    const task = MASTER_TASKS.find((t) => t.id === taskId);
    if (task) setActiveReview(task);
  };

  const handleSubmitReview = ({ taskId, score, note }) => {
    setState((s) => ({
      ...s,
      reviewedTasks: s.reviewedTasks.includes(taskId)
        ? s.reviewedTasks
        : [...s.reviewedTasks, taskId],
      reviews: {
        ...s.reviews,
        [taskId]: { score, note, reviewedAt: Date.now() },
      },
    }));
    setActiveReview(null);
    showToast(`Penilaian ${score}/100 tersimpan. Terima kasih!`);
  };

  const handleLeaveClass = (code) => {
    setState((s) => ({
      ...s,
      joinedClasses: s.joinedClasses.filter((c) => c !== code),
    }));
    showToast(`Keluar dari kelas ${code}.`, "error");
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    showToast(`Kode ${code} tersalin!`);
  };

  const handleReset = () => {
    if (!confirm("Reset semua data lokal? Aksi ini tidak bisa dibatalkan."))
      return;
    resetState();
    showToast("Data lokal direset.");
  };

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen bg-primary font-dmsans text-secondary">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg border transition-all ${
            toast.type === "error"
              ? "bg-primary text-secondary border-red-500/40"
              : "bg-secondary text-primary border-transparent"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ============== NAVBAR ============== */}
      <nav className="sticky top-0 z-40 bg-primary/90 backdrop-blur-md border-b border-secondary/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="leading-tight">
              <p className="font-bold tracking-tight">Koreksian</p>
              <p className="text-[10px] text-secondary/40 -mt-0.5">
                Peer Review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              title="Reset data lokal"
              className="w-9 h-9 rounded-xl hover:bg-secondary/10 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-secondary/10 flex items-center justify-center transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl hover:bg-secondary/10 flex items-center justify-center transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 ml-2 border-l border-secondary/10">
              <div className="w-8 h-8 rounded-full bg-secondary text-primary font-bold text-xs flex items-center justify-center">
                {user.inisial}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold">{user.name}</p>
                <p className="text-[10px] text-secondary/50">
                  {user.role} · {user.kelas}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-10">
        {/* ============== WELCOME + JOIN ============== */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/15 text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Semester Ganjil 2024/2025
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Halo, {user.name.split(" ")[0]} 👋
            </h1>
            <p className="text-secondary/60 mt-3 max-w-lg text-sm md:text-base leading-relaxed">
              Saatnya menilai karya temanmu dengan objektif. Setiap penilaian
              bersifat{" "}
              <span className="text-secondary font-semibold">anonim</span> —
              fokus pada kualitas karyanya, bukan siapa pembuatnya.
            </p>
          </div>

          {/* Join Class Card */}
          <div className="lg:col-span-2 bg-secondary text-primary rounded-2xl p-5 md:p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Hash className="w-3.5 h-3.5 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Gabung Kelas Baru</h3>
            </div>
            <p className="text-xs text-primary/60 mb-4">
              Coba: <span className="font-mono">ART7X9</span> ·{" "}
              <span className="font-mono">LIT4K2</span> ·{" "}
              <span className="font-mono">ENG8Q1</span>
            </p>
            <form onSubmit={handleJoinClass} className="space-y-3">
              <input
                type="text"
                maxLength={6}
                value={classCode}
                onChange={(e) =>
                  setClassCode(
                    e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
                  )
                }
                placeholder="A1B2C3"
                className="w-full bg-primary/5 border border-primary/15 text-primary placeholder-primary/30 rounded-xl px-4 py-3 text-center font-mono tracking-[0.4em] text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="submit"
                disabled={classCode.length !== 6 || joining}
                className="w-full bg-primary text-secondary font-semibold py-3 rounded-xl hover:bg-primary/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
              >
                {joining ? (
                  "Menghubungkan..."
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Gabung Kelas
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* ============== STATS ============== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </section>

        {/* ============== TASKS ============== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* --- Perlu Dikumpulkan --- */}
          <div className="space-y-4">
            <SectionHeader
              icon={Upload}
              title="Perlu Dikumpulkan"
              badge={`${toSubmit.length} Aktif`}
            />
            {toSubmit.length === 0 ? (
              <EmptyState
                text={
                  myClasses.length === 0
                    ? "Gabung kelas dulu untuk melihat tugas."
                    : "Semua tugas sudah dikumpulkan 🎉"
                }
              />
            ) : (
              toSubmit.map((t) => (
                <SubmitCard
                  key={t.id}
                  {...t}
                  onSubmit={() => handleSubmitTask(t.id)}
                />
              ))
            )}
          </div>

          {/* --- Perlu Dinilai --- */}
          <div className="space-y-4">
            <SectionHeader
              icon={EyeOff}
              title="Perlu Dinilai"
              badge={`${toReview.length} Menunggu`}
            />
            {toReview.length === 0 ? (
              <EmptyState
                text={
                  myClasses.length === 0
                    ? "Gabung kelas dulu untuk melihat karya."
                    : "Tidak ada karya yang menunggu penilaian 🎉"
                }
              />
            ) : (
              toReview.map((t) => (
                <ReviewCard
                  key={t.id}
                  {...t}
                  onReview={() => handleReviewTask(t.id)}
                />
              ))
            )}

            {/* Info anonimitas */}
            <div className="flex items-start gap-3 bg-secondary/5 border border-secondary/10 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <EyeOff className="w-4 h-4 text-secondary/70" />
              </div>
              <div>
                <p className="text-xs font-semibold">Blind Review</p>
                <p className="text-[11px] text-secondary/60 mt-0.5 leading-relaxed">
                  Identitas pembuat karya disembunyikan. Nilai berdasarkan
                  kualitas saja — sistem akan menghitung konsensus dari semua
                  penilai.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============== MY CLASSES ============== */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Kelas Saya
              <span className="text-xs font-normal text-secondary/40">
                ({myClasses.length})
              </span>
            </h2>
            <button className="text-xs font-semibold text-secondary/60 hover:text-secondary transition-colors flex items-center gap-1">
              Lihat semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myClasses.length === 0 ? (
            <EmptyState text="Belum ada kelas. Gabung pakai kode dari gurumu di atas." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myClasses.map((c) => (
                <ClassCard
                  key={c.code}
                  {...c}
                  pending={
                    toReview.filter((t) => t.classCode === c.code).length
                  }
                  onCopy={() => handleCopyCode(c.code)}
                  onLeave={() => handleLeaveClass(c.code)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ============== FOOTER ============== */}
      <footer className="mt-16 border-t border-secondary/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 text-xs text-secondary/40 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© 2025 Koreksi · Penilaian objektif untuk karya subjektif</p>
          <div className="flex gap-4">
            <button className="hover:text-secondary transition-colors">
              Bantuan
            </button>
            <button className="hover:text-secondary transition-colors">
              Privasi
            </button>
          </div>
        </div>
      </footer>

      {/* ============== REVIEW MODAL ============== */}
      {activeReview && (
        <ReviewModal
          task={activeReview}
          onClose={() => setActiveReview(null)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

/* ============================================================
   StatCard
============================================================ */
const StatCard = ({ label, value, suffix, icon: Icon }) => (
  <div className="bg-secondary/5 border border-secondary/10 hover:border-secondary/20 rounded-2xl p-4 md:p-5 transition-colors group">
    <div className="flex items-center justify-between mb-3">
      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/15 transition-colors">
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <p className="text-[11px] font-semibold text-secondary/50 uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-2xl font-bold text-secondary leading-none">
      {value}
      <span className="text-xs text-secondary/40 font-normal ml-1.5">
        {suffix}
      </span>
    </p>
  </div>
);

/* ============================================================
   SectionHeader
============================================================ */
const SectionHeader = ({ icon: Icon, title, badge }) => (
  <div className="flex items-center justify-between">
    <h3 className="text-base font-bold flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/15 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      {title}
    </h3>
    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/10 border border-secondary/15">
      {badge}
    </span>
  </div>
);

/* ============================================================
   EmptyState
============================================================ */
const EmptyState = ({ text }) => (
  <div className="border border-dashed border-secondary/15 rounded-2xl p-8 text-center">
    <p className="text-xs text-secondary/50">{text}</p>
  </div>
);

/* ============================================================
   SubmitCard
============================================================ */
const SubmitCard = ({ kelas, title, desc, deadline, urgent, onSubmit }) => (
  <div className="bg-secondary text-primary rounded-2xl p-5 transition-transform">
    <p className="text-[10px] font-bold text-primary/50 uppercase tracking-wider mb-1.5">
      {kelas}
    </p>
    <h4 className="font-bold text-base md:text-lg leading-snug mb-2">
      {title}
    </h4>
    <p className="text-xs text-primary/60 mb-5 line-clamp-2 leading-relaxed">
      {desc}
    </p>

    <div className="flex items-center justify-between pt-4 border-t border-primary/10">
      <div
        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
          urgent ? "bg-primary text-secondary" : "bg-primary/10 text-primary/70"
        }`}
      >
        <Clock className="w-3 h-3" /> {deadline}
      </div>
      <button
        onClick={onSubmit}
        className="bg-primary text-secondary text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1.5"
      >
        <Upload className="w-3.5 h-3.5" /> Kumpulkan
      </button>
    </div>
  </div>
);

/* ============================================================
   ReviewCard
============================================================ */
const ReviewCard = ({ kelas, title, code, desc, deadline, onReview }) => (
  <div className="bg-secondary text-primary rounded-2xl p-5 transition-transform">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-primary/50 uppercase tracking-wider mb-1">
          {kelas}
        </p>
        <h4 className="font-bold text-base md:text-lg leading-snug">{title}</h4>
      </div>
      <span className="flex-shrink-0 text-[10px] font-bold bg-primary text-secondary px-2.5 py-1 rounded-md font-mono tracking-wider">
        {code}
      </span>
    </div>

    <p className="text-xs text-primary/60 mb-4 line-clamp-2 leading-relaxed">
      {desc}
    </p>

    <div className="flex items-center justify-between pt-4 border-t border-primary/10">
      <div className="flex items-center gap-1.5 text-xs text-primary/60">
        <Clock className="w-3 h-3" /> {deadline}
      </div>
      <button
        onClick={onReview}
        className="bg-primary text-secondary text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center gap-1.5"
      >
        Nilai Sekarang <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

/* ============================================================
   ClassCard
============================================================ */
const ClassCard = ({
  name,
  teacher,
  code,
  members,
  pending,
  onCopy,
  onLeave,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    onCopy?.();
  };

  return (
    <div className="bg-secondary/5 border border-secondary/10 hover:border-secondary/25 rounded-2xl p-5 transition-all group relative">
      <button
        onClick={onLeave}
        title="Keluar dari kelas"
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-secondary/10 hover:bg-red-500/20 flex items-center justify-center"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/15 flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
        <button
          onClick={handleCopy}
          className="text-[10px] font-bold font-mono tracking-wider px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/15 hover:bg-secondary/20 transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" /> TERSALIN
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> {code}
            </>
          )}
        </button>
      </div>

      <h4 className="font-bold text-base mb-1">{name}</h4>
      <p className="text-xs text-secondary/50 mb-4">{teacher}</p>

      <div className="flex items-center justify-between pt-3 border-t border-secondary/10 text-[11px]">
        <div className="flex items-center gap-1.5 text-secondary/60">
          <Users className="w-3.5 h-3.5" /> {members} siswa
        </div>
        {pending > 0 ? (
          <div className="flex items-center gap-1.5 text-secondary font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> {pending} perlu dinilai
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-secondary/40">
            <Check className="w-3.5 h-3.5" /> Tidak ada tugas
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
