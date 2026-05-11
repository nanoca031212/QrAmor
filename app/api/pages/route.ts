import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const { title, data } = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        userId: session.user.id,
        title: title || "Minha Homenagem",
        data: data || {},
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    console.error("[PAGES_POST]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

