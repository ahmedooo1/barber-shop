import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const playfair = Playfair_Display({
  variable: "--font-head",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "Barber Shop Paris - Coiffeur & Barbier Homme",
    template: "%s | Barber Shop Paris",
  },
  description:
    "Barber Shop, salon de coiffure et barbier pour homme au cœur de Paris. Coupes, dégradés, rasage traditionnel, soins de barbe. Réservez en ligne.",
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%230a0a0b'/%3E%3Ctext x='50' y='68' font-size='58' text-anchor='middle' fill='%23c9a24b'%3E%E2%9C%82%3C/text%3E%3C/svg%3E",
  },
};

export const viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <a href="#main" className="skip-link">Aller au contenu</a>
        <Header />
        {children}
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
