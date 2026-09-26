// Kelas yang tersedia di sistem (hasil "dibuat guru")
export const MASTER_CLASSES = {
  ART7X9: {
    code: "ART7X9",
    name: "Seni Budaya",
    teacher: "Bu Rina W.",
    members: 32,
  },
  LIT4K2: {
    code: "LIT4K2",
    name: "Sastra Indonesia",
    teacher: "Pak Budi S.",
    members: 30,
  },
  ENG8Q1: {
    code: "ENG8Q1",
    name: "Bahasa Inggris",
    teacher: "Ms. Sarah",
    members: 28,
  },
};

// Tugas yang tersedia (hasil "dibuat guru") — per kelas
export const MASTER_TASKS = [
  {
    id: "task-art-1",
    classCode: "ART7X9",
    kelas: "Seni Budaya · XI IPA 2",
    title: "Analisis Lukisan Abstrak",
    desc: "Unggah karya lukisan digital abstrak beserta esai interpretasi singkat (PDF, maks 5MB).",
    deadline: "2 jam lagi",
    deadlineAt: Date.now() + 2 * 60 * 60 * 1000,
    urgent: true,
    type: "submit",
  },
  {
    id: "task-lit-1",
    classCode: "LIT4K2",
    kelas: "Sastra Indonesia",
    title: "Puisi Kontemporer",
    desc: "Nilai rima, diksi, dan pesan moral. Karya anonim demi mencegah bias.",
    deadline: "Besok, 23:59",
    deadlineAt: Date.now() + 24 * 60 * 60 * 1000,
    type: "review",
    code: "#A89B",
  },
  {
    id: "task-lit-2",
    classCode: "LIT4K2",
    kelas: "Sastra Indonesia",
    title: "Puisi Kontemporer",
    desc: "Nilai rima, diksi, dan pesan moral. Karya anonim demi mencegah bias.",
    deadline: "Besok, 23:59",
    deadlineAt: Date.now() + 24 * 60 * 60 * 1000,
    type: "review",
    code: "#C12D",
  },
  {
    id: "task-eng-1",
    classCode: "ENG8Q1",
    kelas: "Bahasa Inggris",
    title: "Essay: My Future",
    desc: "Nilai struktur grammar dan kohesi antar paragraf.",
    deadline: "2 hari lagi",
    deadlineAt: Date.now() + 48 * 60 * 60 * 1000,
    type: "review",
    code: "#F04A",
  },
];

// Bentuk awal localStorage
export const INITIAL_STATE = {
  version: 1,
  joinedClasses: [], // ["ART7X9", "LIT4K2"]
  submittedTasks: [], // ["task-art-1"]
  reviewedTasks: [], // ["task-lit-1"]
  reputation: 85,
};
