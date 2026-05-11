"use client";

import { useEffect, useState } from "react";
import { Heart, Menu, X, BookHeart } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Como funciona?", href: "#como-funciona" },
  { label: "Planos", href: "#planos" },
  { label: "F.A.Q", href: "#faq" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

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
        <Link href="/" className="flex items-center gap-2">
          <img src="/Logo.png" alt="MyCupid" className="w-9 h-auto object-contain" />
          <span className="font-bold text-white text-xl">MyCupid</span>
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
          {session ? (
            <Link
              href="/minhas-paginas"
              className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-[linear-gradient(90deg,#7c3aed_0%,#8b5cf6_45%,#a855f7_100%)] px-5 py-2 text-base font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.28)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_28px_rgba(168,85,247,0.34)]"
            >
              <BookHeart size={16} className="text-white/90" />
              Minhas páginas
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-[linear-gradient(90deg,#7c3aed_0%,#8b5cf6_45%,#a855f7_100%)] px-5 py-2 text-base font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.28)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_28px_rgba(168,85,247,0.34)]"
            >
              <Heart size={16} className="text-white/90" />
              Minha Conta
            </Link>
          )}
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

            {session ? (
              <Link
                href="/minhas-paginas"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#7c3aed_0%,#a855f7_100%)] px-4 py-3 text-base font-medium text-white transition-transform duration-300 hover:scale-[1.01]"
              >
                <BookHeart size={18} />
                Minhas páginas
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-base font-medium text-white transition-transform duration-300 hover:scale-[1.01]"
              >
                <Heart size={18} />
                Criar minha página
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
