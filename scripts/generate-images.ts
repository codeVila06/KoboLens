/**
 * Generate brand assets: favicon, app icon, and Open Graph share image.
 *
 * Usage: npm run generate:images
 * Outputs to public/favicon.svg, public/icon.png, public/og.png
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const PUBLIC = path.join(__dirname, "..", "public");

const SAGE = "#2d5a3d";
const SAGE_300 = "#9bc4a3";
const WHITE = "#ffffff";

const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${SAGE}"/>
  <circle cx="256" cy="256" r="148" fill="none" stroke="${SAGE_300}" stroke-width="20"/>
  <circle cx="256" cy="256" r="126" fill="none" stroke="${SAGE_300}" stroke-width="4" opacity="0.6"/>
  <text x="256" y="332" font-family="'Segoe UI', Arial, sans-serif" font-size="236" font-weight="700" fill="${WHITE}" text-anchor="middle">&#8358;</text>
</svg>`;

const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${SAGE}"/>
      <stop offset="1" stop-color="#1e3d28"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="960" y="600" font-family="Georgia, 'Times New Roman', serif" font-size="460" fill="${WHITE}" opacity="0.05" text-anchor="middle">&#8358;</text>
  <circle cx="96" cy="132" r="36" fill="none" stroke="${SAGE_300}" stroke-width="7"/>
  <text x="96" y="147" font-family="'Segoe UI', Arial, sans-serif" font-size="46" font-weight="700" fill="${WHITE}" text-anchor="middle">&#8358;</text>
  <text x="150" y="147" font-family="'Segoe UI', Arial, sans-serif" font-size="34" font-weight="700" fill="${WHITE}" letter-spacing="1">KoboLens</text>
  <text x="96" y="300" font-family="'Segoe UI', Arial, sans-serif" font-size="68" font-weight="700" fill="${WHITE}">Adjust Nigerian prices
    <tspan x="96" dy="80">for inflation.</tspan>
  </text>
  <text x="96" y="440" font-family="'Segoe UI', Arial, sans-serif" font-size="30" fill="${SAGE_300}">See what your Naira is really worth, using official NBS CPI data.</text>
  <rect x="96" y="480" width="120" height="5" fill="${SAGE_300}" opacity="0.5"/>
  <text x="96" y="560" font-family="'Segoe UI', Arial, sans-serif" font-size="26" fill="#e6f2e8">Official NBS CPI data &#8226; 2009&#8211;2026</text>
</svg>`;

function main(): void {
  if (!fs.existsSync(PUBLIC)) {
    fs.mkdirSync(PUBLIC, { recursive: true });
  }

  fs.writeFileSync(path.join(PUBLIC, "favicon.svg"), faviconSvg);
  console.log("✔ public/favicon.svg");

  sharp(Buffer.from(faviconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC, "icon.png"))
    .then(() => console.log("✔ public/icon.png (512x512)"));

  sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(PUBLIC, "og.png"))
    .then(() => console.log("✔ public/og.png (1200x630)"));
}

main();
