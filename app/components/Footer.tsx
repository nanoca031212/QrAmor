import Link from "next/link";
import { Camera, Heart, Mail, MessageCircleMore } from "lucide-react";

const platformLinks = [
  { label: "Criar Página", href: "/criar" },
  { label: "Minhas Criações", href: "#" },
  { label: "Login / Cadastro", href: "#" },
  { label: "Planos e Preços", href: "#" },
];

const supportLinks = [
  { label: "Central de Ajuda", href: "#" },
  { label: "Termos de uso", href: "#" },
  { label: "Política de privacidade", href: "#" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: Camera },
  { label: "WhatsApp", href: "#", icon: MessageCircleMore },
  { label: "Email", href: "mailto:contato@qrdoamor.com", icon: Mail },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/8 bg-black px-4 py-20 text-white">

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-heading text-4xl text-red-500">
                <span className="font-extrabold text-white uppercase">Qr</span>
                doAmor
              </span>
              <Heart className="text-red-400" size={18} fill="currentColor" />
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/60">
              Transformando sentimentos em experiencias digitais inesqueciveis.
              Crie, surpreenda e eternize o seu amor.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-fuchsia-500/30 hover:bg-white/10 hover:text-white"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Plataforma</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Suporte</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/60">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/8 pt-6 text-center text-xs text-white/35 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© 2026 QrDoAmor. Todos os direitos reservados.</p>
          <p>
            Feito com{" "}
            <Heart
              className="mx-1 inline text-red-400"
              size={12}
              fill="currentColor"
            />
            para criar momentos inesqueciveis.
          </p>
        </div>
      </div>
    </footer>
  );
}
