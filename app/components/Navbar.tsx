"use client";

import { useEffect, useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Como funciona?", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "F.A.Q", href: "#faq" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b text-white transition-all duration-300 ${
        isScrolled
          ? "border-white/10 bg-black py-4 shadow-lg"
          : "border-white/8 bg-black py-6"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-0">
        <Link href="#inicio" className="text-3xl text-red-500">
          <span className="font-extrabold uppercase text-white">Qr</span>doAmor
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-base font-normal transition-colors duration-300 hover:bg-white/5 hover:text-red-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/Criar"
            className="flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-base font-medium text-white transition-transform duration-300 hover:scale-105"
          >
            <Heart size={18} />
            Criar minha página
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors duration-300 hover:bg-white/10 md:hidden"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-4 w-full max-w-7xl px-4 md:hidden">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium transition-colors duration-300 hover:border-red-500/30 hover:bg-white/[0.05]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link
              href="/Criar"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-base font-medium text-white transition-transform duration-300 hover:scale-[1.01]"
            >
              <Heart size={18} />
              Criar minha página
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
