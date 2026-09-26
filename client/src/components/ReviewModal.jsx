import { useState, useEffect, useRef } from "react";
import { X, Star, Send, Loader2, Shuffle } from "lucide-react";

const ReviewModal = ({ task, onClose, onSubmit }) => {
  const [score, setScore] = useState(75);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [seed, setSeed] = useState(() =>
    Math.random().toString(36).slice(2, 8),
  );
  const dialogRef = useRef(null);

  /* --- Gambar random per task + seed --- */
  const imageUrl = `https://picsum.photos/seed/${task.id}-${seed}/900/600`;

  /* --- Kunci scroll body saat modal buka --- */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* --- ESC untuk close --- */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* --- Klik backdrop untuk close --- */
  const handleBackdropClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    // Simulasi call API
    setTimeout(() => {
      onSubmit({ taskId: task.id, score, note: note.trim() });
      setSubmitting(false);
    }, 700);
  };

  /* --- Warna slider dinamis --- */
  const getScoreColor = (v) => {
    if (v < 40) return "text-red-500";
    if (v < 70) return "text-amber-500";
    return "text-primary";
  };

  const scoreLabel = (v) => {
    if (v < 40) return "Kurang";
    if (v < 60) return "Cukup";
    if (v < 80) return "Baik";
    return "Sangat Baik";
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-[fadeIn_150ms_ease-out]"
      style={{ animation: "fadeIn 150ms ease-out" }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-2xl bg-secondary text-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        style={{ animation: "slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* ===== HEADER ===== */}
        <div className="flex items-start justify-between gap-3 px-5 md:px-6 py-4 border-b border-primary/10 flex-shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-bold text-primary/50 uppercase tracking-wider">
                {task.kelas}
              </p>
              <span className="text-[10px] font-bold bg-primary text-secondary px-2 py-0.5 rounded font-mono tracking-wider">
                {task.code}
              </span>
            </div>
            <h3 className="font-bold text-base md:text-lg leading-snug truncate">
              {task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ===== SCROLL AREA ===== */}
        <div className="overflow-y-auto flex-1">
          {/* --- GAMBAR KARYA --- */}
          <div className="relative bg-primary/5">
            <img
              src={imageUrl}
              alt="Karya yang dinilai"
              className="w-full h-56 md:h-72 object-cover"
              loading="lazy"
            />
            <button
              onClick={() => setSeed(Math.random().toString(36).slice(2, 8))}
              title="Acak gambar lain"
              className="absolute bottom-3 right-3 w-9 h-9 rounded-lg bg-secondary/90 hover:bg-secondary backdrop-blur-sm border border-primary/10 flex items-center justify-center transition-colors shadow-lg"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-secondary/90 backdrop-blur-sm border border-primary/10 text-[10px] font-bold tracking-wider">
              KARYA ANONIM
            </div>
          </div>

          {/* --- FORM --- */}
          <div className="px-5 md:px-6 py-5 space-y-6">
            <p className="text-xs text-primary/60 leading-relaxed">
              {task.desc}
            </p>

            {/* Rating */}
            <div>
              <div className="flex items-end justify-between mb-3">
                <label className="text-sm font-semibold">Nilai Karya</label>
                <div className="text-right leading-none">
                  <span
                    className={`text-3xl font-extrabold ${getScoreColor(score)}`}
                  >
                    {score}
                  </span>
                  <span className="text-sm text-primary/40 font-medium ml-1">
                    /100
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/50 mt-1">
                    {scoreLabel(score)}
                  </p>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-primary/10 accent-primary cursor-pointer"
                style={{
                  background: `linear-gradient(to right, currentColor 0%, currentColor ${score}%, rgba(0,0,0,0.1) ${score}%, rgba(0,0,0,0.1) 100%)`,
                }}
              />

              {/* Quick pick */}
              <div className="flex items-center gap-1.5 mt-3">
                {[0, 25, 50, 75, 100].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setScore(v)}
                    className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg border transition-all ${
                      score === v
                        ? "bg-primary text-secondary border-primary"
                        : "bg-primary/5 text-primary/60 border-primary/10 hover:border-primary/30"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Deskripsi opsional */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">
                  Catatan{" "}
                  <span className="text-primary/40 font-normal">
                    (opsional)
                  </span>
                </label>
                <span className="text-[11px] text-primary/40">
                  {note.length}/300
                </span>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 300))}
                placeholder="Tulis alasan penilaianmu… (mis. diksi kuat di bait kedua, tapi rima kurang konsisten)"
                rows={3}
                className="w-full bg-transparent border border-primary/20 text-primary placeholder-primary/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none"
              />
            </div>

            {/* Info anonimitas */}
            <div className="flex items-start gap-3 bg-primary/5 border border-primary/10 rounded-xl p-3">
              <Star className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-primary/60 leading-relaxed">
                Penilaianmu <span className="font-semibold">anonim</span> dan
                akan dikombinasikan dengan penilai lain untuk menghitung
                konsensus. Reputasimu naik jika penilaianmu dekat dengan
                rata-rata kelas.
              </p>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-primary/10 flex-shrink-0 bg-primary/[0.02]">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-primary/60 hover:text-primary transition-colors px-3 py-2"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary text-secondary font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 transition-all flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Mengirim…
              </>
            ) : (
              <>
                Kirim Penilaian <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animasi inline (bisa dipindah ke CSS global) */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ReviewModal;
