type SiteFooterProps = {
  contactHeading: string;
};

export function SiteFooter({ contactHeading }: SiteFooterProps) {
  return (
    <footer className="kerala-footer">
      <div className="contact-info">
        <h4>{contactHeading}</h4>
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
        </a>{" "}
        &amp;{" "}
        <a
          href="https://infinitech.today"
          target="_blank"
          rel="noreferrer"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          infinitech
        </a>
      </p>
      <p className="copyright-text">
        Copyright © 2026 . All Rights Reserved.
      </p>
    </footer>
  );
}

