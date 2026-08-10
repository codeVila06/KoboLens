import { DataStatus } from "@/lib/liveData";

interface FooterProps {
  status?: DataStatus;
}

export default function Footer({ status }: FooterProps) {
  return (
    <footer className="mt-16 py-8 border-t border-gray-200 text-center text-sm text-gray-600">
      <p className="font-medium text-charcoal">KoboLens</p>
      <p className="mt-1">
        Data: {status?.source ?? "National Bureau of Statistics Nigeria"} · Updated{" "}
        {status?.updated ?? "2026-08-07"}
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
