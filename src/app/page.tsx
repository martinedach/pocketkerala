/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { CountdownSection } from "./components/CountdownSection";
import { supabase } from "@/lib/supabaseClient";

type Sponsor = {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  display_order: number;
};

type SectionId = "about" | "goals" | "sponsors" | "coffee" | null;
type Language = "en" | "ml";

export default function Home() {
  const [openSection, setOpenSection] = useState<SectionId>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState(true);
  const [lang, setLang] = useState<Language>("en");

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

  const navButtons = [
    { id: "about", en: "About Us", ml: "ഞങ്ങളെക്കുറിച്ച്", color: "bg-[#23A094]" },
    { id: "goals", en: "Our Goals", ml: "ലക്ഷ്യങ്ങൾ", color: "bg-[#90A8ED]" },
    { id: "sponsors", en: "Sponsors", ml: "സ്പോൺസർമാർ", color: "bg-[#FF90E8]" },
    { id: "coffee", en: "Get Coffee ☕", ml: "ഒരു കാപ്പി വാങ്ങൂ ☕", color: "bg-[#FFD700]" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black font-sans pb-20 selection:bg-pink-400 selection:text-white">
      {/* HEADER SECTION */}
      <header className="fixed top-0 w-full z-50 bg-[#FFD700] border-b-4 border-black px-4 py-3 sm:px-6 sm:py-4 flex flex-row gap-4 justify-between items-center shadow-[0_4px_0_0_#000]">
        <div className="flex items-center gap-4">
          <img
            src="/images/logo.jpg"
            alt="Pocket Kerala"
            className="w-10 h-10 sm:w-12 sm:h-12 object-cover border-2 border-black rounded-full shadow-[2px_2px_0_0_#000]"
          />
          <div className="font-black text-2xl tracking-tighter uppercase hidden sm:block">
            Pocket Kerala
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLang("en")}
            className={`${lang === 'en' ? 'bg-black text-white' : 'bg-white text-black hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]'} px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-black font-bold uppercase text-xs sm:text-sm transition-all`}
          >
            English
          </button>
          <button
            onClick={() => setLang("ml")}
            className={`${lang === 'ml' ? 'bg-black text-white' : 'bg-[#FF90E8] text-black hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]'} px-3 py-1.5 sm:px-4 sm:py-2 border-2 border-black font-bold uppercase text-xs sm:text-sm transition-all`}
          >
            മലയാളം
          </button>
        </div>
      </header>

      {/* HERO SECTION WITH IMAGE */}
      <main className="pt-24 sm:pt-28 px-6 max-w-6xl mx-auto flex flex-col gap-12">
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
              {lang === 'en'
                ? "Get ready to explore the beauty and spirit of Kerala right in your pocket."
                : "കേരളത്തിന്റെ ഭംഗിയും ആത്മാവും നിങ്ങളുടെ പോക്കറ്റിലൂടെ അറിയാൻ തയ്യാറായിക്കോളൂ."}
            </p>
          </div>
        </section>

        {/* NAVIGATION BUTTONS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {navButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleToggle(btn.id as SectionId)}
              className={`${btn.color} border-4 border-black p-4 font-black text-xl md:text-lg lg:text-xl uppercase transition-all
                ${openSection === btn.id
                  ? "translate-y-1 shadow-[2px_2px_0_0_#000]"
                  : "shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000]"
                }
              `}
            >
              {lang === 'en' ? btn.en : btn.ml}
            </button>
          ))}
        </section>

        {/* CONTENT PANELS */}
        <section className="relative mt-2">
          {/* ABOUT CONTENT */}
          {openSection === "about" && (
            <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0_0_#000] animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4 inline-block">
                {lang === 'en' ? "Welcome to Pocket Kerala" : "പോക്കറ്റ് കേരളത്തിലേക്ക് സ്വാഗതം"}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Founder */}
                <div className="bg-[#FFF4E0] border-4 border-black p-6 shadow-[4px_4px_0_0_#000]">
                  <img src="/images/me1.png" alt="Anthony" className="w-32 h-32 object-cover object-top rounded-full border-4 border-black mb-4 bg-[#FF90E8] shadow-[4px_4px_0_0_#000]" />
                  <p className="text-xl font-bold mb-2">
                    {lang === 'en'
                      ? <>Hey there, <span className="bg-[#FFD700] px-1 border-2 border-black">Anthony</span> here!</>
                      : <>നമസ്കാരം, <span className="bg-[#FFD700] px-1 border-2 border-black">ആന്റണി</span> ആണ്, ഫ്രിസൺ എന്നും വിളിക്കും ;)</>}
                  </p>
                  <div className="space-y-2 font-medium">
                    {lang === 'en' ? (
                      <>
                        <p>I am half French and half Malayali, but I can assure you I am a full malayali by heart, soul and choice. I spent most of my life in India learning Malayalam, Tamil, Kannada and Hindi.</p>
                        <p>We are currently a super small team of 4, but that will not stop us from giving you lovely folks 1 content per week!</p>
                      </>
                    ) : (
                      <>
                        <p>ഞാൻ പകുതി ഫ്രഞ്ചുകാരനും പകുതി മലയാളിയുമാണ്, പക്ഷെ മനസ്സുകൊണ്ടും ആത്മാവ് കൊണ്ടും ഞാൻ പൂർണ്ണമായും ഒരു മലയാളിയാണ്. എന്റെ ജീവിതത്തിന്റെ ഭൂരിഭാഗവും ഞാൻ ഇന്ത്യയിലാണ് ചെലവഴിച്ചത്; മലയാളം, തമിഴ്, കന്നഡ, ഹിന്ദി എന്നിങ്ങനെ 4 ഇന്ത്യൻ ഭാഷകൾ പഠിക്കാൻ ഇത് എന്നെ സഹായിച്ചു - പോക്കറ്റ് കേരളയുടെ യാത്രയിൽ ഉടനീളം നിങ്ങൾക്ക് അത് കാണാം.</p>
                        <p>ഞങ്ങൾ നിലവിൽ 4 പേരടങ്ങുന്ന ഒരു ചെറിയ ടീമാണ്, എങ്കിലും 2026 ജനുവരി 2 മുതൽ ആഴ്ചയിൽ ഒരു കണ്ടന്റ് വെച്ച് നിങ്ങൾക്കായി നൽകാൻ ഞങ്ങൾ പരിശ്രമിക്കുന്നു. 2021-ൽ എന്റെ മനസ്സിലുദിച്ച ആശയമാണ് പോക്കറ്റ് കേരളം. ഞങ്ങളെ പിന്തുണയ്ക്കുന്നവർക്കും ഈ വെബ്സൈറ്റ് സന്ദർശിക്കുന്നവർക്കും നന്ദി അറിയിക്കാൻ വാക്കുകളില്ല.</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Editor */}
                <div className="bg-[#FFF4E0] border-4 border-black p-6 shadow-[4px_4px_0_0_#000]">
                  <img src="/images/editor.png" alt="Nithin" className="w-32 h-32 object-cover object-top rounded-full border-4 border-black mb-4 bg-[#90A8ED] shadow-[4px_4px_0_0_#000]" />
                  <p className="text-xl font-bold mb-2">
                    {lang === 'en'
                      ? <><span className="bg-[#FF90E8] px-1 border-2 border-black">Chief Editor</span> Nithin Jacob</>
                      : <>നമസ്കാരം, <span className="bg-[#FF90E8] px-1 border-2 border-black">ചീഫ് എഡിറ്റർ</span> നിതിൻ ജേക്കബ് ആണ്!</>}
                  </p>
                  <div className="space-y-2 font-medium">
                    {lang === 'en' ? (
                      <>
                        <p>15 years of content moderation, video editing and social media management under my belt. My tools of choice are Adobe Premier, Photoshop, Lightroom and Final Cut Pro.</p>
                        <p>As a person from Kottayam, I am as Malayali as you can imagine.</p>
                      </>
                    ) : (
                      <>
                        <p>കണ്ടന്റ് മോഡറേഷൻ, വീഡിയോ എഡിറ്റിംഗ്, സോഷ്യൽ മീഡിയ മാനേജ്‌മെന്റ് എന്നിവയിൽ എനിക്ക് 15 വർഷത്തെ പരിചയമുണ്ട്. Adobe Premier, Photoshop, Lightroom, Final Cut Pro എന്നിവയാണ് പ്രധാന ടൂളുകൾ.</p>
                        <p>കേരള വിഷൻ ഉൾപ്പെടെയുള്ള പ്രമുഖ മാധ്യമങ്ങളിൽ പ്രവർത്തിച്ചിട്ടുള്ള എന്റെ അനുഭവസമ്പത്ത് നിങ്ങൾക്ക് ഉറപ്പായും ബോധ്യപ്പെടും. കോട്ടയംകാരനായ ഞാൻ, നിങ്ങൾ ചിന്തിക്കുന്നതിലും വലിയ ഒരു മലയാളിയാണ്.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GOALS CONTENT */}
          {openSection === "goals" && (
            <div className="bg-[#23A094] text-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0_0_#000] animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-6 inline-block bg-black text-white px-4 py-2 rotate-1 shadow-[4px_4px_0_0_#FFD700]">
                {lang === 'en' ? "Our Goals" : "ഞങ്ങളുടെ ലക്ഷ്യങ്ങൾ"}
              </h3>
              <div className="bg-white text-black border-4 border-black p-6 font-bold text-lg md:text-xl leading-relaxed shadow-[4px_4px_0_0_#000]">
                {lang === 'en' ? (
                  <>
                    <p className="mb-4">Our main goal is to capture Kerala in its pure essence, bring the community together, support local businesses, preserve cultural heritage through engaging content.</p>
                    <p>We aim to better the quality of content we are starting with to progressively make it better for all audiences.</p>
                  </>
                ) : (
                  <>
                    <p className="mb-4">കേരളത്തെ അതിന്റെ തനിമയിൽ ഒപ്പിയെടുക്കുക, സമൂഹത്തെ ഒന്നിപ്പിക്കുക, പ്രാദേശിക ബിസിനസുകളെ പിന്തുണയ്ക്കുക, സാംസ്കാരിക പൈതൃകം സംരക്ഷിക്കുക എന്നിവയാണ് ഞങ്ങളുടെ പ്രധാന ലക്ഷ്യങ്ങൾ.</p>
                    <p>ഞങ്ങൾ ഈ രംഗത്ത് പുതിയതാണ്; പക്ഷെ ഏതൊരു യാത്രയും തുടങ്ങുന്നത് പോലെ, ഞങ്ങളുടെ തുടക്കവും ലളിതമാണ്. പോകെപ്പോകെ മികച്ച നിലവാരമുള്ള കണ്ടന്റ് നിങ്ങൾക്ക് നൽകാൻ ഞങ്ങൾ ശ്രമിക്കും.</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* SPONSORS CONTENT */}
          {openSection === "sponsors" && (
            <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[12px_12px_0_0_#000] animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4 inline-block">
                {lang === 'en' ? "Sponsors & Supporters" : "സ്പോൺസർമാരും പിന്തുണക്കുന്നവരും"}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                {loadingSponsors ? (
                  <div className="col-span-full font-bold text-center py-8 text-xl">Loading partners...</div>
                ) : sponsors.length > 0 ? (
                  sponsors.map((sponsor) => (
                    <a key={sponsor.id} href={sponsor.website_url || "#"} className="block bg-[#FFF4E0] border-4 border-black p-4 flex items-center justify-center hover:bg-[#FFD700] hover:-translate-y-2 hover:shadow-[4px_4px_0_0_#000] transition-all h-28 md:h-32 overflow-hidden">
                      <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full object-contain filter contrast-125" />
                    </a>
                  ))
                ) : (
                  <div className="col-span-full font-bold text-center py-8 text-xl border-4 border-dashed border-black">No sponsors loaded.</div>
                )}
              </div>

              <div className="bg-[#FFD700] border-4 border-black p-6 font-bold text-lg shadow-[4px_4px_0_0_#000]">
                {lang === 'en' ? (
                  <>
                    <p>We are grateful for the support of our media partner, SmartPix Media.</p>
                    <p className="mt-4 md:mt-2 text-xl inline-block">
                      Interested in sponsoring? <a href="/sponsorship" className="inline-block mt-2 md:mt-0 underline decoration-4 decoration-black bg-white px-2 py-1 mx-1 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white transition-colors">View Options</a>
                    </p>
                  </>
                ) : (
                  <>
                    <p>ഞങ്ങളുടെ മീഡിയ പാർട്ണറായ സ്മാർട്ട്‌പിക്‌സ് മീഡിയയ്ക്കും ഞങ്ങളെ പിന്തുണയ്ക്കുന്നവർക്കും നന്ദി.</p>
                    <p className="mt-4 md:mt-2 text-xl inline-block">
                      സ്പോൺസർഷിപ്പ് താൽപര്യമുണ്ടോ? <a href="/sponsorship" className="inline-block mt-2 md:mt-0 underline decoration-4 decoration-black bg-white px-2 py-1 mx-1 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white transition-colors">വിശദാംശങ്ങൾ ഇവിടെ കാണുക</a>
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* COFFEE CONTENT */}
          {openSection === "coffee" && (
            <div className="bg-[#FFD700] border-4 border-black p-8 shadow-[12px_12px_0_0_#000] animate-in slide-in-from-bottom-4 fade-in duration-300 text-center">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-6 inline-block bg-white border-4 border-black px-6 py-3 -rotate-2 shadow-[4px_4px_0_0_#000]">
                {lang === 'en' ? "Support Our Work" : "ഞങ്ങളെ പിന്തുണക്കൂ"}
              </h3>
              <p className="font-bold text-2xl mb-8 max-w-lg mx-auto bg-black text-[#FFD700] p-4 border-4 border-white shadow-[8px_8px_0_0_#FF90E8]">
                {lang === 'en'
                  ? "If you love what we do, you can support us by buying a coffee!"
                  : "ഞങ്ങളുടെ പ്രവർത്തനം നിങ്ങൾക്ക് ഇഷ്ടപ്പെട്ടെങ്കിൽ, ഒരു കാപ്പി വാങ്ങി നൽകി ഞങ്ങളെ സഹായിക്കാം!"}
              </p>
              <a href="https://www.buymeacoffee.com/pocketkerala" target="_blank" rel="noreferrer" className="inline-block bg-[#FF90E8] border-4 border-black px-8 py-4 font-black text-2xl uppercase shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] transition-all">
                Buy Me a Coffee ☕
              </a>
            </div>
          )}
        </section>

        {/* MILSTONE & COUNTDOWN SECTION */}
        <section className="bg-[#90A8ED] border-4 border-black p-8 shadow-[12px_12px_0_0_#000] mt-12 rotate-[-1deg]">
          <h3 className="text-3xl font-black uppercase mb-4 border-b-4 border-black pb-2 inline-block bg-white px-4 py-2 border-4 border-black shadow-[4px_4px_0_0_#FFD700]">Latest Updates</h3>
          <CountdownSection
            milestoneTitle={lang === 'en' ? "Thanks for helping us reach 200+ Subs!" : "200+ സബ്സ്ക്രൈബേഴ്സ് തികയ്ക്കാൻ സഹായിച്ചതിന് നന്ദി!"}
            postLaunchMessage={lang === 'en' ? "WATCH OUR LATEST VIDEO BELOW!" : "ഞങ്ങളുടെ പുതിയ വീഡിയോ താഴെ കാണാം!"}
            description={lang === 'en' ? "Get ready to explore the beauty and spirit of Kerala right in your pocket." : "കേരളത്തിന്റെ ഭംഗിയും ആത്മാവും നിങ്ങളുടെ പോക്കറ്റിലൂടെ അറിയാൻ തയ്യാറായിക്കോളൂ."}
            videoSrc="https://www.youtube.com/embed/duEQT4Wk8XM?origin=https://pocketkerala.in"
          />
        </section>


        {/* MEDIA PARTNER & VIDEO SECTION */}
        <section className="grid sm:grid-cols-2 gap-8 mt-12 mb-12">

          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] rotate-1 h-full flex flex-col justify-center items-center text-center">
            <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">Media Partner</h3>
            <a href="https://www.facebook.com/smartpixmediaofficial/" target="_blank" rel="noreferrer" className="inline-block bg-[#FFF4E0] border-4 border-black p-4 shadow-[4px_4px_0_0_#000] hover:bg-[#FFD700] hover:-translate-y-1 transition-all">
              <img src="/images/spm_icon.png" alt="Partner" className="h-16" />
            </a>
          </div>

          <div className="bg-[#3b82f6] border-4 border-black p-6 shadow-[8px_8px_0_0_#000] text-white -rotate-1 h-full flex flex-col justify-center items-center text-center">
            <h3 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2 text-[#FFD700]">Follow Us</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['youtube', 'instagram', 'facebook'].map(social => (
                <a key={social} href="#" className="bg-white border-4 border-black p-3 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all pb-2">
                  <img src={`/images/${social}_icon.png`} alt={social} className="w-8 h-8 object-contain" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER SECTION */}
        <footer className="mt-8 mb-4 border-t-4 border-black pt-8 flex flex-col items-center text-center gap-4">
          <div className="bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0_0_#000] max-w-2xl w-full">
            <h4 className="text-2xl font-black uppercase mb-4">{lang === 'en' ? "Contact Us" : "ബന്ധപ്പെടുക"}</h4>
            <div className="flex flex-col gap-2 font-bold text-lg">
              <p>EMAIL: <a href="mailto:info@pocketkerala.in" className="underline decoration-2 hover:bg-black hover:text-[#FFD700] px-1 transition-colors">info@pocketkerala.in</a></p>
              <p>PHONE: <a href="tel:+919895802679" className="underline decoration-2 hover:bg-black hover:text-[#FFD700] px-1 transition-colors">+91-9895802679</a></p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 font-bold bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
            <p>
              Powered by{" "}
              <a href="https://www.instagram.com/anthonyfrison7/" target="_blank" rel="noreferrer" className="underline decoration-2 hover:bg-[#FF90E8] px-1">Frison</a>
              {" "}&{" "}
              <a href="https://infinitech.today" target="_blank" rel="noreferrer" className="underline decoration-2 hover:bg-[#90A8ED] px-1">infinitech</a>
            </p>
            <p className="text-sm border-t-2 border-black pt-2 mt-2">Copyright © 2026. All Rights Reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
