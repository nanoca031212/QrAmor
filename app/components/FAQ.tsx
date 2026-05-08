"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Quanto tempo demora para criar a página?",
    answer:
      "Em poucos minutos voce ja consegue montar tudo. O processo e simples, intuitivo e voce pode personalizar fotos, textos e detalhes sem precisar saber programar.",
  },
  {
    question: "Meu amor precisa baixar algum app?",
    answer:
      "Nao. A pagina abre direto pelo navegador no celular, tablet ou computador. Basta compartilhar o link ou QR Code com a pessoa.",
  },
  {
    question: "Por quanto tempo a página fica no ar?",
    answer:
      "Isso depende do plano escolhido. Temos opcoes com duracao limitada e tambem opcoes com pagina permanente e backup para voce manter sua surpresa acessivel por muito mais tempo.",
  },
  {
    question: "Posso editar a página depois de criar?",
    answer:
      "Sim. Voce pode ajustar textos, trocar fotos e refinar detalhes antes de enviar. Assim fica mais facil deixar tudo do jeitinho que imaginou.",
  },
  {
    question: "Quais formas de pagamento voces aceitam?",
    answer:
      "Aceitamos as formas de pagamento mais comuns no Brasil, com checkout seguro para voce finalizar sua compra com tranquilidade.",
  },
  {
    question: "E se eu nao gostar do resultado?",
    answer:
      "Voce conta com garantia para testar com seguranca. Se o resultado nao fizer sentido para voce, nosso suporte ajuda a encontrar a melhor solucao.",
  },
  {
    question: "Posso colocar fotos e videos?",
    answer:
      "Sim. Voce pode adicionar fotos, mensagens e outros elementos visuais para tornar a experiencia mais emocionante e personalizada.",
  },
  {
    question: "A pessoa que recebe sabe quanto eu paguei?",
    answer:
      "Nao. Quem recebe acessa apenas a experiencia criada por voce. Informacoes de compra e valores nao aparecem para a pessoa presenteada.",
  },
];

export default function PerguntasFrequentes() {
  const [openItem, setOpenItem] = useState(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-black px-4 py-24 text-white"
    >
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="mb-10 text-center">
          <h2
            style={{ fontFamily: "Georgia, serif" }}
            className="text-4xl font-semibold tracking-tight md:text-5xl"
          >
            Perguntas{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="mt-3 text-sm text-white/55 md:text-base">
            Tudo o que voce precisa saber antes de criar sua surpresa.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openItem === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] transition-colors hover:border-fuchsia-500/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-white md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-fuchsia-300 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen ? (
                  <div className="border-t border-white/6 px-5 pb-5 pt-4 md:px-6">
                    <p className="max-w-3xl text-sm leading-7 text-white/70 md:text-[15px]">
                      {faq.answer}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
