"use client";

import { useEffect, useState } from "react";

type SectionId = "about" | "goals" | "sponsors" | "coffee" | null;

export default function Home() {
  const [openSection, setOpenSection] = useState<SectionId>("about");
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [countdownMessage, setCountdownMessage] = useState<string>("");

  useEffect(() => {
    const launchDate = new Date("Jan 2, 2026 18:30:00 GMT+0530").getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const distance = launchDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setCountdownMessage("");
      } else {
        clearInterval(interval);
        setTimeLeft(null);
        setCountdownMessage("WATCH OUR LATEST VIDEO BELOW!");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = (section: SectionId) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  const maxHeightFor = (section: SectionId) =>
    openSection === section ? "2000px" : "0";

  return (
    <>
      <header className="kerala-header">
        <a className="logo-link" href="/">
          <img
            src="/images/logo.jpg"
            alt="PocketKerala logo"
            className="logo"
          />
        </a>
        <h1 className="sub-header-text">നമ്മുടെ കേരളം, നിങ്ങളുടെ കീശയിൽ</h1>
      </header>

      <section className="language-box-section">
        <div className="language-switch">
          <a className="malayalam-link-box" href="/malayalam">
            മലയാളം വെബ്സൈറ്റിനായി ഇവിടെ ക്ലിക്ക് ചെയ്യുക
          </a>
        </div>
      </section>

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
                DETAILS ON SPONSORSHIPS OPPORTUNITIES WILL BE ANNOUNCED SOON
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
              If you love what we do, you can support us by buying a coffee.{" "}
              <span className="coffee-link-soon">(Link coming soon)</span>
            </p>
          </div>
        </div>
      </section>

      <main className="kerala-main">
        <section className="announcement-section">
          <h2 className="milestone-title">
            Thanks for helping us reach 200+ Subs!
          </h2>

          <div id="countdown-timer" className="countdown-container">
            {timeLeft && (
              <>
                <div className="countdown-box">
                  <div className="countdown-value">{timeLeft.days}</div>
                  <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-box">
                  <div className="countdown-value">{timeLeft.hours}</div>
                  <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-box">
                  <div className="countdown-value">{timeLeft.minutes}</div>
                  <div className="countdown-label">Mins</div>
                </div>
                <div className="countdown-box">
                  <div className="countdown-value">{timeLeft.seconds}</div>
                  <div className="countdown-label">Secs</div>
                </div>
              </>
            )}
          </div>
          <div id="countdown-message" className="countdown-message">
            {countdownMessage}
          </div>

          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/duEQT4Wk8XM?origin=https://pocketkerala.in"
              title="YouTube video player"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <p>
            Get ready to explore the beauty and spirit of Kerala right in your
            pocket.
          </p>
        </section>

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

      <footer className="kerala-footer">
        <div className="contact-info">
          <h4>Contact Us</h4>
          <p>
            EMAIL:{" "}
            <a href="mailto:info@pocketkerala.in" className="link-gold">
              info@pocketkerala.in
            </a>
          </p>
          <p>
            PHONE:{" "}
            <a href="tel:+919895802679" className="link-gold">
              +91-9895802679
            </a>
          </p>
        </div>
        <p className="powered-by">
          Powered by{" "}
          <a
            href="https://www.instagram.com/anthonyfrison7/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            Frison
          </a>
        </p>
        <p className="copyright-text">
          Copyright © 2026 . All Rights Reserved.
        </p>
      </footer>
    </>
  );
}
