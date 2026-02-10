export default function SponsorshipPage() {
  return (
    <main className="kerala-main">
      <section className="announcement-section">
        <h2 className="milestone-title">Sponsorship</h2>

        <p className="secondary-bio-text" style={{ textAlign: "left" }}>
          Pocket Kerala is a community-first storytelling project focused on
          culture, food, travel, and local businesses across Kerala. Sponsorships
          help us keep producing consistent, high quality episodes and invest
          back into the places and people we feature.
        </p>

        <h3 style={{ textAlign: "left" }}>Sponsorship options</h3>
        <ul className="secondary-bio-text" style={{ textAlign: "left" }}>
          <li>
            <strong>Episode sponsor</strong>: Brand mention + logo placement on
            the website sponsors section for the episode window.
          </li>
          <li>
            <strong>Season sponsor</strong>: Always-on placement for a set of
            episodes, plus a dedicated sponsor callout.
          </li>
          <li>
            <strong>Local business feature</strong>: Showcase a local business
            with transparent labeling as sponsored content.
          </li>
          <li>
            <strong>In-kind support</strong>: Logistics, accommodation,
            experiences, or gear support.
          </li>
        </ul>

        <h3 style={{ textAlign: "left" }}>Get in touch</h3>
        <p className="secondary-bio-text" style={{ textAlign: "left" }}>
          Email us at{" "}
          <a href="mailto:info@pocketkerala.in" className="link-gold">
            info@pocketkerala.in
          </a>{" "}
          with your business name, preferred package, and where you’d like to be
          featured. You can also call{" "}
          <a href="tel:+919895802679" className="link-gold">
            +91-9895802679
          </a>
          .
        </p>
      </section>
    </main>
  );
}

