import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://noisystudio.com.au"),
  title: "Noisy Studio — Coming soon",
  description: "Noisy Studio. Launching 1 January 2027.",
  openGraph: { title: "Noisy Studio — Coming soon", url: "https://noisystudio.com.au", siteName: "Noisy Studio" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
