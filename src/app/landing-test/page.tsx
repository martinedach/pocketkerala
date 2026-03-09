"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Sponsor = {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
};

type SectionId = "about" | "goals" | "sponsors" | "coffee" | null;

export default function LandingTestNeoBrutalism() {
  const [openSection, setOpenSection] = useState<SectionId>("about");
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      const { data } = await supabase
        .from("sponsors")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      
      if (data) setSponsors(data);
      setLoadingSponsors(false);
    };
    fetchSponsors();
  }, []);

  const handleToggle = (section: SectionId) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black font-sans pb-20 selection:bg-pink-400 selection:text-white">
      {/* HEADER SECTION */}
      <header className="fixed top-0 w-full z-50 bg-[#FFD700] border-b-4 border-black px-6 py-4 flex justify-between items-center shadow-[0_4px_0_0_#000]">
        <div className="flex items-center gap-4">
          <img 
            src="/images/logo.jpg" 
            alt="Pocket Kerala" 
            className="w-12 h-12 object-cover border-2 border-black rounded-full shadow-[2px_2px_0_0_#000]"
          />
          <div className="font-black text-2xl tracking-tighter uppercase hidden sm:block">
            Pocket Kerala
          </div>
        </div>
        <a 
          href="/malayalam" 
          className="bg-white px-4 py-2 border-2 border-black font-bold uppercase text-sm hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-1 transition-all"
        >
          മലയാളം വെബ്സൈറ്റിനായി ഇവിടെ ക്ലിക്ക് ചെയ്യുക
        </a>
      </header>

      {/* HERO SECTION WITH IMAGE */}
      <main className="pt-24 px-6 max-w-6xl mx-auto flex flex-col gap-12">
        <section className="relative w-full border-4 border-black bg-white shadow-[12px_12px_0_0_#000] overflow-hidden group">
          <div className="absolute inset-0 z-0 border-b-4 border-black bg-black">
            <img 
              src="/images/alleppy_gemini.png" 
              alt="Alleppy Backwaters" 
              className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
            />
          </div>
          <div className="relative z-10 py-24 px-6 text-center flex flex-col items-center justify-center min-h-[500px]">
            <img 
              src="/images/logo.jpg" 
              alt="PocketKerala logo" 
              className="w-48 h-48 rounded-full border-4 border-black shadow-[8px_8px_0_0_#FFD700] mb-8 bg-white"
            />
            <div className="inline-block bg-[#FF90E8] border-4 border-black p-2 mb-4 shadow-[4px_4px_0_0_#000] rotate-[-2deg]">
              <h2 className="text-xl sm:text-2xl font-bold uppercase">Discover Kerala</h2>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight text-white drop-shadow-[4px_4px_0_#000]">
              നമ്മുടെ കേരളം, <br /> <span className="text-[#FFD700] drop-shadow-[4px_4px_0_#000]">നിങ്ങളുടെ കീശയിൽ</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl font-medium max-w-2xl mx-auto border-4 border-black bg-white p-4 shadow-[8px_8px_0_0_#000] rotate-1 text-black">
              Get ready to explore the beauty and spirit of Kerala right in your pocket.
            </p>
          </div>
        </section>

        {/* NAVIGATION BUTTONS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[
            { id: "about", label: "About Us", color: "bg-[#23A094]" },
            { id: "goals", label: "Our Goals", color: "bg-[#90A8ED]" },
            { id: "sponsors", label: "Sponsors", color: "bg-[#FF90E8]" },
            { id: "coffee", label: "Get Coffee ☕", color: "bg-[#FFD700]" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleToggle(btn.id as SectionId)}
              className={`${btn.color} border-4 border-black p-4 font-black text-xl md:text-lg lg:text-xl uppercase transition-all
                ${
                  openSection === btn.id
                    ? "translate-y-1 shadow-[2px_2px_0_0_#000]"
                    : "shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000]"
                }
              `}
            >
              {btn.label}
            </button>
          ))}
        </section>

        {/* CONTENT PANELS */}
        <section className="relative mt-2">
          {/* ABOUT CONTENT */}
          {openSection === "about" && (
            <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0_0_#000] animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4 inline-block">Welcome to Pocket Kerala</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Founder */}
                <div className="bg-[#FFF4E0] border-4 border-black p-6 shadow-[4px_4px_0_0_#000]">
                  <img src="/images/me1.png" alt="Anthony" className="w-32 h-32 object-cover rounded-full border-4 border-black mb-4 bg-[#FF90E8] shadow-[4px_4px_0_0_#000]" />
                  <p className="text-xl font-bold mb-2">Hey there, <span className="bg-[#FFD700] px-1 border-2 border-black">Anthony</span> here!</p>
                  <div className="space-y-2 font-medium">
                    <p>I am half French and half Malayali, but I can assure you I am a full malayali by heart, soul and choice. I spent most of my life in India learning Malayalam, Tamil, Kannada and Hindi.</p>
                    <p>We are currently a super small team of 4, but that will not stop us from giving you lovely folks 1 content per week!</p>
                  </div>
                </div>

                {/* Editor */}
                <div className="bg-[#FFF4E0] border-4 border-black p-6 shadow-[4px_4px_0_0_#000]">
                  <img src="/images/editor.png" alt="Nithin" className="w-32 h-32 object-cover object-top rounded-full border-4 border-black mb-4 bg-[#90A8ED] shadow-[4px_4px_0_0_#000]" />
                  <p className="text-xl font-bold mb-2"><span className="bg-[#FF90E8] px-1 border-2 border-black">Chief Editor</span> Nithin Jacob</p>
                  <div className="space-y-2 font-medium">
                    <p>15 years of content moderation, video editing and social media management under my belt. My tools of choice are Adobe Premier, Photoshop, Lightroom and Final Cut Pro.</p>
                    <p>As a person from Kottayam, I am as Malayali as you can imagine.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GOALS CONTENT */}
          {openSection === "goals" && (
            <div className="bg-[#23A094] text-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0_0_#000] animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-6 inline-block bg-black text-white px-4 py-2 rotate-1 shadow-[4px_4px_0_0_#FFD700]">Our Goals</h3>
              <div className="bg-white text-black border-4 border-black p-6 font-bold text-lg md:text-xl leading-relaxed shadow-[4px_4px_0_0_#000]">
                <p className="mb-4">Our main goal is to capture Kerala in its pure essence, bring the community together, support local businesses, preserve cultural heritage through engaging content.</p>
                <p>We aim to better the quality of content we are starting with to progressively make it better for all audiences.</p>
              </div>
            </div>
          )}

          {/* SPONSORS CONTENT */}
          {openSection === "sponsors" && (
            <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0_0_#000] animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4 inline-block">Sponsors & Supporters</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                {loadingSponsors ? (
                  <div className="col-span-full font-bold text-center py-8 text-xl">Loading partners...</div>
                ) : sponsors.length > 0 ? (
                  sponsors.map((sponsor) => (
                    <a key={sponsor.id} href={sponsor.website_url || "#"} className="block bg-[#FFF4E0] border-4 border-black p-4 flex items-center justify-center hover:bg-[#FFD700] hover:-translate-y-2 hover:shadow-[4px_4px_0_0_#000] transition-all h-28 md:h-32">
                      <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full object-contain filter contrast-125" />
                    </a>
                  ))
                ) : (
                  <div className="col-span-full font-bold text-center py-8 text-xl border-4 border-dashed border-black">No sponsors loaded.</div>
                )}
              </div>

              <div className="bg-[#FFD700] border-4 border-black p-6 font-bold text-lg shadow-[4px_4px_0_0_#000]">
                <p>We are grateful for the support of our media partner, SmartPix Media.</p>
                <p className="mt-4 md:mt-2 text-xl inline-block">
                  Interested in sponsoring? <a href="/sponsorship" className="inline-block mt-2 md:mt-0 underline decoration-4 decoration-black bg-white px-2 py-1 mx-1 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white transition-colors">View Options</a>
                </p>
              </div>
            </div>
          )}

          {/* COFFEE CONTENT */}
          {openSection === "coffee" && (
            <div className="bg-[#FFD700] border-4 border-black p-8 shadow-[12px_12px_0_0_#000] animate-in slide-in-from-bottom-4 fade-in duration-300 text-center">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-6 inline-block bg-white border-4 border-black px-6 py-3 -rotate-2 shadow-[4px_4px_0_0_#000]">Support Our Work</h3>
              <p className="font-bold text-2xl mb-8 max-w-lg mx-auto bg-black text-[#FFD700] p-4 border-4 border-white shadow-[8px_8px_0_0_#FF90E8]">If you love what we do, you can support us by buying a coffee!</p>
              <a href="https://www.buymeacoffee.com/pocketkerala" target="_blank" rel="noreferrer" className="inline-block bg-[#FF90E8] border-4 border-black px-8 py-4 font-black text-2xl uppercase shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] transition-all">
                Buy Me a Coffee ☕
              </a>
            </div>
          )}
        </section>

        {/* MEDIA PARTNER & VIDEO SECTION */}
        <section className="grid md:grid-cols-2 gap-8 mt-12 mb-12">
          <div className="bg-black text-white border-4 border-black p-6 shadow-[12px_12px_0_0_#FF90E8]">
            <h3 className="text-3xl font-black uppercase mb-4 pl-2 border-l-8 border-[#FFD700]">Latest Video</h3>
            <p className="font-bold mb-4 text-xl">Thanks for helping us reach 200+ Subs!</p>
            <div className="aspect-video bg-[#FFF4E0] border-4 border-white shadow-[4px_4px_0_0_#3b82f6]">
              <iframe 
                src="https://www.youtube.com/embed/duEQT4Wk8XM?origin=https://pocketkerala.in" 
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] rotate-1">
              <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">Media Partner</h3>
              <a href="https://www.facebook.com/smartpixmediaofficial/" target="_blank" rel="noreferrer" className="inline-block bg-[#FFF4E0] border-4 border-black p-4 shadow-[4px_4px_0_0_#000] hover:bg-[#FFD700] hover:-translate-y-1 transition-all">
                <img src="/images/spm_icon.png" alt="Partner" className="h-16" />
              </a>
            </div>

            <div className="bg-[#3b82f6] border-4 border-black p-6 shadow-[8px_8px_0_0_#000] text-white -rotate-1">
              <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2 text-[#FFD700]">Follow Us</h3>
              <div className="flex flex-wrap gap-4">
                {['youtube', 'instagram', 'facebook'].map(social => (
                  <a key={social} href="#" className="bg-white border-4 border-black p-3 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all pb-2">
                    <img src={`/images/${social}_icon.png`} alt={social} className="w-8 h-8 object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
