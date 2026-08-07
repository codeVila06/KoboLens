"use client";

import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { getYearRange } from "@/lib/calculator";

interface CalculatorFormProps {
  initialAmount: number;
  initialFrom: number;
  initialTo: number;
  onCalculate: (amount: number, fromYear: number, toYear: number) => void;
}

export default function CalculatorForm({
  initialAmount,
  initialFrom,
  initialTo,
  onCalculate,
}: CalculatorFormProps) {
  const { min, max } = getYearRange();
  const years = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const [amount, setAmount] = useState(initialAmount.toString());
  const [fromYear, setFromYear] = useState(initialFrom);
  const [toYear, setToYear] = useState(initialTo);
  const [error, setError] = useState("");

  useEffect(() => {
    setAmount(initialAmount.toString());
    setFromYear(initialFrom);
    setToYear(initialTo);
  }, [initialAmount, initialFrom, initialTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }
    if (fromYear === toYear) {
      setError("Source and target years must be different.");
      return;
    }

    onCalculate(numAmount, fromYear, toYear);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-sage-200 shadow-sm p-6 md:p-8 max-w-lg mx-auto"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">
            Amount (₦)
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 18000"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-offwhite text-charcoal text-lg font-medium focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromYear" className="block text-sm font-medium text-gray-700 mb-1.5">
              Worth in
            </label>
            <select
              id="fromYear"
              value={fromYear}
              onChange={(e) => setFromYear(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-offwhite text-charcoal focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition appearance-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="toYear" className="block text-sm font-medium text-gray-700 mb-1.5">
              Value in
            </label>
            <select
              id="toYear"
              value={toYear}
              onChange={(e) => setToYear(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-offwhite text-charcoal focus:outline-none focus:ring-2 focus:ring-sage-300 focus:border-transparent transition appearance-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-sage-800 hover:bg-sage-900 text-white font-medium py-3.5 rounded-xl transition-colors duration-200"
        >
          <Calculator className="w-5 h-5" />
          Calculate
        </button>
      </div>
    </form>
  );
}