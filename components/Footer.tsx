import { RefreshCw } from "lucide-react";
import { DataStatus } from "@/lib/liveData";

interface FooterProps {
  status?: DataStatus;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function Footer({ status, onRefresh, refreshing }: FooterProps) {
  return (
    <footer className="mt-16 py-8 border-t border-gray-200 text-center text-sm text-gray-600">
      <p className="font-medium text-charcoal">KoboLens</p>
      <p className="mt-1 flex items-center justify-center gap-2">
        <span>
          Data: {status?.source ?? "National Bureau of Statistics Nigeria"} · Updated{" "}
          {status?.updated ?? "2026-08-07"}
        </span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-sage-300 transition disabled:opacity-60 disabled:cursor-default"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Updating…" : "Check for updates"}
          </button>
        )}
      </p>
      <p className="mt-1">
        <a
          href="https://github.com/codeVila06/KoboLens"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-sage-800 transition"
        >
          Open source on GitHub
        </a>
      </p>
    </footer>
  );
}
