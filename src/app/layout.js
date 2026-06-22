import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { BRAND_NAME_WITH_TM, PERSON_FULL_NAME } from "@/lib/messages";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: `${BRAND_NAME_WITH_TM} — Emotional Clarity Coaching`,
  description:
    "Transform your emotional landscape with compassionate coaching. Mimansa Tiwari helps you find clarity, build resilience, and step into your authentic self.",
  keywords: [
    "emotional clarity",
    "coaching",
    "wellness",
    PERSON_FULL_NAME,
    "self-awareness",
    "personal growth",
  ],
  openGraph: {
    title: ` ${BRAND_NAME_WITH_TM}`,
    description:
      "Compassionate emotional clarity coaching to help you understand yourself and live with intention.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
