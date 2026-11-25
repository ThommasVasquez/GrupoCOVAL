/**
 * Optimiza las imágenes oficiales importadas desde grupocoval.com.co:
 * - Convierte JPG/PNG a WebP (máx. 1600 px de ancho, calidad 80; logos con alfa a calidad 90).
 * - Elimina el original pesado y genera content/media-manifest.json con ancho/alto reales
 *   para que next/image reserve espacio exacto (CLS = 0).
 *
 * Uso: node scripts/optimize-images.mjs
 */
import { readdir, stat, unlink, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "content", "media-manifest.json");
const MAX_WIDTH = 1600;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

const manifest = {};
const files = await walk(IMAGES_DIR);
let savedBytes = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const publicPath = (f) => "/" + path.relative(path.join(ROOT, "public"), f).split(path.sep).join("/");

  if (ext === ".webp") {
    const meta = await sharp(file).metadata();
    manifest[publicPath(file)] = { width: meta.width, height: meta.height };
    continue;
  }
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

  const out = file.slice(0, -ext.length) + ".webp";
  const before = (await stat(file)).size;
  const meta = await sharp(file).metadata();
  const isLogo = /brand\//.test(file) || meta.hasAlpha;

  const pipeline = sharp(file).rotate();
  if ((meta.width ?? 0) > MAX_WIDTH) pipeline.resize({ width: MAX_WIDTH });
  const info = await pipeline
    .webp({ quality: isLogo ? 90 : 80, alphaQuality: 100, effort: 5 })
    .toFile(out);

  const after = (await stat(out)).size;
  savedBytes += before - after;
  await unlink(file);
  manifest[publicPath(out)] = { width: info.width, height: info.height };
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

// Actualiza rutas .png/.jpg -> .webp en el contenido JSON
for (const rel of ["content/catalog/equipos.json", "content/global/group.json", "content/global/home.json"]) {
  const p = path.join(ROOT, rel);
  try {
    const raw = await readFile(p, "utf8");
    await writeFile(p, raw.replace(/(\/images\/[^"]+)\.(png|jpe?g)"/g, '$1.webp"'));
  } catch {
    /* archivo opcional */
  }
}

console.log(`Imágenes procesadas: ${Object.keys(sorted).length} · Ahorro: ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);
