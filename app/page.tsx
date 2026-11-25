import Logo from "./components/Logo";
import Countdown from "./components/Countdown";

export default function Home() {
  return (
    <div className="home">
      <header className="top">
        <a href="/" aria-label="Noisy Studio home"><Logo /></a>
        <a href="https://www.instagram.com/noisycreativestudio" target="_blank" rel="noopener" aria-label="Noisy Studio on Instagram (@noisycreativestudio)" className="ig">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </header>

      <main className="center">
        <div className="stack">
          <h1 className="title">
            <span className="wide">Coming</span>
            <span className="narrow">soon</span>
          </h1>
          <div className="match">
            <span className="ghost" aria-hidden="true">Coming</span>
            <Countdown />
          </div>
        </div>
      </main>

      <footer className="foot">
        <a href="mailto:Hello@noisystudio.com.au">Hello@noisystudio.com.au</a>
      </footer>
    </div>
  );
}
