import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MinhasPaginasClient from "./MinhasPaginasClient";

export default async function MinhasPaginasPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Busca as páginas diretamente do banco no servidor
  const pages = await prisma.product.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <MinhasPaginasClient initialPages={pages} user={session.user} />;
}
