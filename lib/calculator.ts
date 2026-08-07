import { getSeries } from "./liveData";

export interface CalculationResult {
  amount: number;
  fromYear: number;
  toYear: number;
  result: number;
  purchasingPowerLost: number;
  inflationRate: number;
}

function buildCpiMap(): Map<number, number> {
  return new Map(getSeries().map((d) => [d.year, d.cpi]));
}

export function getYearRange(): { min: number; max: number } {
  const years = getSeries().map((d) => d.year);
  return { min: Math.min(...years), max: Math.max(...years) };
}

export function getAllYears(): number[] {
  return getSeries().map((d) => d.year);
}

export function getCPI(year: number): number | undefined {
  return buildCpiMap().get(year);
}

export function calculateAdjustedPrice(
  amount: number,
  fromYear: number,
  toYear: number
): CalculationResult {
  const cpiMap = buildCpiMap();
  const cpiFrom = cpiMap.get(fromYear);
  const cpiTo = cpiMap.get(toYear);

  if (cpiFrom === undefined || cpiTo === undefined) {
    throw new Error(`CPI data not available for years ${fromYear} or ${toYear}`);
  }

  const result = amount * (cpiTo / cpiFrom);
  const inflationRate = ((cpiTo - cpiFrom) / cpiFrom) * 100;
  const purchasingPowerLost = ((cpiTo - cpiFrom) / cpiTo) * 100;

  return {
    amount,
    fromYear,
    toYear,
    result: Math.round(result * 100) / 100,
    purchasingPowerLost: Math.round(purchasingPowerLost * 10) / 10,
    inflationRate: Math.round(inflationRate * 10) / 10,
  };
}

export function getYearlyValues(
  amount: number,
  fromYear: number
): { year: number; value: number }[] {
  const cpiFrom = buildCpiMap().get(fromYear);
  if (!cpiFrom) return [];

  return getSeries().map((d) => ({
    year: d.year,
    value: Math.round((amount * (d.cpi / cpiFrom)) * 100) / 100,
  }));
}
