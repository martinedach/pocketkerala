"use client";

import { useState } from "react";
import { CountdownSection } from "../components/CountdownSection";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

type SectionId = "about" | "goals" | "sponsors" | "coffee" | null;
export default function Home() {
  const [openSection, setOpenSection] = useState<SectionId>("about");

  const handleToggle = (section: SectionId) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const maxHeightFor = (section: SectionId) =>
    openSection === section ? "2000px" : "0";

  return (
    <>
      <SiteHeader languageHref="/" languageLabel="English Website" />

      <section className="about-box-section">
        <div className="about-nav-buttons">
          <button
            type="button"
            className="about-nav-btn"
            onClick={() => handleToggle("about")}
          >
            ഞങ്ങളെക്കുറിച്ച്
          </button>
          <button
            type="button"
            className="about-nav-btn"
            onClick={() => handleToggle("goals")}
          >
            ലക്ഷ്യങ്ങൾ
          </button>
          <button
            type="button"
            className="about-nav-btn"
            onClick={() => handleToggle("sponsors")}
          >
            സ്പോൺസർമാർ
          </button>
          <button
            type="button"
            className="about-nav-btn coffee-btn"
            onClick={() => handleToggle("coffee")}
          >
            ഒരു കാപ്പി വാങ്ങൂ
          </button>
        </div>

        <div
          id="about-content"
          className="collapsible-content"
          style={{ maxHeight: maxHeightFor("about") }}
        >
          <div className="content-wrapper">
            <h3>പോക്കറ്റ് കേരളത്തിലേക്ക് സ്വാഗതം</h3>

            <div className="about-bio-container">
              <a
                href="https://www.instagram.com/anthonyfrison7/"
                target="_blank"
                rel="noreferrer"
                className="photo-link"
              >
                <img
                  src="/images/me1.png"
                  alt="Anthony"
                  className="founder-photo light-mode-photo"
                />
                <img
                  src="/images/meDark.png"
                  alt="Anthony"
                  className="founder-photo dark-mode-photo"
                />
              </a>
              <div className="bio-box">
                <p className="fluid-text">
                  നമസ്കാരം, <span className="highlight-orange">ആന്റണി</span>{" "}
                  ആണ്, <span className="highlight-orange">ഫ്രിസൺ</span> എന്നും
                  വിളിക്കും ;)
                </p>
                <p className="secondary-bio-text">
                  ഞാൻ പകുതി ഫ്രഞ്ചുകാരനും പകുതി മലയാളിയുമാണ്, പക്ഷെ
                  മനസ്സുകൊണ്ടും ആത്മാവ് കൊണ്ടും ഞാൻ പൂർണ്ണമായും ഒരു
                  മലയാളിയാണ്.
                </p>
                <p className="secondary-bio-text">
                  എന്റെ ജീവിതത്തിന്റെ ഭൂരിഭാഗവും ഞാൻ ഇന്ത്യയിലാണ്
                  ചെലവഴിച്ചത്; മലയാളം, തമിഴ്, കന്നഡ, ഹിന്ദി എന്നിങ്ങനെ 4 ഇന്ത്യൻ
                  ഭാഷകൾ പഠിക്കാൻ ഇത് എന്നെ സഹായിച്ചു - പോക്കറ്റ് കേരളയുടെ
                  യാത്രയിൽ ഉടനീളം നിങ്ങൾക്ക് അത് കാണാം.
                </p>
                <p className="secondary-bio-text">
                  ഞങ്ങൾ നിലവിൽ 4 പേരടങ്ങുന്ന ഒരു ചെറിയ ടീമാണ്, എങ്കിലും 2026
                  ജനുവരി 2 മുതൽ ആഴ്ചയിൽ ഒരു കണ്ടന്റ് വെച്ച് നിങ്ങൾക്കായി
                  നൽകാൻ ഞങ്ങൾ പരിശ്രമിക്കുന്നു.
                </p>
                <p className="secondary-bio-text">
                  2021-ൽ എന്റെ മനസ്സിലുദിച്ച ആശയമാണ് പോക്കറ്റ് കേരളം. ഞങ്ങളെ
                  പിന്തുണയ്ക്കുന്നവർക്കും ഈ വെബ്സൈറ്റ് സന്ദർശിക്കുന്നവർക്കും നന്ദി
                  അറിയിക്കാൻ വാക്കുകളില്ല.
                </p>
              </div>
            </div>

            <div className="about-bio-container" style={{ marginTop: 30 }}>
              <a
                href="https://www.instagram.com/baba__stories/"
                target="_blank"
                rel="noreferrer"
                className="photo-link"
              >
                <img
                  src="/images/editor.png"
                  alt="Nithin"
                  className="founder-photo light-mode-photo editor-photo-focus"
                />
                <img
                  src="/images/editor.png"
                  alt="Nithin"
                  className="founder-photo dark-mode-photo editor-photo-focus"
                />
              </a>
              <div className="bio-box">
                <p className="fluid-text">
                  നമസ്കാരം,{" "}
                  <span className="highlight-orange">ചീഫ് എഡിറ്റർ</span> നിതിൻ
                  ജേക്കബ് ആണ്!
                </p>
                <p className="secondary-bio-text">
                  കണ്ടന്റ് മോഡറേഷൻ, വീഡിയോ എഡിറ്റിംഗ്, സോഷ്യൽ മീഡിയ
                  മാനേജ്‌മെന്റ് എന്നിവയിൽ എനിക്ക് 15 വർഷത്തെ പരിചയമുണ്ട്.
                  Adobe Premier, Photoshop, Lightroom, Final Cut Pro എന്നിവയാണ്
                  പ്രധാന ടൂളുകൾ.
                </p>
                <p className="secondary-bio-text">
                  കേരള വിഷൻ ഉൾപ്പെടെയുള്ള പ്രമുഖ മാധ്യമങ്ങളിൽ പ്രവർത്തിച്ചിട്ടുള്ള
                  എന്റെ അനുഭവസമ്പത്ത് നിങ്ങൾക്ക് ഉറപ്പായും ബോധ്യപ്പെടും.
                </p>
                <p className="secondary-bio-text">
                  കോട്ടയംകാരനായ ഞാൻ, നിങ്ങൾ ചിന്തിക്കുന്നതിലും വലിയ ഒരു
                  മലയാളിയാണ്.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          id="goals-content"
          className="collapsible-content"
          style={{ maxHeight: maxHeightFor("goals") }}
        >
          <div className="content-wrapper">
            <h3>ഞങ്ങളുടെ ലക്ഷ്യങ്ങൾ</h3>
            <p className="secondary-bio-text">
              കേരളത്തെ അതിന്റെ തനിമയിൽ ഒപ്പിയെടുക്കുക, സമൂഹത്തെ ഒന്നിപ്പിക്കുക,
              പ്രാദേശിക ബിസിനസുകളെ പിന്തുണയ്ക്കുക, സാംസ്കാരിക പൈതൃകം സംരക്ഷിക്കുക
              എന്നിവയാണ് ഞങ്ങളുടെ പ്രധാന ലക്ഷ്യങ്ങൾ.
            </p>
            <p className="secondary-bio-text">
              ഞങ്ങൾ ഈ രംഗത്ത് പുതിയതാണ്; പക്ഷെ ഏതൊരു യാത്രയും തുടങ്ങുന്നത്
              പോലെ, ഞങ്ങളുടെ തുടക്കവും ലളിതമാണ്. പോകെപ്പോകെ മികച്ച നിലവാരമുള്ള
              കണ്ടന്റ് നിങ്ങൾക്ക് നൽകാൻ ഞങ്ങൾ ശ്രമിക്കും.
            </p>
          </div>
        </div>

        <div
          id="sponsors-content"
          className="collapsible-content"
          style={{ maxHeight: maxHeightFor("sponsors") }}
        >
          <div className="content-wrapper">
            <h3>സ്പോൺസർമാരും പിന്തുണക്കുന്നവരും</h3>
            <div className="supporter-logos">
              <a
                href="https://www.facebook.com/smartpixmediaofficial"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/spm_icon.png"
                  alt="SmartPix"
                  className="supporter-logo"
                />
              </a>
              <a
                href="https://kappo.in"
                target="_blank"
                rel="noreferrer"
                className="logo-card-black"
              >
                <img
                  src="/images/kappo1.png"
                  alt="Kappo"
                  className="supporter-logo kappo-logo"
                />
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <img
                  src="/images/heritage.png"
                  alt="Heritage Record Room"
                  className="supporter-logo heritage-logo"
                />
              </a>
              <a
                href="https://www.instagram.com/cubalibre.in/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/cuba.jpg"
                  alt="Cuba Libre"
                  className="supporter-logo cuba-logo"
                />
              </a>
            </div>
            <p
              className="secondary-bio-text"
              style={{ marginTop: 20, textAlign: "center" }}
            >
              ഞങ്ങളുടെ മീഡിയ പാർട്ണറായ സ്മാർട്ട്‌പിക്‌സ് മീഡിയയ്ക്കും ഞങ്ങളെ
              പിന്തുണയ്ക്കുന്നവർക്കും നന്ദി.{" "}
              <strong className="sponsor-announcement">
                സ്പോൺസർഷിപ്പ് താൽപര്യമുണ്ടോ?{" "}
                <a href="/malayalam/sponsorship" className="link-gold">
                  വിശദാംശങ്ങൾ ഇവിടെ കാണുക
                </a>
                .
              </strong>
            </p>
          </div>
        </div>

        <div
          id="coffee-content"
          className="collapsible-content"
          style={{ maxHeight: maxHeightFor("coffee") }}
        >
          <div className="content-wrapper">
            <h3>ഞങ്ങളെ പിന്തുണക്കൂ</h3>
            <p className="secondary-bio-text">
              ഞങ്ങളുടെ പ്രവർത്തനം നിങ്ങൾക്ക് ഇഷ്ടപ്പെട്ടെങ്കിൽ,{" "}
              <a
                href="https://www.buymeacoffee.com/pocketkerala"
                target="_blank"
                rel="noreferrer"
                className="link-gold"
              >
                Buy Me a Coffee
              </a>{" "}
              വഴി ഒരു കാപ്പി വാങ്ങി നൽകി ഞങ്ങളെ സഹായിക്കാം.
            </p>
          </div>
        </div>
      </section>

      <main className="kerala-main">
        <CountdownSection
          milestoneTitle="200+ സബ്സ്ക്രൈബേഴ്സ് തികയ്ക്കാൻ സഹായിച്ചതിന് നന്ദി!"
          postLaunchMessage="ഞങ്ങളുടെ പുതിയ വീഡിയോ താഴെ കാണാം!"
          description="കേരളത്തിന്റെ ഭംഗിയും ആത്മാവും നിങ്ങളുടെ പോക്കറ്റിലൂടെ അറിയാൻ തയ്യാറായിക്കോളൂ."
          videoSrc="https://www.youtube.com/embed/duEQT4Wk8XM?origin=https://pocketkerala.in"
        />

        <section className="partner-section">
          <p className="thanks-text">ഞങ്ങളുടെ മീഡിയ പാർട്ണർക്ക് പ്രത്യേക നന്ദി</p>
          <a
            href="https://www.facebook.com/smartpixmediaofficial/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/spm_icon.png"
              alt="Partner"
              className="partner-logo"
            />
          </a>
        </section>

        <section className="connect-section">
          <h3>ഞങ്ങളുടെ കണ്ടന്റുകൾക്കായി</h3>
          <div className="social-links">
            <a
              href="https://www.youtube.com/@PocketKerala"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/youtube_icon.png"
                className="social-icon"
                alt="YouTube"
              />
            </a>
            <a
              href="https://www.instagram.com/PocketKerala"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/instagram_icon.png"
                className="social-icon"
                alt="Instagram"
              />
            </a>
            <a
              href="https://www.facebook.com/PocketKerala"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/facebook_icon.png"
                className="social-icon"
                alt="Facebook"
              />
            </a>
          </div>
        </section>
      </main>

      <SiteFooter contactHeading="ബന്ധപ്പെടുക" />
    </>
  );
}

