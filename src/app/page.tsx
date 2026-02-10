"use client";

import { useState } from "react";
import { CountdownSection } from "./components/CountdownSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

type SectionId = "about" | "goals" | "sponsors" | "coffee" | null;
export default function Home() {
  const [openSection, setOpenSection] = useState<SectionId>(null);

  const handleToggle = (section: SectionId) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const maxHeightFor = (section: SectionId) =>
    openSection === section ? "2000px" : "0";

  return (
    <>
      <SiteHeader
        languageHref="/malayalam"
        languageLabel="മലയാളം വെബ്സൈറ്റിനായി ഇവിടെ ക്ലിക്ക് ചെയ്യുക"
      />

      <section className="about-box-section">
        <div className="about-nav-buttons">
          <button
            type="button"
            className="about-nav-btn"
            onClick={() => handleToggle("about")}
          >
            About Us
          </button>
          <button
            type="button"
            className="about-nav-btn"
            onClick={() => handleToggle("goals")}
          >
            Goals
          </button>
          <button
            type="button"
            className="about-nav-btn"
            onClick={() => handleToggle("sponsors")}
          >
            Sponsors &amp; Supporters
          </button>
          <button
            type="button"
            className="about-nav-btn coffee-btn"
            onClick={() => handleToggle("coffee")}
          >
            Get Us A Coffee
          </button>
        </div>

        <div
          id="about-content"
          className="collapsible-content"
          style={{ maxHeight: maxHeightFor("about") }}
        >
          <div className="content-wrapper">
            <h3>Welcome to Pocket Kerala</h3>

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
                  Hey there,{" "}
                  <span className="highlight-orange">Anthony</span> here, people
                  call me <span className="highlight-orange">Frison</span> ;)
                </p>
                <p className="secondary-bio-text">
                  I am half French and half Malayali, but I can assure you I am
                  a full malayali by heart, soul and choice.
                </p>
                <p className="secondary-bio-text">
                  I spent most of my life in India; which helped me learn and
                  speak 4 different Indian languages (Malayalam, Tamil, Kannada
                  and Hindi) - A theme you will see throughout our Pocket Kerala
                  journey.
                </p>
                <p className="secondary-bio-text">
                  We are currently a super small team of 4, but that will not
                  stop us from giving you lovely folks 1 content (with multiple
                  episodes) per week starting from the 2nd of Jan, 2026.
                </p>
                <p className="secondary-bio-text">
                  Pocket Kerala is my brain child from 2021. Words cannot
                  express my gratitude towards all our supporters and for you
                  reaching our website.
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
                  Hi, <span className="highlight-orange">Chief Editor</span>{" "}
                  Nithin Jacob here!
                </p>
                <p className="secondary-bio-text">
                  I have 15 years of content moderation, video editing and
                  social media management under my belt. My tools of choice are
                  Adobe Premier, Photoshop, Lightroom and Final Cut Pro.
                </p>
                <p className="secondary-bio-text">
                  Having worked with Kerala Vision and a few other media giants,
                  my creativity and work ethics speak for itself.
                </p>
                <p className="secondary-bio-text">
                  As a person from Kottayam, I am as Malayali as you can
                  imagine.
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
            <h3>Our Goals</h3>
            <p className="secondary-bio-text">
              Our main goal is to capture Kerala in its pure essence, bring the
              community together, support local businesses, preserve cultural
              heritage through engaging content.
            </p>
            <p className="secondary-bio-text">
              We are completely new to this; but just as every journey starts at
              one point and ends at another, we aim to better the quality of
              content we are starting with to progressively make it better for
              all audiences.
            </p>
          </div>
        </div>

        <div
          id="sponsors-content"
          className="collapsible-content"
          style={{ maxHeight: maxHeightFor("sponsors") }}
        >
          <div className="content-wrapper">
            <h3>Sponsors &amp; Supporters</h3>
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
              We are grateful for the support of our media partner, SmartPix
              Media, and all our loyal followers who make this journey possible.{" "}
              <strong className="sponsor-announcement">
                Interested in sponsoring Pocket Kerala?{" "}
                <a href="/sponsorship" className="link-gold">
                  View sponsorship options
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
            <h3>Support Our Work</h3>
            <p className="secondary-bio-text">
              If you love what we do, you can support us by buying a coffee on{" "}
              <a
                href="https://www.buymeacoffee.com/pocketkerala"
                target="_blank"
                rel="noreferrer"
                className="link-gold"
              >
                Buy Me a Coffee
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <main className="kerala-main">
        <CountdownSection
          milestoneTitle="Thanks for helping us reach 200+ Subs!"
          postLaunchMessage="WATCH OUR LATEST VIDEO BELOW!"
          description="Get ready to explore the beauty and spirit of Kerala right in your pocket."
          videoSrc="https://www.youtube.com/embed/duEQT4Wk8XM?origin=https://pocketkerala.in"
        />

        <section className="partner-section">
          <p className="thanks-text">Special thanks to our Media Partner</p>
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
          <h3>For Our Content</h3>
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

      <SiteFooter contactHeading="Contact Us" />
    </>
  );
}
