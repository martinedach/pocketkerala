/* eslint-disable @next/next/no-img-element */
export default function SponsorshipPage() {
  const packages = [
    {
      name: "Episode sponsor",
      desc: "Brand mention + logo placement on the website sponsors section for the episode window.",
      color: "bg-[#FFD700]"
    },
    {
      name: "Season sponsor",
      desc: "Always-on placement for a set of episodes, plus a dedicated sponsor callout.",
      color: "bg-[#90A8ED]"
    },
    {
      name: "Local business feature",
      desc: "Showcase a local business with transparent labeling as sponsored content.",
      color: "bg-[#FF90E8]"
    },
    {
      name: "In-kind support",
      desc: "Logistics, accommodation, experiences, or gear support.",
      color: "bg-white"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF4E0] text-black font-sans pb-20 selection:bg-pink-400 selection:text-white">
      {/* HEADER SECTION */}
      <header className="fixed top-0 w-full z-50 bg-[#FFD700] border-b-4 border-black px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center shadow-[0_4px_0_0_#000]">
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
      </header>

      <main className="pt-24 sm:pt-28 px-6 max-w-6xl mx-auto flex flex-col gap-12">
        <section className="text-center md:text-left flex flex-col md:flex-row gap-8 items-center justify-between border-4 border-black bg-[#FFD700] p-8 shadow-[12px_12px_0_0_#000]">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-none drop-shadow-[2px_2px_0_#FF90E8] bg-white inline-block px-4 py-2 border-4 border-black -rotate-1 mb-6">
              Sponsorship
            </h1>
            <p className="mt-4 text-xl md:text-2xl font-bold bg-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000] rotate-1">
              Pocket Kerala is a community-first storytelling project focused on culture, food, travel, and local businesses across Kerala. Sponsorships help us keep producing consistent, high quality episodes and invest back into the places and people we feature.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col gap-4 shrink-0">
            <a
              href="mailto:info@pocketkerala.in"
              className="inline-block bg-[#FF90E8] text-black border-4 border-black px-8 py-4 font-black text-2xl uppercase shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#000] transition-all text-center"
            >
              Partner With Us
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-black uppercase mb-8 inline-block bg-white px-6 py-3 border-4 border-black shadow-[4px_4px_0_0_#000] rotate-1">Sponsorship Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className={`border-4 border-black p-8 shadow-[12px_12px_0_0_#000] flex flex-col justify-start ${pkg.color} ${index % 2 === 0 ? "-rotate-1" : "rotate-1"}`}>
                <h3 className="text-2xl font-black uppercase mb-4 bg-black text-white inline-block px-3 py-1 shadow-[4px_4px_0_0_#FFD700]">{pkg.name}</h3>
                <p className="text-xl font-bold border-t-4 border-black pt-4">{pkg.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_0_#000] text-center max-w-3xl mx-auto -rotate-1 mt-8">
          <h3 className="text-3xl font-black uppercase mb-4">Get in touch</h3>
          <p className="text-xl font-bold mb-6">
            Email us at <a href="mailto:info@pocketkerala.in" className="bg-[#FFD700] px-2 py-1 border-2 border-black inline-block shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all">info@pocketkerala.in</a> with your business name, preferred package, and where you'd like to be featured.
          </p>
          <p className="text-xl font-bold">
            You can also call <a href="tel:+919895802679" className="bg-[#90A8ED] px-2 py-1 border-2 border-black inline-block shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all">+91-9895802679</a>.
          </p>
        </section>
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-20 border-t-4 border-black pt-8 flex flex-col items-center text-center gap-4">
        <div className="bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0_0_#000] max-w-2xl w-full">
          <h4 className="text-2xl font-black uppercase mb-4">Contact</h4>
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
    </div>
  );
}

