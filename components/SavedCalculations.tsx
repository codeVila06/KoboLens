"use client";

import { X } from "lucide-react";
import { SavedCalculation } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";

interface SavedCalculationsProps {
  calculations: SavedCalculation[];
  onSelect: (calc: SavedCalculation) => void;
  onDelete: (id: string) => void;
}

export default function SavedCalculations({
  calculations,
  onSelect,
  onDelete,
}: SavedCalculationsProps) {
  if (calculations.length === 0) return null;

  return (
    <section className="max-w-lg mx-auto mt-10">
      <h2 className="text-lg font-semibold text-charcoal mb-4">Your Saved</h2>
      <div className="flex flex-wrap gap-2">
        {calculations.map((calc) => (
          <div
            key={calc.id}
            className="inline-flex items-center gap-2 bg-sage-50 border border-sage-200 rounded-full pl-4 pr-2 py-1.5 text-sm"
          >
            <button
              onClick={() => onSelect(calc)}
              className="text-sage-900 font-medium hover:underline"
            >
              {calc.name} → {calc.toYear}
            </button>
            <button
              onClick={() => onDelete(calc.id)}
              className="p-1 rounded-full hover:bg-sage-200 transition"
              aria-label="Delete saved calculation"
            >
              <X className="w-3.5 h-3.5 text-sage-700" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}