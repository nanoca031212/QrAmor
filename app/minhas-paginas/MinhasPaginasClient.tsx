"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Settings, LogOut } from "lucide-react";
import { get as idbGet, del as idbDel } from "idb-keyval";

interface MinhasPaginasClientProps {
  initialPages: any[];
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function MinhasPaginasClient({ initialPages, user }: MinhasPaginasClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<any[]>(initialPages);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    const syncPendingData = async () => {
      try {
        const pendingData = await idbGet("mycupid_tribute_data");
        if (pendingData) {
          setIsSyncing(true);
          const res = await fetch("/api/pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: pendingData.selectedSpotifyTrack?.name 
                ? `Homenagem ao som de ${pendingData.selectedSpotifyTrack.name}` 
                : "Minha Homenagem",
              data: pendingData,
            }),
          });

          if (res.ok) {
            await idbDel("mycupid_tribute_data");
            // Refresh to get the latest list from the server
            router.refresh();
            // Also fetch manually to update state immediately without a full reload feel
            const updatedPagesRes = await fetch("/api/pages");
            const updatedPages = await updatedPagesRes.json();
            if (Array.isArray(updatedPages)) {
              setPages(updatedPages);
            }
          } else {
            const errData = await res.json();
            if (res.status === 413) {
              setSyncError("As fotos são muito grandes. Tente criar uma nova página com menos fotos.");
            } else {
              setSyncError(errData.error || "Erro ao salvar sua página.");
            }
          }
        }
      } catch (err) {
        console.error("Erro ao sincronizar página pendente:", err);
        setSyncError("Erro de conexão ao salvar sua página.");
      } finally {
        setIsSyncing(false);
      }
    };

    syncPendingData();
  }, [router]);

  return (
    <main className="relative min-h-screen bg-[#09090b] overflow-hidden">
      {/* Background gradients */}
      <div className="absolute left-[-88px] top-24 h-[280px] w-[280px] rounded-full bg-fuchsia-500/20 blur-[95px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px] -z-10" />

      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/Logo.png" alt="MyCupid" className="w-8 h-auto object-contain" />
            <span className="font-bold text-white text-lg">MyCupid</span>
          </Link>

          <div className="flex items-center gap-3">
            {user.image && (
              <img
                src={user.image}
                alt={user.name ?? ""}
                className="w-9 h-9 rounded-full ring-2 ring-fuchsia-500/40 object-cover"
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {isSyncing && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-3.5 animate-pulse">
            <Heart size={20} className="text-fuchsia-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-fuchsia-300">
                Sincronizando sua página...
              </p>
              <p className="text-xs text-fuchsia-400/70 mt-0.5">
                Quase lá! Estamos salvando sua nova criação na sua conta.
              </p>
            </div>
          </div>
        )}

        {syncError && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5">
            <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-black shrink-0">!</div>
            <div>
              <p className="text-sm font-bold text-red-300">
                Ops! Ocorreu um problema ao salvar.
              </p>
              <p className="text-xs text-red-400/70 mt-0.5">
                {syncError}
              </p>
            </div>
          </div>
        )}

        {/* Page title row */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Minhas Páginas de Amor
            </h1>
            <p className="text-sm text-white/50">Gerencie aqui todas as suas criações.</p>
          </div>
          <Link
            href="/criar"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,#7c3aed_0%,#a855f7_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.28)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_28px_rgba(168,85,247,0.34)] shrink-0"
          >
            <Settings size={15} />
            Criar Nova Página
          </Link>
        </div>

        {/* Empty state */}
        {pages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center py-24 px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Heart size={32} className="text-white/20" />
            </div>
            <h2 className="text-lg font-semibold text-white/70 mb-2">
              Nenhuma página criada ainda
            </h2>
            <p className="text-sm text-white/40 mb-8">
              Que tal começar a sua primeira obra de arte?
            </p>
            <Link
              href="/criar"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Criar minha primeira página
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <div
                key={page.id}
                className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3 hover:bg-white/[0.07] transition-colors"
              >
                <h3 className="font-semibold text-white">{page.title ?? "Sem título"}</h3>
                <p className="text-xs text-white/40">
                  Criada em {new Date(page.createdAt).toLocaleDateString("pt-BR")}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <Link
                    href={`/criar/montar?id=${page.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-white/80 transition-colors"
                  >
                    Editar página
                  </Link>

                  <Link
                    href={`/${page.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-md bg-fuchsia-500/10 px-3 py-1.5 text-xs font-semibold text-fuchsia-400 hover:bg-fuchsia-500/20 transition-colors"
                  >
                    Ver página →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
