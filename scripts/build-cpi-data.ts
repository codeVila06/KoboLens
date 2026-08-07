/**
 * Build script to parse raw NBS CPI data into clean lib/cpi.data.json
 *
 * Usage: npm run build:cpi
 * (or npx tsx scripts/build-cpi-data.ts)
 *
 * Ingests raw NBS monthly or annual data from either:
 *  - scripts/raw-cpi-data.csv
 *  - scripts/raw-cpi-data.json
 *
 * If no raw files are found, it falls back to current lib/cpi.data.json
 * and generates template sample files (raw-cpi-data.sample.csv / json).
 */

import * as fs from "fs";
import * as path from "path";

interface RawCPIData {
  year: number;
  month?: number;
  cpi?: number;
  cpiOld?: number; // 2009 base (100 = Nov 2009)
  cpiNew?: number; // 2024 base (100 = 2024)
}

interface CleanCPIData {
  year: number;
  cpi: number;
}

interface Output {
  meta: {
    baseYear: number;
    baseValue: number;
    lastUpdated: string;
    source: string;
    note: string;
  };
  data: CleanCPIData[];
}

// 2024 NBS Rebase bridge factor (2009 base CPI at 2024 baseline = ~794.9)
const REBASE_2024_MULTIPLIER = 7.949;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csvContent: string): RawCPIData[] {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));

  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
  const yearIdx = headers.findIndex((h) => h === "year");
  const monthIdx = headers.findIndex((h) => h === "month");
  const cpiIdx = headers.findIndex((h) => h === "cpi" || h === "cpiold" || h === "index");
  const cpiNewIdx = headers.findIndex((h) => h === "cpinew" || h === "rebased_cpi");

  if (yearIdx === -1) {
    throw new Error("CSV missing required 'year' header column");
  }

  const rawData: RawCPIData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const yearVal = parseInt(cols[yearIdx], 10);
    if (isNaN(yearVal)) continue;

    const monthVal = monthIdx !== -1 ? parseInt(cols[monthIdx], 10) : undefined;
    const cpiVal = cpiIdx !== -1 ? parseFloat(cols[cpiIdx]) : undefined;
    const cpiNewVal = cpiNewIdx !== -1 ? parseFloat(cols[cpiNewIdx]) : undefined;

    rawData.push({
      year: yearVal,
      month: isNaN(monthVal!) ? undefined : monthVal,
      cpi: isNaN(cpiVal!) ? undefined : cpiVal,
      cpiOld: isNaN(cpiVal!) ? undefined : cpiVal,
      cpiNew: isNaN(cpiNewVal!) ? undefined : cpiNewVal,
    });
  }

  return rawData;
}

function createSampleFiles(dir: string): void {
  const sampleCSV = `year,month,cpi,cpiNew
# Official NBS CPI Monthly Sample (2009=100 base)
2023,1,540.2,
2023,2,549.8,
2023,3,559.4,
2023,4,569.1,
2023,5,579.0,
2023,6,590.2,
2023,7,605.1,
2023,8,624.0,
2023,9,637.2,
2023,10,648.5,
2023,11,660.1,
2023,12,671.3,
2024,1,691.0,100.0
`;

  const sampleJSON = JSON.stringify(
    [
      { year: 2023, month: 1, cpi: 540.2 },
      { year: 2023, month: 2, cpi: 549.8 },
      { year: 2024, month: 1, cpiNew: 100.0, note: "Rebased 2024=100" },
    ],
    null,
    2
  );

  const csvSamplePath = path.join(dir, "raw-cpi-data.sample.csv");
  const jsonSamplePath = path.join(dir, "raw-cpi-data.sample.json");

  fs.writeFileSync(csvSamplePath, sampleCSV);
  fs.writeFileSync(jsonSamplePath, sampleJSON);

  console.log(`ℹ Created sample template files:`);
  console.log(`  - ${csvSamplePath}`);
  console.log(`  - ${jsonSamplePath}`);
}

function loadRawData(): RawCPIData[] {
  const dir = __dirname;
  const csvPath = path.join(dir, "raw-cpi-data.csv");
  const jsonPath = path.join(dir, "raw-cpi-data.json");

  if (fs.existsSync(csvPath)) {
    console.log(`✓ Loading raw NBS CPI data from CSV: ${csvPath}`);
    const content = fs.readFileSync(csvPath, "utf-8");
    return parseCSV(content);
  }

  if (fs.existsSync(jsonPath)) {
    console.log(`✓ Loading raw NBS CPI data from JSON: ${jsonPath}`);
    const content = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(content) as RawCPIData[];
  }

  console.log("No raw-cpi-data.csv or raw-cpi-data.json file found.");
  createSampleFiles(dir);

  // Fallback to existing lib/cpi.data.json
  const existingPath = path.join(dir, "..", "lib", "cpi.data.json");
  if (fs.existsSync(existingPath)) {
    console.log(`✓ Falling back to existing data in ${existingPath}`);
    const existing = JSON.parse(fs.readFileSync(existingPath, "utf-8")) as Output;
    return existing.data.map((d) => ({ year: d.year, cpi: d.cpi, cpiOld: d.cpi }));
  }

  throw new Error("No raw or existing CPI data source available.");
}

function normalizeAndBridgeCPI(row: RawCPIData): number | undefined {
  if (row.cpi !== undefined && !isNaN(row.cpi)) return row.cpi;
  if (row.cpiOld !== undefined && !isNaN(row.cpiOld)) return row.cpiOld;
  if (row.cpiNew !== undefined && !isNaN(row.cpiNew)) {
    // Bridge 2024 rebased series (2024=100) to 2009 continuous series
    return Math.round(row.cpiNew * REBASE_2024_MULTIPLIER * 100) / 100;
  }
  return undefined;
}

function buildAnnualSeries(raw: RawCPIData[]): CleanCPIData[] {
  // Group by year and average monthly or annual points
  const byYear = new Map<number, number[]>();

  for (const row of raw) {
    if (!row.year) continue;
    const value = normalizeAndBridgeCPI(row);
    if (value === undefined) continue;

    const arr = byYear.get(row.year) || [];
    arr.push(value);
    byYear.set(row.year, arr);
  }

  const annual: CleanCPIData[] = [];
  byYear.forEach((values, year) => {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    annual.push({ year, cpi: Math.round(avg * 10) / 10 });
  });

  return annual.sort((a, b) => a.year - b.year);
}

function validate(series: CleanCPIData[]): void {
  if (series.length === 0) throw new Error("No valid CPI data points generated");

  const years = series.map((d) => d.year);
  const min = Math.min(...years);
  const max = Math.max(...years);

  // Check for year gaps
  for (let y = min; y <= max; y++) {
    if (!years.includes(y)) {
      console.warn(`⚠️ Warning: Gap detected for year ${y}`);
    }
  }

  // Check for non-positive values
  for (const d of series) {
    if (d.cpi <= 0) throw new Error(`Invalid CPI value for year ${d.year}: ${d.cpi}`);
  }

  // Check monotonicity
  for (let i = 1; i < series.length; i++) {
    if (series[i].cpi < series[i - 1].cpi * 0.9) {
      console.warn(
        `⚠️ Warning: Large CPI drop from ${series[i - 1].year} (${series[i - 1].cpi}) to ${series[i].year} (${series[i].cpi})`
      );
    }
  }
}

function main() {
  try {
    const raw = loadRawData();
    const annual = buildAnnualSeries(raw);
    validate(annual);

    const output: Output = {
      meta: {
        baseYear: 2009,
        baseValue: 100,
        lastUpdated: new Date().toISOString().split("T")[0],
        source: "National Bureau of Statistics Nigeria",
        note: "Annual average CPI. 2024+ values bridged from NBS 2024 rebase (2024=100) to continuous 2009=100 series",
      },
      data: annual,
    };

    const outPath = path.join(__dirname, "..", "lib", "cpi.data.json");
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
    console.log(`✅ Success: Generated ${annual.length} CPI data points in ${outPath}`);
    console.log(`   Year Range: ${annual[0].year} – ${annual[annual.length - 1].year}`);
  } catch (err) {
    console.error("❌ Error building CPI data:", err);
    process.exit(1);
  }
}

main();