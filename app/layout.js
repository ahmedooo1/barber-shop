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
    default: "Barber Shop Elbeuf - Coiffeur & Barbier Homme",
    template: "%s | Barber Shop Elbeuf",
  },
  description:
    "Barber Shop, salon de coiffure et barbier pour homme à Elbeuf. Coupes, dégradés, rasage traditionnel, soins de barbe. Réservez en ligne.",
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23f2d88f'/%3E%3Cstop offset='1' stop-color='%23a9822f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='24' fill='%230b0b0d'/%3E%3Ccircle cx='50' cy='50' r='35' fill='url(%23g)'/%3E%3Ctext x='50' y='60' font-family='Arial,sans-serif' font-size='30' font-weight='700' text-anchor='middle' fill='%230b0b0d'%3EBS%3C/text%3E%3C/svg%3E",
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
        <aside className="sale-sticker" aria-label="Site internet à vendre">
          <a href="mailto:aah89063@gmail.com?subject=Achat%20du%20site%20Barber%20Shop">
            <strong>Site à vendre</strong>
            <span>Me contacter: aah89063@gmail.com</span>
          </a>
        </aside>
        <Header />
        {children}
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
