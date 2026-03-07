type SiteHeaderProps = {
  languageHref: string;
  languageLabel: string;
  variant?: "default" | "compact";
};

export function SiteHeader({ languageHref, languageLabel, variant = "default" }: SiteHeaderProps) {
  if (variant === "compact") {
    return (
      <header className="site-header-compact">
        <a className="site-header-compact-logo" href="/">
          <img src="/images/logo.jpg" alt="Pocket Kerala" />
        </a>
      </header>
    );
  }

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
          <a className="malayalam-link-box" href={languageHref}>
            {languageLabel}
          </a>
        </div>
      </section>
    </>
  );
}

