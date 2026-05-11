import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TributeViewer from "./TributeViewer";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product) {
    return { title: "Página não encontrada" };
  }

  return {
    title: product.title || "Uma Homenagem Especial",
    description: "Uma página de amor feita com carinho.",
  };
}

export default async function PublicPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product) {
    notFound();
  }

  return <TributeViewer initialData={product.data} />;
}
