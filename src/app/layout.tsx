import type { Metadata } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const SITE_URL = "https://personal-port-folio-2nt89bm49-thurzas-projects.vercel.app"; // ← remplace par ton URL

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mathieu Miot — Développeur Fullstack & IA",
  description:
    "Portfolio de Mathieu Miot, développeur fullstack passionné par React, Three.js, WebGL et l'IA générative. Disponible sur le marché depuis juin 2025.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Mathieu Miot — Développeur Fullstack & IA",
    description:
      "Portfolio de Mathieu Miot, développeur fullstack passionné par React, Three.js, WebGL et l'IA générative. Disponible sur le marché depuis juin 2025.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "Portfolio de Mathieu Miot",
      },
    ],
    siteName: "Mathieu Miot",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mathieu Miot — Développeur Fullstack & IA",
    description:
      "Portfolio de Mathieu Miot, développeur fullstack passionné par React, Three.js, WebGL et l'IA générative.",
    images: ["/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${jetbrainsMono.variable} ${syne.variable}`}>
        {children}
      </body>
    </html>
  );
}
