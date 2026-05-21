#!/usr/bin/env node
/**
 * Convert generated PNG assets to webp heroes/placeholders.
 * Usage: node scripts/convert-generated-images.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS =
  process.env.GENERATED_ASSETS_DIR ??
  path.resolve(ROOT, "../../.cursor/projects/home-fall-dev-viajamos/assets");
const PUBLIC = path.join(ROOT, "public/images");

const HERO_MAP = {
  "hero-miami-gen.png": { out: "heroes/miami.webp", w: 1200, h: 500 },
  "hero-islamorada-gen.png": { out: "heroes/islamorada.webp", w: 1200, h: 500 },
  "hero-travel-gen.png": { out: "heroes/travel.webp", w: 1200, h: 500 },
  "hero-plans-gen.png": { out: "heroes/plans-hero.webp", w: 1200, h: 500 },
  "hero-night-gen.png": { out: "heroes/night.webp", w: 1200, h: 500 },
};

const PLACEHOLDER_MAP = {
  "placeholder-food-gen.png": "placeholders/food.webp",
  "placeholder-cafe-gen.png": "placeholders/cafe.webp",
  "placeholder-music-gen.png": "placeholders/music.webp",
  "placeholder-jazz-gen.png": "placeholders/jazz.webp",
  "placeholder-electronic-gen.png": "placeholders/electronic.webp",
  "placeholder-museum-gen.png": "placeholders/museum.webp",
  "placeholder-gallery-gen.png": "placeholders/gallery.webp",
  "placeholder-shopping-gen.png": "placeholders/shopping.webp",
  "placeholder-walk-gen.png": "placeholders/walk.webp",
  "placeholder-bar-gen.png": "placeholders/bar.webp",
  "placeholder-experience-gen.png": "placeholders/experience.webp",
  "placeholder-travel-gen.png": "placeholders/travel.webp",
  "placeholder-nearby-gen.png": "placeholders/nearby.webp",
  "placeholder-late-night-gen.png": "placeholders/late-night.webp",
  "placeholder-lodging-gen.png": "placeholders/lodging.webp",
  "placeholder-airport-gen.png": "placeholders/airport.webp",
  "placeholder-pharmacy-gen.png": "placeholders/pharmacy.webp",
  "placeholder-market-gen.png": "placeholders/market.webp",
  "placeholder-default-gen.png": "placeholders/default.webp",
};

async function toWebp(input, output, { width, height }) {
  let pipeline = sharp(input).rotate();
  if (height) {
    pipeline = pipeline.resize(width, height, { fit: "cover", position: "centre" });
  } else {
    pipeline = pipeline.resize({ width, withoutEnlargement: true });
  }
  const webp = await pipeline.webp({ quality: 82 }).toBuffer();
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, webp);
  const stat = await fs.stat(output);
  console.log(`  + ${path.relative(ROOT, output)} (${stat.size} bytes)`);
}

async function main() {
  console.log("Converting heroes…");
  for (const [src, { out, w, h }] of Object.entries(HERO_MAP)) {
    const input = path.join(ASSETS, src);
    const output = path.join(PUBLIC, out);
    await toWebp(input, output, { width: w, height: h });
  }

  console.log("Converting placeholders…");
  for (const [src, out] of Object.entries(PLACEHOLDER_MAP)) {
    const input = path.join(ASSETS, src);
    const output = path.join(PUBLIC, out);
    await toWebp(input, output, { width: 1200 });
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
