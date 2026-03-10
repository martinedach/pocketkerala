/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, type ReactNode } from "react";

type BioLink = {
  label: string;
  url: string;
  color: string;
  icon: ReactNode;
  external?: boolean;
};

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const bioLinks: BioLink[] = [
  {
    icon: <YoutubeIcon />,
    label: "YouTube",
    url: "https://www.youtube.com/@pocketkerala",
    color: "bg-[#E53935] text-white",
    external: true,
  },
  {
    icon: <InstagramIcon />,
    label: "Instagram",
    url: "https://www.instagram.com/pocketkerala",
    color: "bg-[#4A90D9] text-white",
    external: true,
  },
  {
    icon: <TikTokIcon />,
    label: "TikTok",
    url: "https://www.tiktok.com/@pocketkerala",
    color: "bg-black text-white",
    external: true,
  },
  {
    icon: <GlobeIcon />,
    label: "Website",
    url: "/",
    color: "bg-[#FF90E8]",
  },
];

export default function BioPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black font-sans selection:bg-pink-400 selection:text-white flex flex-col items-center">
      {/* BACKGROUND PATTERN — subtle diagonal stripes */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 16px)",
        }}
      />

      {/* MAIN CONTENT */}
      <main className="relative z-10 w-full max-w-md mx-auto px-6 py-12 flex flex-col items-center gap-8">
        {/* PROFILE SECTION */}
        <section className="flex flex-col items-center gap-6 w-full">
          {/* Logo */}
          <div className="relative">
            <div className="absolute -inset-2 bg-[#FFD700] border-4 border-black rotate-3 shadow-[6px_6px_0_0_#000]" />
            <img
              src="/images/logo.jpg"
              alt="Pocket Kerala"
              className="relative w-32 h-32 sm:w-36 sm:h-36 object-cover border-4 border-black rounded-full shadow-[4px_4px_0_0_#FF90E8] bg-white z-10"
            />
          </div>

          {/* Brand Name */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none">
              Pocket
              <br />
              <span className="text-[#FF6D00] drop-shadow-[3px_3px_0_#000]">
                Kerala
              </span>
            </h1>
            <div className="mt-3 inline-block bg-[#FFD700] border-3 border-black px-4 py-1 shadow-[3px_3px_0_0_#000] -rotate-2">
              <p className="font-bold text-sm sm:text-base uppercase tracking-wide">
                Our Kerala, in Your Pocket 🌴
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-center font-medium text-base sm:text-lg max-w-xs bg-white border-4 border-black p-4 shadow-[6px_6px_0_0_#000] rotate-1">
            Culture, stories &amp; everything Kerala.
            <br />
            <span className="font-bold">
              Follow along and explore with us!
            </span>
          </p>
        </section>

        {/* LINKS SECTION */}
        <section className="w-full flex flex-col gap-4">
          {bioLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.url}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`${link.color} border-4 border-black p-4 sm:p-5 font-black text-lg sm:text-xl uppercase text-center transition-all duration-150 flex items-center justify-center gap-3
                ${
                  hoveredIndex === i
                    ? "translate-y-1 shadow-[2px_2px_0_0_#000] scale-[1.02]"
                    : "shadow-[6px_6px_0_0_#000]"
                }
              `}
              style={{
                transform:
                  hoveredIndex === i
                    ? "translateY(4px) scale(1.02)"
                    : i % 2 === 0
                      ? "rotate(-0.5deg)"
                      : "rotate(0.5deg)",
              }}
            >
              <span className="flex-shrink-0">{link.icon}</span>
              <span>{link.label}</span>
              {link.external && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-60 ml-1 flex-shrink-0">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              )}
            </a>
          ))}
        </section>




        {/* FOOTER */}
        <footer className="w-full mt-8 flex flex-col items-center gap-4">
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000] text-center w-full">
            <p className="font-bold text-sm">
              Powered by{" "}
              <a
                href="https://www.instagram.com/anthonyfrison7/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-2 hover:bg-[#FF90E8] px-1"
              >
                Frison
              </a>{" "}
              &amp;{" "}
              <a
                href="https://infinitech.today"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-2 hover:bg-[#90A8ED] px-1"
              >
                infinitech
              </a>
            </p>
            <p className="text-xs border-t-2 border-black pt-2 mt-2 font-bold opacity-60">
              Copyright © 2026. All Rights Reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
