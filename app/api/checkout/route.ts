import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { metadata } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Adicione 'pix' se a conta Stripe brasileira suportar no modo test
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'MyCupid VIP - Homenagem Especial',
              description: 'Acesso completo com músicas, jogos, fotos e abertura especial.',
              images: ['https://mycupid.com.br/Logo.png'],
            },
            unit_amount: 3499, // R$ 34,99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/criar/montar`,
      metadata: metadata,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
