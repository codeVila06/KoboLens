export interface SavedCalculation {
  id: string;
  name: string;
  amount: number;
  fromYear: number;
  toYear: number;
  createdAt: string;
}

const STORAGE_KEY = "kobolens-saved-calculations";

export function getSavedCalculations(): SavedCalculation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedCalculation[];
  } catch {
    return [];
  }
}

export function saveCalculation(calc: Omit<SavedCalculation, "id" | "createdAt">): SavedCalculation {
  const saved = getSavedCalculations();
  const newCalc: SavedCalculation = {
    ...calc,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = [newCalc, ...saved].slice(0, 20); // max 20 saved
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newCalc;
}

export function deleteCalculation(id: string): void {
  const saved = getSavedCalculations();
  const updated = saved.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}