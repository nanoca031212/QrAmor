import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as any,
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id ausente" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const email = session.customer_details?.email ?? session.customer_email ?? null;
    
    let userExists = false;
    if (email) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) userExists = true;
    }

    return NextResponse.json({
      email,
      customerName: session.customer_details?.name ?? null,
      paid: session.payment_status === "paid",
      userExists,
    });
  } catch (err: any) {
    console.error("[CHECKOUT_SESSION]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
