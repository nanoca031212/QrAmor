import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MinhasPaginasClient from "./MinhasPaginasClient";
import { Suspense } from "react";
import MinhasPaginasLoading from "./loading";

async function PaginasData({ userId, user }: { userId: string, user: any }) {
  const pages = await prisma.product.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <MinhasPaginasClient initialPages={pages} user={user} />;
}

export default async function MinhasPaginasPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<MinhasPaginasLoading />}>
      <PaginasData userId={session.user.id} user={session.user} />
    </Suspense>
  );
}

