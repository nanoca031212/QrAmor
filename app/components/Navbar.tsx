"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b font-bold text-xs text-white transition-all duration-300 ${
        isScrolled
          ? "border-white/10 bg-black py-4 shadow-lg"
          : "border-white/8 bg-black py-6"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-0">
        <h1 className="text-red-500 text-3xl">
          <span className="font-extrabold text-white uppercase">Qr</span>doAmor
        </h1>

        <ul className="flex gap-7 font-normal text-lg ">
          <li className="cursor-pointer">Início</li>
          <li className="cursor-pointer">Como funciona?</li>
          <li className="cursor-pointer">Planos</li>
          <li className="cursor-pointer">F.A.Q</li>
        </ul>

        <div>
          <Link href="/Criar">
            <button className="flex items-center gap-2 font-medium hover:scale-110 transition-transform duration-300 rounded-full bg-red-500 px-4 py-1 text-base text-white">
              <Heart size={18} />
              Criar minha página
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
