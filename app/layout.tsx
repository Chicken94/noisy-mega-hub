import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.intro,
  openGraph: { title: site.name, description: site.tagline, url: `https://${site.domain}`, siteName: site.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <header className="nav">
          <div className="wrap">
            <Link href="/" className="logo">NOISY<span>.</span>STUDIO</Link>
            <ul>
              <li><Link href="/#work">Work</Link></li>
              <li className="hide-sm"><Link href="/#services">Services</Link></li>
              <li><Link href="/#contact">Contact</Link></li>
            </ul>
          </div>
        </header>
        {children}
        <footer>
          <div className="wrap">
            <span>© {new Date().getFullYear()} {site.name} · {site.location}</span>
            <span>{site.socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noreferrer">{s.label}</a>)}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
