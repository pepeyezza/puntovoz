import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";
import "@/styles/globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: { default: ".VOZ", template: "%s · .VOZ" },
  description: "Comunicacion, divulgacion y opinion para el desarrollo de Chascomus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
<Script src="https://www.googletagmanager.com/gtag/js?id=G-8R7L4ESNV2" strategy="afterInteractive" />
<Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-8R7L4ESNV2');`}</Script>      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8R7L4ESNV2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8R7L4ESNV2');
          `}
        </Script>
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
