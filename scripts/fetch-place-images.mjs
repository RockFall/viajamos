#!/usr/bin/env node
/**
 * Fetch local images for all trip entities defined in the Supabase SQL seed.
 *
 * Usage:
 *   node scripts/fetch-place-images.mjs
 *   node scripts/fetch-place-images.mjs --force   # re-download existing files
 *
 * Sources (no API keys):
 *   1. English Wikipedia page image
 *   2. Wikimedia Commons search
 *
 * Optional env (not required):
 *   GOOGLE_MAPS_STATIC_API_KEY — if set, used as last resort before category fallback
 *
 * Output:
 *   public/images/entities/{kind}/{id}.webp
 *   public/images/placeholders/*.webp
 *   public/images/heroes/*.webp
 *   lib/images/manifest.json
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SQL_PATH = path.join(
  ROOT,
  "supabase/viajamos_trip_seed_miami_islamorada_2026_FINAL_schema_checked.sql"
);
const PUBLIC_IMAGES = path.join(ROOT, "public/images");
const MANIFEST_PATH = path.join(ROOT, "lib/images/manifest.json");

const USER_AGENT = "ViajamosImageFetcher/1.0 (travel-app; local-dev)";
const FORCE = process.argv.includes("--force");
const GOOGLE_KEY = process.env.GOOGLE_MAPS_STATIC_API_KEY;

/** @type {Record<string, string>} */
const SEARCH_OVERRIDES = {
  "evt-23-greenstreet": "GreenStreet Cafe Coconut Grove Miami",
  "pp-miami-greenstreet": "GreenStreet Cafe Coconut Grove",
  "evt-23-vizcaya": "Vizcaya Museum and Gardens Miami",
  "pp-miami-vizcaya": "Vizcaya Museum and Gardens",
  "evt-23-air-sea": "Lummus Park Miami Beach",
  "evt-24-air-sea": "Hyundai Air and Sea Show Miami Beach",
  "pp-miami-air-sea": "Miami Beach Air Show South Beach",
  "evt-23-regatta": "Regatta Grove Coconut Grove Miami",
  "pp-miami-regatta": "Regatta Grove Miami",
  "evt-23-carl-cox": "Club Space Miami",
  "evt-24-charlotte": "Club Space Miami terrace",
  "pp-miami-space-carl": "Club Space Miami",
  "pp-miami-space-charlotte": "Club Space Miami",
  "ne-23-carl-cox": "Club Space Miami",
  "ne-24-charlotte": "Club Space Miami",
  "pp-miami-domicile-mdw": "Domicile Miami nightclub",
  "ne-22-24-domicile": "Domicile Miami nightclub",
  "pp-miami-two-friends-liv": "LIV nightclub Miami Beach",
  "ne-23-two-friends": "LIV nightclub Fontainebleau Miami",
  "evt-25-pamm": "Perez Art Museum Miami",
  "pp-miami-pamm": "Perez Art Museum Miami",
  "evt-25-little-havana": "Versailles Restaurant Little Havana Miami",
  "evt-25-ball-chain": "Ball and Chain Little Havana Miami",
  "pp-miami-ball-chain": "Ball and Chain Miami Calle Ocho",
  "ne-25-ball-chain": "Ball and Chain Little Havana",
  "evt-26-superblue": "Superblue Miami immersive art",
  "pp-miami-superblue": "Superblue Miami",
  "evt-26-wynwood": "Wynwood Walls Miami",
  "pp-miami-wynwood": "Wynwood Walls street art",
  "evt-26-betsy-jazz": "The Betsy Hotel South Beach",
  "ne-23-betsy-lavie": "The Betsy Hotel Ocean Drive Miami Beach",
  "pp-miami-betsy-la-vie": "The Betsy Hotel Miami Beach",
  "ne-27-betsy-angel": "The Betsy Hotel Miami Beach",
  "pp-miami-betsy-angel": "The Betsy Hotel Miami Beach",
  "pp-miami-fairchild": "Fairchild Tropical Botanic Garden",
  "evt-27-fairchild-or-grove": "Coconut Grove Miami",
  "evt-27-road": "Overseas Highway Florida Keys",
  "evt-27-lorelei": "Lorelei Cabana Bar Islamorada",
  "pp-keys-lorelei": "Lorelei Restaurant Islamorada",
  "ne-27-lorelei": "Lorelei Islamorada sunset",
  "evt-28-robbies": "Robbies Marina Islamorada tarpon",
  "pp-keys-robbies": "Robbies of Islamorada",
  "pp-keys-glass-bottom": "Robbies Islamorada glass bottom boat",
  "pp-keys-snorkel-robbies": "Cheeca Rocks snorkeling Islamorada",
  "pp-keys-kayak-indian": "Indian Key kayak Islamorada",
  "pp-keys-tasting-history": "Robbies Islamorada",
  "evt-28-theater": "Theater of the Sea Islamorada",
  "pp-keys-theater-sea": "Theater of the Sea Florida Keys",
  "evt-28-square": "Square Grouper Islamorada",
  "pp-keys-square": "Square Grouper Islamorada marina",
  "evt-29-diving": "History of Diving Museum Islamorada",
  "pp-keys-diving-museum": "History of Diving Museum Florida Keys",
  "evt-29-rainbarrel": "Rain Barrel Village Islamorada",
  "pp-keys-rainbarrel": "Rain Barrel Village Islamorada",
  "evt-29-fkbc": "Florida Keys Brewing Company Islamorada",
  "pp-keys-fkbc": "Florida Keys Brewing Company",
  "evt-29-morada": "Morada Bay Beach Cafe Islamorada",
  "pp-keys-morada": "Morada Bay Islamorada beach",
  "pp-miami-ica": "Institute of Contemporary Art Miami Design District",
  "pp-miami-design-district": "Miami Design District",
  "pp-miami-mandolin": "Mandolin Aegean Bistro Miami",
  "pp-miami-key-biscayne": "Crandon Park Beach Key Biscayne",
  "pp-miami-aventura": "Aventura Mall Florida",
  "pp-miami-cocowalk": "CocoWalk Coconut Grove",
  "pp-miami-trader-joes": "Trader Joes Coconut Grove",
  "pp-miami-lagniappe": "Lagniappe House Miami wine garden",
  "pp-miami-zak": "Zak the Baker Wynwood",
  "pp-miami-sweet-liberty": "Sweet Liberty Miami Beach cocktail bar",
  "pp-miami-joia-odk": "Joia Beach Miami Watson Island",
  "pp-keys-publix": "Publix supermarket Florida",
  "pp-keys-robert-is-here": "Robert Is Here fruit stand Homestead",
  "ep-lodging-miami": "Coconut Grove Miami residential",
  "ep-lodging-islamorada": "Islamorada Florida Keys waterfront",
  "ep-airport-mia": "Miami International Airport",
  "ep-market-miami": "Trader Joes grocery store",
  "ep-pharmacy-miami": "CVS pharmacy storefront",
  "ep-market-keys": "Publix supermarket Florida",
  "day-23": "Coconut Grove Miami Vizcaya",
  "day-24": "South Beach Miami Ocean Drive",
  "day-25": "Little Havana Calle Ocho Miami",
  "day-26": "Wynwood Miami street art",
  "day-27": "Overseas Highway Florida Keys sunset",
  "day-28": "Islamorada Florida Keys water",
  "day-29": "Islamorada brewery sunset",
  "day-30": "Florida Keys morning departure",
};

/** @type {Record<string, string>} */
const PLACEHOLDER_QUERIES = {
  food: "Mediterranean restaurant outdoor dining",
  cafe: "Specialty coffee cafe interior",
  music: "Live music concert stage lights",
  jazz: "Jazz club piano bar",
  electronic: "Nightclub DJ lights crowd",
  museum: "Art museum gallery interior",
  gallery: "Contemporary art gallery",
  shopping: "Boutique shopping street",
  walk: "Tropical botanical garden path",
  bar: "Cocktail bar sunset waterfront",
  experience: "Air show aerobatics beach",
  travel: "Highway road trip scenic",
  nearby: "Neighborhood street palm trees",
  "late-night": "City skyline night lights",
  lodging: "Vacation rental tropical patio",
  airport: "Airport terminal departure gate",
  pharmacy: "Pharmacy storefront",
  market: "Grocery store produce aisle",
  default: "Miami palm trees tropical",
};

/** @type {Record<string, string>} */
const HERO_QUERIES = {
  miami: "Miami skyline Biscayne Bay sunset",
  islamorada: "Islamorada Florida Keys turquoise water",
  travel: "Overseas Highway Seven Mile Bridge",
  "plans-hero": "Fairchild Tropical Botanic Garden Miami",
  night: "Miami Beach Ocean Drive night neon",
};

function parseInsertValues(sql, tableName) {
  const regex = new RegExp(
    `INSERT INTO ${tableName} \\([^)]+\\) VALUES \\((.+?)\\);`,
    "gs"
  );
  const rows = [];
  for (const match of sql.matchAll(regex)) {
    rows.push(match[1]);
  }
  return rows;
}

function splitSqlValues(row) {
  const values = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";

  for (let i = 0; i < row.length; i += 1) {
    const ch = row[i];
    if ((ch === "'" || ch === '"') && row[i - 1] !== "\\") {
      if (!inQuote) {
        inQuote = true;
        quoteChar = ch;
        current += ch;
      } else if (ch === quoteChar) {
        if (row[i + 1] === quoteChar) {
          current += ch + ch;
          i += 1;
        } else {
          inQuote = false;
          quoteChar = "";
          current += ch;
        }
      } else {
        current += ch;
      }
      continue;
    }
    if (ch === "," && !inQuote) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) values.push(current.trim());
  return values;
}

function unquote(value) {
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

function parseEntities(sql) {
  /** @type {Array<{ kind: string, id: string, title: string, category: string, address?: string, area?: string }>} */
  const entities = [];

  for (const row of parseInsertValues(sql, "trip_days")) {
    const [id, , title, , area] = splitSqlValues(row).map(unquote);
    entities.push({
      kind: "trip-days",
      id,
      title,
      category: area === "Islamorada" ? "area-islamorada" : area === "Travel" ? "area-travel" : "area-miami",
      area,
    });
  }

  for (const row of parseInsertValues(sql, "itinerary_events")) {
    const values = splitSqlValues(row).map(unquote);
    const [id, title, , , , , , locationName, address, , category] = values;
    entities.push({
      kind: "itinerary-events",
      id,
      title,
      category,
      address,
      locationName,
    });
  }

  for (const row of parseInsertValues(sql, "night_events")) {
    const values = splitSqlValues(row).map(unquote);
    const [id, , type, title, venue, neighborhood] = values;
    entities.push({
      kind: "night-events",
      id,
      title,
      category: type === "electronic" ? "electronic" : type,
      locationName: venue,
      address: neighborhood,
    });
  }

  for (const row of parseInsertValues(sql, "possible_plans")) {
    const values = splitSqlValues(row).map(unquote);
    const [id, title, , , , category, , neighborhood, address] = values;
    entities.push({
      kind: "possible-plans",
      id,
      title,
      category,
      address,
      locationName: neighborhood,
    });
  }

  for (const row of parseInsertValues(sql, "day_alternative_plans")) {
    const values = splitSqlValues(row).map(unquote);
    const [id, , trigger, title] = values;
    entities.push({
      kind: "alternatives",
      id,
      title,
      category: trigger,
    });
  }

  for (const row of parseInsertValues(sql, "essential_places")) {
    const values = splitSqlValues(row).map(unquote);
    const [id, name, type, address, area] = values;
    entities.push({
      kind: "essential-places",
      id,
      title: name,
      category: type,
      address,
      area,
    });
  }

  return entities;
}

function searchQuery(entity) {
  if (SEARCH_OVERRIDES[entity.id]) return SEARCH_OVERRIDES[entity.id];
  const parts = [entity.title, entity.locationName, entity.address]
    .filter(Boolean)
    .join(" ");
  return parts.replace(/\s+/g, " ").trim();
}

function locationKey(entity) {
  const base = [entity.locationName, entity.address, entity.title]
    .filter(Boolean)
    .join("|")
    .toLowerCase();
  return createHash("md5").update(base).digest("hex").slice(0, 12);
}

async function fetchJson(url, retries = 4) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (res.status === 429 && attempt < retries) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    if (res.status === 429) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
  }
  return null;
}

async function findWikipediaImage(query) {
  const data = await fetchJson(
    "https://en.wikipedia.org/w/api.php?" +
      new URLSearchParams({
        action: "query",
        generator: "search",
        gsrsearch: query,
        gsrnamespace: "0",
        gsrlimit: "3",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: "1200",
        format: "json",
        origin: "*",
      })
  );
  if (!data) return null;
  const pages = data.query?.pages;
  if (!pages) return null;
  for (const page of Object.values(pages)) {
    const thumb = page.thumbnail?.source;
    if (thumb) return thumb;
  }
  return null;
}

async function findCommonsImage(query) {
  const data = await fetchJson(
    "https://commons.wikimedia.org/w/api.php?" +
      new URLSearchParams({
        action: "query",
        generator: "search",
        gsrsearch: query,
        gsrnamespace: "6",
        gsrlimit: "5",
        prop: "imageinfo",
        iiprop: "url|mime",
        iiurlwidth: "1200",
        format: "json",
        origin: "*",
      })
  );
  if (!data) return null;
  const pages = data.query?.pages;
  if (!pages) return null;
  for (const page of Object.values(pages)) {
    const info = page.imageinfo?.[0];
    const mime = info?.mime ?? "";
    if (!info?.thumburl && !info?.url) continue;
    if (!mime.startsWith("image/")) continue;
    if (/\.svg$/i.test(info.url)) continue;
    return info.thumburl || info.url;
  }
  return null;
}

async function findGoogleStaticImage(query) {
  if (!GOOGLE_KEY) return null;
  const url =
    "https://maps.googleapis.com/maps/api/staticmap?" +
    new URLSearchParams({
      center: query,
      zoom: "15",
      size: "800x600",
      maptype: "roadmap",
      key: GOOGLE_KEY,
    });
  return url;
}

async function findImageUrl(query) {
  const commons = await findCommonsImage(query);
  if (commons) return { url: commons, source: "commons" };
  await sleep(500);
  const wiki = await findWikipediaImage(query);
  if (wiki) return { url: wiki, source: "wikipedia" };
  await sleep(500);
  const google = await findGoogleStaticImage(query);
  if (google) return { url: google, source: "google-static" };
  return null;
}

async function downloadBinary(url, retries = 5) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });
    if (res.status === 429 && attempt < retries) {
      await sleep(2500 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error(`Download failed after retries: ${url}`);
}

async function saveWebp(buffer, outputPath) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const jpgPath = outputPath.replace(/\.webp$/, ".jpg");
    await fs.writeFile(jpgPath, buffer);
    return jpgPath;
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const webp = await sharp(buffer)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  await fs.writeFile(outputPath, webp);
  return outputPath;
}

function publicPath(absPath) {
  return "/" + path.relative(path.join(ROOT, "public"), absPath).replace(/\\/g, "/");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureAsset(kind, filename, query) {
  const absPath = path.join(PUBLIC_IMAGES, kind, filename);
  if (!FORCE) {
    try {
      await fs.access(absPath);
      return publicPath(absPath);
    } catch {
      // continue
    }
  }

  const found = await findImageUrl(query);
  if (!found) {
    console.warn(`  ! Could not find asset for ${kind}/${filename}: ${query}`);
    return null;
  }
  const buffer = await downloadBinary(found.url);
  const saved = await saveWebp(buffer, absPath.endsWith(".webp") ? absPath : `${absPath}.webp`);
  console.log(`  + ${publicPath(saved)} (${found.source})`);
  await sleep(300);
  return publicPath(saved.endsWith(".webp") ? saved : absPath);
}

async function createSvgPlaceholder(label, hue) {
  const sharp = (await import("sharp")).default;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="hsl(${hue}, 45%, 28%)"/>
        <stop offset="100%" stop-color="hsl(${hue}, 35%, 18%)"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g)"/>
    <text x="600" y="420" text-anchor="middle" fill="rgba(255,255,255,0.72)" font-family="Georgia, serif" font-size="54">${label}</text>
  </svg>`;
  return sharp(Buffer.from(svg)).webp({ quality: 82 }).toBuffer();
}

const PLACEHOLDER_HUES = {
  food: 18,
  cafe: 28,
  music: 280,
  jazz: 265,
  electronic: 300,
  museum: 210,
  gallery: 200,
  shopping: 15,
  walk: 130,
  bar: 340,
  experience: 190,
  travel: 205,
  nearby: 120,
  "late-night": 260,
  lodging: 25,
  airport: 215,
  pharmacy: 350,
  market: 95,
  default: 16,
};

async function ensurePlaceholderAssets() {
  for (const [name, query] of Object.entries(PLACEHOLDER_QUERIES)) {
    const absPath = path.join(PUBLIC_IMAGES, "placeholders", `${name}.webp`);
    if (!FORCE) {
      try {
        await fs.access(absPath);
        continue;
      } catch {
        // continue
      }
    }

    const found = await findImageUrl(query);
    if (found) {
      try {
        const buffer = await downloadBinary(found.url);
        await saveWebp(buffer, absPath);
        console.log(`  + ${publicPath(absPath)} (${found.source})`);
        await sleep(900);
        continue;
      } catch {
        // fall through to generated placeholder
      }
    }

    const hue = PLACEHOLDER_HUES[name] ?? 20;
    const label = name.replace(/-/g, " ");
    const webp = await createSvgPlaceholder(label, hue);
    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, webp);
    console.log(`  + ${publicPath(absPath)} (generated)`);
  }
}

async function main() {
  console.log("Reading SQL seed…");
  const sql = await fs.readFile(SQL_PATH, "utf8");
  const entities = parseEntities(sql);
  console.log(`Found ${entities.length} entities`);

  console.log("\nFetching hero + placeholder images…");
  for (const [name, query] of Object.entries(HERO_QUERIES)) {
    await ensureAsset("heroes", `${name}.webp`, query);
    await sleep(900);
  }
  await ensurePlaceholderAssets();

  /** @type {Record<string, string>} */
  const locationCache = {};
  /** @type {Partial<Record<string, Record<string, string>>>} */
  const manifestEntities = {};
  let downloaded = 0;
  let copied = 0;
  let fallback = 0;

  console.log("\nFetching entity images…");
  for (const entity of entities) {
    const outDir = path.join(PUBLIC_IMAGES, "entities", entity.kind);
    const outFile = path.join(outDir, `${entity.id}.webp`);
    const publicOut = `/images/entities/${entity.kind}/${entity.id}.webp`;

    if (!manifestEntities[entity.kind]) manifestEntities[entity.kind] = {};

    if (!FORCE) {
      try {
        await fs.access(outFile);
        manifestEntities[entity.kind][entity.id] = publicOut;
        downloaded += 1;
        continue;
      } catch {
        // continue
      }
    }

    const locKey = locationKey(entity);
    if (locationCache[locKey]) {
      await fs.mkdir(outDir, { recursive: true });
      const sourceAbs = path.join(ROOT, "public", locationCache[locKey].replace(/^\//, ""));
      await fs.copyFile(sourceAbs, outFile);
      manifestEntities[entity.kind][entity.id] = publicOut;
      copied += 1;
      console.log(`  = ${entity.id} copied from ${locationCache[locKey]}`);
      continue;
    }

    const query = searchQuery(entity);
    const found = await findImageUrl(query);
    if (!found) {
      fallback += 1;
      console.warn(`  ! fallback ${entity.kind}/${entity.id}: ${query}`);
      await sleep(150);
      continue;
    }

    try {
      const buffer = await downloadBinary(found.url);
      await saveWebp(buffer, outFile);
      manifestEntities[entity.kind][entity.id] = publicOut;
      locationCache[locKey] = publicOut;
      downloaded += 1;
      console.log(`  + ${entity.id} (${found.source})`);
    } catch (err) {
      fallback += 1;
      console.warn(`  ! failed ${entity.id}: ${err.message}`);
    }
    await sleep(1200);
  }

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: "supabase/viajamos_trip_seed_miami_islamorada_2026_FINAL_schema_checked.sql",
    entities: manifestEntities,
    stats: {
      total: entities.length,
      downloaded,
      copied,
      fallback,
    },
  };

  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log("\nDone.");
  console.log(
    `Images: ${downloaded} downloaded, ${copied} copied, ${fallback} using runtime category fallbacks`
  );
  console.log(`Manifest: ${path.relative(ROOT, MANIFEST_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
