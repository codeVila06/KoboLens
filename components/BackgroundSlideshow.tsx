"use client";

import { useEffect, useState } from "react";

const IMAGES = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Aerial_view_of_a_busy_tomato_market_in_Lagos_Nigeria.jpg/1280px-Aerial_view_of_a_busy_tomato_market_in_Lagos_Nigeria.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Nigerian_Market_woman_at_work_waiting_for_customer.jpg/1280px-Nigerian_Market_woman_at_work_waiting_for_customer.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/City_of_Lagos%2C_Nigeria_2020.jpg/1280px-City_of_Lagos%2C_Nigeria_2020.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/View_of_Abuja_from_Katampe_hill_05.jpg/1280px-View_of_Abuja_from_Katampe_hill_05.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Nigerian_naira_note.jpg/1280px-Nigerian_naira_note.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Dawanau_Market.jpg/1280px-Dawanau_Market.jpg",
];

const INTERVAL_MS = 7000;

export default function BackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = setInterval(
      () => setIndex((i) => (i + 1) % IMAGES.length),
      INTERVAL_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100 kenburns" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt=""
            loading={i < 2 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/70 to-white/95" />
      <div className="absolute inset-0 bg-sage-50/30" />
    </div>
  );
}
