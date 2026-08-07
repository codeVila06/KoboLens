import bundled from "./cpi.data.json";

export interface CPISeriesPoint {
  year: number;
  cpi: number;
}

export interface DataStatus {
  live: boolean;
  source: string;
  updated: string;
  projectedYears: number[];
}

interface WorldBankRow {
  date: string;
  value: number | null;
}

const CACHE_KEY = "kobolens-live-cpi";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const WORLD_BANK_URL =
  "https://api.worldbank.org/v2/country/NGA/indicator/FP.CPI.TOTL?format=json&date=2009:2026&per_page=100";

const bundledSeries: CPISeriesPoint[] = bundled.data;

let series: CPISeriesPoint[] = bundledSeries;
let range = computeRange(series);
let projectedYears = computeProjectedYears(series);
let status: DataStatus = {
  live: false,
  source: "NBS Nigeria (bundled snapshot)",
  updated: bundled.meta.lastUpdated,
  projectedYears,
};

function computeRange(s: CPISeriesPoint[]): { min: number; max: number } {
  const years = s.map((d) => d.year);
  return { min: Math.min(...years), max: Math.max(...years) };
}

function computeProjectedYears(s: CPISeriesPoint[]): number[] {
  const max = Math.max(...s.map((d) => d.year));
  const currentYear = new Date().getFullYear();
  return max === currentYear ? [max] : [];
}

export function getSeries(): CPISeriesPoint[] {
  return series;
}

export function getYearRange(): { min: number; max: number } {
  return range;
}

export function getDataStatus(): DataStatus {
  return status;
}

function rescaleToBundledBase(
  live: CPISeriesPoint[]
): CPISeriesPoint[] | null {
  const overlaps = live.filter((l) =>
    bundledSeries.some((b) => b.year === l.year)
  );
  if (overlaps.length === 0) return null;

  const ratios = overlaps.map((l) => {
    const b = bundledSeries.find((b) => b.year === l.year)!;
    return b.cpi / l.cpi;
  });
  const scale = ratios.reduce((a, b) => a + b, 0) / ratios.length;

  return live.map((l) => ({
    year: l.year,
    cpi: Math.round(l.cpi * scale * 10) / 10,
  }));
}

function mergeSeries(
  live: CPISeriesPoint[],
  fallback: CPISeriesPoint[]
): CPISeriesPoint[] {
  const liveByYear = new Map(live.map((d) => [d.year, d]));
  const merged = fallback.map((b) => liveByYear.get(b.year) ?? b);
  for (const l of live) {
    if (!merged.some((m) => m.year === l.year)) {
      merged.push(l);
    }
  }
  return merged.sort((a, b) => a.year - b.year);
}

function apply(s: CPISeriesPoint[]): void {
  series = s;
  range = computeRange(s);
  projectedYears = computeProjectedYears(s);
  status.projectedYears = projectedYears;
}

export async function refreshLiveData(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const cachedRaw = localStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as {
        fetchedAt: number;
        series: CPISeriesPoint[];
      };
      if (Date.now() - cached.fetchedAt < CACHE_TTL_MS && cached.series.length) {
        apply(cached.series);
        status = {
          live: true,
          source: "World Bank / IMF (cached)",
          updated: new Date(cached.fetchedAt).toISOString().slice(0, 10),
          projectedYears,
        };
        return;
      }
    }

    const res = await fetch(WORLD_BANK_URL);
    if (!res.ok) return;
    const json = await res.json();
    const rows: WorldBankRow[] = Array.isArray(json) ? json[1] : null;
    if (!Array.isArray(rows) || rows.length === 0) return;

    const live = rows
      .filter((r) => r.value != null)
      .map((r) => ({ year: Number(r.date), cpi: Number(r.value) }));

    const rescaled = rescaleToBundledBase(live);
    if (!rescaled) return;

    apply(mergeSeries(rescaled, bundledSeries));
    const now = Date.now();
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ fetchedAt: now, series })
    );
    status = {
      live: true,
      source: "World Bank / IMF (live)",
      updated: new Date(now).toISOString().slice(0, 10),
      projectedYears,
    };
  } catch {
    // keep bundled data as fallback
  }
}
