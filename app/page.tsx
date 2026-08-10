"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Hero from "@/components/Hero";
import CalculatorForm from "@/components/CalculatorForm";
import ResultCard from "@/components/ResultCard";
import ChartSection, { ChartType } from "@/components/ChartSection";
import PresetGrid from "@/components/PresetGrid";
import SavedCalculations from "@/components/SavedCalculations";
import Methodology from "@/components/Methodology";
import Footer from "@/components/Footer";
import { calculateAdjustedPrice, CalculationResult, getYearRange } from "@/lib/calculator";
import { refreshLiveData, getDataStatus, DataStatus } from "@/lib/liveData";
import { builtInPresets, Preset } from "@/lib/presets";
import {
  getSavedCalculations,
  deleteCalculation,
  SavedCalculation,
} from "@/lib/storage";

export default function Home() {
  const { min, max } = getYearRange();

  const [amount, setAmount] = useState(18000);
  const [fromYear, setFromYear] = useState(2011);
  const [toYear, setToYear] = useState(max);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [savedCalcs, setSavedCalcs] = useState<SavedCalculation[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [dataStatus, setDataStatus] = useState<DataStatus>(() => getDataStatus());
  const lastCalcRef = useRef<{ amount: number; fromYear: number; toYear: number } | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  // Refresh CPI data from live sources on mount
  useEffect(() => {
    let cancelled = false;
    refreshLiveData().then(() => {
      if (cancelled) return;
      setDataStatus(getDataStatus());
      const p = lastCalcRef.current;
      if (p) {
        try {
          setResult(calculateAdjustedPrice(p.amount, p.fromYear, p.toYear));
        } catch {
          // keep existing result
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load saved calculations on mount
  useEffect(() => {
    setSavedCalcs(getSavedCalculations());
  }, []);

  // Parse URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlAmount = params.get("amount");
    const urlFrom = params.get("from");
    const urlTo = params.get("to");

    if (urlAmount && urlFrom && urlTo) {
      const a = parseFloat(urlAmount);
      const f = parseInt(urlFrom, 10);
      const t = parseInt(urlTo, 10);

      if (!isNaN(a) && a > 0 && !isNaN(f) && !isNaN(t) && f >= min && f <= max && t >= min && t <= max) {
        setAmount(a);
        setFromYear(f);
        setToYear(t);
        try {
          const calc = calculateAdjustedPrice(a, f, t);
          setResult(calc);
        setHasCalculated(true);
        lastCalcRef.current = { amount: a, fromYear: f, toYear: t };
        } catch {
          // invalid params, ignore
        }
      }
    }
  }, [min, max]);

  const handleCalculate = useCallback(
    (a: number, f: number, t: number) => {
      try {
        const calc = calculateAdjustedPrice(a, f, t);
        setResult(calc);
        setAmount(a);
        setFromYear(f);
        setToYear(t);
        setHasCalculated(true);

        // Update URL
        const url = new URL(window.location.href);
        url.searchParams.set("amount", a.toString());
        url.searchParams.set("from", f.toString());
        url.searchParams.set("to", t.toString());
        window.history.replaceState({}, "", url.toString());
      } catch {
        // error handled in form
      }
    },
    []
  );

  const handlePresetSelect = useCallback(
    (preset: Preset) => {
      handleCalculate(preset.amount, preset.year, max);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [handleCalculate, max]
  );

  const handleSave = useCallback(() => {
    setSavedCalcs(getSavedCalculations());
  }, []);

  const handleSavedSelect = useCallback(
    (calc: SavedCalculation) => {
      handleCalculate(calc.amount, calc.fromYear, calc.toYear);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [handleCalculate]
  );

  const handleSavedDelete = useCallback((id: string) => {
    deleteCalculation(id);
    setSavedCalcs(getSavedCalculations());
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
      <div className="pt-6 pb-2">
        <a
          href="/"
          aria-label="KoboLens home"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.location.reload();
            }
          }}
          className="inline-block text-xl font-bold text-sage-800 tracking-tight hover:text-sage-900 transition"
        >
          KoboLens
        </a>
      </div>

      <Hero />

      <CalculatorForm
        initialAmount={amount}
        initialFrom={fromYear}
        initialTo={toYear}
        onCalculate={handleCalculate}
      />

      {result && hasCalculated && (
        <div ref={captureRef}>
          <ResultCard
            result={result}
            onSave={handleSave}
            projectedYears={dataStatus.projectedYears}
            captureRef={captureRef}
          />
          <ChartSection
            amount={result.amount}
            fromYear={result.fromYear}
            toYear={result.toYear}
            type={chartType}
            onTypeChange={setChartType}
          />
        </div>
      )}

      <PresetGrid onSelect={handlePresetSelect} />

      <SavedCalculations
        calculations={savedCalcs}
        onSelect={handleSavedSelect}
        onDelete={handleSavedDelete}
      />

      <Methodology status={dataStatus} />

      <Footer status={dataStatus} />
    </main>
  );
}