"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DataStatus } from "@/lib/liveData";

const bundledStatus: DataStatus = {
  live: false,
  source: "NBS Nigeria (bundled snapshot)",
  updated: "2026-08-07",
  projectedYears: [],
};

interface MethodologyProps {
  status?: DataStatus;
}

export default function Methodology({ status = bundledStatus }: MethodologyProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="max-w-lg mx-auto mt-12">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left py-3 border-t border-gray-200"
      >
        <span className="text-sm font-medium text-gray-700">How it works</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="pb-4 text-sm text-gray-600 space-y-3">
          <p>
            <strong>Formula:</strong> adjusted_price = amount × (CPI<sub>target</sub> / CPI<sub>source</sub>)
          </p>
          <p>
            We use annual Consumer Price Index (CPI) data from the{" "}
            <strong>National Bureau of Statistics of Nigeria</strong>. The CPI measures the
            average change in prices over time that consumers pay for a basket of goods and services.
          </p>
          <p>
            <strong>Data range:</strong> 2009 – 2026. The NBS rebased CPI in 2024 (new base year = 2024).
            We bridged the new series back to the original 2009 base for continuity.
          </p>
          {status.projectedYears.length > 0 && (
            <p className="text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
              <strong>Projection:</strong> {status.projectedYears.join(", ")} is a current-year
              estimate based on the rebased NBS series. It is replaced with official figures once
              the full year is published.
            </p>
          )}
          <p>
            <strong>Limitations:</strong> CPI reflects average price changes across all goods and services,
            not specific items. Your personal inflation experience may differ based on what you buy.
          </p>
          <p className="text-xs text-gray-400">
            {status.live ? "Live data" : "Static data"} · {status.source} · Updated{" "}
            {status.updated}
          </p>
        </div>
      )}
    </section>
  );
}