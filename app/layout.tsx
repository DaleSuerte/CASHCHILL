import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const title = "CashChill | tu plata, pero relax";
const description =
  "CashChill te ayuda a organizar gastos compartidos sin dramas: sobrecitos, cierre express y recordatorios suaves.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_PE"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="es">
      <body>{children}</body>
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
    </html>
  );
}
