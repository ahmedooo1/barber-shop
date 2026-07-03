"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScissorsIcon, MenuIcon } from "./Icons";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/galerie", label: "Savoir-faire" },
  { href: "/equipe", label: "Équipe" },
  { href: "/avis", label: "Avis" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container nav-row">
        <Link href="/" className="brand">
          <ScissorsIcon width="30" height="30" stroke="#c9a24b" />
          BARBER<span>SHOP</span>
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
          <div className="nav-cta">
            <a href="tel:+33142961010" className="btn btn-outline">01 42 96 10 10</a>
            <Link href="/reservation" className="btn btn-primary">Réserver</Link>
          </div>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => {
            const next = !open;
            setOpen(next);
            document.body.style.overflow = next ? "hidden" : "";
          }}
        >
          <MenuIcon width="20" height="20" />
        </button>
      </div>
    </header>
  );
}
