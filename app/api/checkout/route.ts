import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

const PLANS: Record<string, { name: string; description: string; amount: number }> = {
  vip: {
    name: 'MyCupid VIP 💎',
    description: 'Tudo liberado — edições ilimitadas, QR Code, mensagem de voz e mais.',
    amount: 3499, // R$ 34,99
  },
  avancado: {
    name: 'MyCupid Avançado ✨',
    description: 'Joguinhos, música, intros especiais e galeria completa.',
    amount: 2490, // R$ 24,90
  },

};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan = 'vip', qrStyle = 'classico', metadata } = body;

    const selectedPlan = PLANS[plan] ?? PLANS.vip;
    const origin = req.headers.get('origin');

    // Configura os itens da Stripe
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: selectedPlan.name,
            description: selectedPlan.description,
            images: ['https://mycupid.com.br/Logo.png'],
          },
          unit_amount: selectedPlan.amount,
        },
        quantity: 1,
      },
    ];

    // Se não for VIP e escolher um QR Code pago, adiciona como item separado
    if (plan !== 'vip' && (qrStyle === 'juntos' || qrStyle === 'gatinho')) {
      line_items.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: `QR Code Personalizado — ${qrStyle === 'juntos' ? 'Juntos para Sempre' : 'Te Amo Gatinho'}`,
            description: 'Design exclusivo para o seu QR Code físico/digital.',
            images: [
              qrStyle === 'juntos' 
                ? 'https://img.icons8.com/color/96/love-message.png' 
                : 'https://img.icons8.com/color/96/cat--v1.png'
            ],
          },
          unit_amount: 390, // R$ 3,90
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      line_items,
      mode: 'payment',
      // Após pagar, vai para /registro com o session_id para pré-preencher o email
      success_url: `${origin}/registro?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/criar/montar`,
      metadata: {
        ...metadata,
        plan,
        qrStyle,
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

