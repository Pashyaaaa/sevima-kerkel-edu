import sanitizeHtml from "sanitize-html";

/**
 * Sanitasi konten submission. Karena submission bisa berupa teks bebas (puisi/esai)
 * ATAU URL (link gambar/audio hasil upload ke storage lain), kita:
 * 1. Buang semua tag HTML/script berbahaya (XSS).
 * 2. Tetap izinkan sedikit formatting dasar untuk teks (bold/italic/paragraf/line break)
 *    supaya puisi/esai tetap enak dibaca.
 */
export function sanitizeContent(raw: string): string {
  const cleaned = sanitizeHtml(raw, {
    allowedTags: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  }).trim();

  return cleaned;
}

/** Sanitasi ringan untuk field teks biasa (nama, judul, deskripsi singkat, dsb) */
export function sanitizePlainText(raw: string): string {
  return sanitizeHtml(raw, { allowedTags: [], allowedAttributes: {} }).trim();
}
