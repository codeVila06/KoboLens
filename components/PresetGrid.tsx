"use client";

import { useState } from "react";
import { builtInPresets, Preset } from "@/lib/presets";
import { formatCurrency } from "@/lib/utils";

interface PresetGridProps {
  onSelect: (preset: Preset) => void;
}

function PresetIcon({ preset }: { preset: Preset }) {
  const [failed, setFailed] = useState(false);

  if (!preset.image || failed) {
    return (
      <span className="absolute inset-0 flex items-center justify-center text-3xl bg-sage-50">
        {preset.icon}
      </span>
    );
  }

  return (
    <img
      src={preset.image}
      alt={preset.label}
      width={250}
      height={250}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export default function PresetGrid({ onSelect }: PresetGridProps) {
  return (
    <section className="max-w-2xl mx-auto mt-12">
      <h2 className="text-lg font-semibold text-charcoal mb-4">Quick Examples</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {builtInPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden text-left hover:border-sage-300 hover:shadow-lg hover:-translate-y-0.5 transition group"
          >
            <span className="block relative h-36 sm:h-40 bg-sage-50 overflow-hidden">
              <PresetIcon preset={preset} />
            </span>
            <span className="block p-4">
              <span className="block text-sm font-medium text-charcoal group-hover:text-sage-800 transition leading-snug">
                {preset.label}
              </span>
              <span className="block text-sm text-gray-500 mt-1">
                {formatCurrency(preset.amount)} · {preset.year}
              </span>
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Preset prices are estimates for illustration. Inflation calculations use official NBS CPI data.
      </p>
    </section>
  );
}