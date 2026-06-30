import type { Metadata } from "next";
import { Fraunces, Sora, Poppins } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/styles/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: ".VOZ — Desarrollo local, educación y cultura en voz propia",
    template: "%s · .VOZ",
  },
  description:
    "Plataforma de comunicación, divulgación y opinión sobre desarrollo local, educación, tecnología, cultura y gestión pública.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: ".VOZ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${fraunces.variable} ${sora.variable} ${poppins.variable}`}>
      <body className="font-body antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
