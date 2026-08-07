"use client";

import { useState, useEffect, useRef } from "react";
import { Bookmark, Share2, Check, TrendingDown, Download } from "lucide-react";
import { CalculationResult } from "@/lib/calculator";
import { formatCurrency, downloadElementAsPng } from "@/lib/utils";
import { saveCalculation } from "@/lib/storage";

interface ResultCardProps {
  result: CalculationResult;
  onSave?: () => void;
  projectedYears?: number[];
  captureRef?: React.RefObject<HTMLDivElement>;
}

function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    let raf: number;

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(current);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span>{formatCurrency(display)}</span>;
}

export default function ResultCard({
  result,
  onSave,
  projectedYears = [],
  captureRef,
}: ResultCardProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const isProjected = projectedYears.includes(result.toYear);

  const handleSave = () => {
    saveCalculation({
      name: `${formatCurrency(result.amount)} in ${result.fromYear}`,
      amount: result.amount,
      fromYear: result.fromYear,
      toYear: result.toYear,
    });
    setSaved(true);
    onSave?.();
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownload = async () => {
    if (!captureRef?.current) return;
    try {
      await downloadElementAsPng(
        captureRef.current,
        `kobolens-${result.fromYear}-to-${result.toYear}.png`
      );
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch {
      // capture failed
    }
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("amount", result.amount.toString());
    url.searchParams.set("from", result.fromYear.toString());
    url.searchParams.set("to", result.toYear.toString());

    try {
      if (navigator.share) {
        await navigator.share({
          title: "KoboLens — Nigerian Inflation Calculator",
          text: `${formatCurrency(result.amount)} in ${result.fromYear} = ${formatCurrency(result.result)} in ${result.toYear}`,
          url: url.toString(),
        });
      } else {
        await navigator.clipboard.writeText(url.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled share
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sage-200 shadow-sm p-6 md:p-8 max-w-lg mx-auto mt-6 text-center">
      <p className="text-sm text-gray-500 mb-1">
        {formatCurrency(result.amount)} in {result.fromYear}
      </p>
      <p className="text-3xl md:text-4xl font-bold text-charcoal">
        = <AnimatedNumber value={result.result} />
      </p>
      <p className="text-sm text-gray-500 mt-1">in {result.toYear}</p>

      <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium">
        <TrendingDown className="w-4 h-4" />
        Your money lost {result.purchasingPowerLost}% of its purchasing power
      </div>

      {isProjected && (
        <p className="mt-3 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
          {result.toYear} is a current-year estimate. Final value may change when official NBS
          figures are published.
        </p>
      )}

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {saved ? <Check className="w-4 h-4 text-sage-600" /> : <Bookmark className="w-4 h-4" />}
          {saved ? "Saved" : "Save"}
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {copied ? <Check className="w-4 h-4 text-sage-600" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Copied" : "Share Link"}
        </button>

        <button
          onClick={handleDownload}
          data-nodownload
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {downloaded ? <Check className="w-4 h-4 text-sage-600" /> : <Download className="w-4 h-4" />}
          {downloaded ? "Saved" : "Save as Image"}
        </button>
      </div>
    </div>
  );
}