/* Pendências: cada uma com responsável, prazo e mensagem de cobrança */
"use strict";
/* ---------- Pendências (cada uma tem dono e prazo) ---------- */
// Monta a lista de cobranças do dia. Cada item tem: e (estudante), dono (ATE ou ADE), tipo, prazo (data ou null),
// desde (data em que começou a esperar), t (texto), wa (mensagem de WhatsApp, sem dado de saúde) e aba (aba da ficha que abre).
function pendencias() {
  const P = [];
  for (const e of visiveis()) {
    const l = laudoAtual(e);
    if (l) {
      const nm = primeiro(e.nome);
      // Laudo aprovado: avisa quando vence ou quando faltam 30 dias ou menos (JANELA).
      if (l.etapa === "aprovado") {
        const n = dias(validade(l));
        if (n <= JANELA)
          P.push({
            e,
            dono: "ATE",
            tipo: "laudo",
            prazo: validade(l),
            t:
              n < 0
                ? "Laudo de dieta vencido: pedir um novo à família"
                : "Laudo de dieta perto de vencer: pedir um novo à família",
            wa: `Olá, aqui é a ${UE_NOME}. Precisamos de um novo laudo de alimentação de ${nm}. Pode trazer à secretaria? Obrigado.`,
            aba: "alimentacao",
          });
      }
      // Laudo recebido pela Secretaria: a Gestão precisa conferir e enviar à CODAE.
      if (l.etapa === "recebido")
        P.push({
          e,
          dono: "ADE",
          tipo: "laudo",
          prazo: null,
          desde: l.recebido,
          t: "Conferir o laudo recebido e enviar à CODAE",
          aba: "alimentacao",
        });
      // Laudo devolvido na conferência: a Secretaria pede um laudo corrigido à família.
      if (l.etapa === "devolvido")
        P.push({
          e,
          dono: "ATE",
          tipo: "laudo",
          prazo: null,
          desde: l.hist[0].d,
          t: "Laudo devolvido na conferência: pedir à família um laudo corrigido",
          wa: `Olá, aqui é a ${UE_NOME}. O laudo de alimentação de ${nm} precisa ser refeito. Pode passar na secretaria para entender o que falta? Obrigado.`,
          aba: "alimentacao",
        });
      // A CODAE pediu complemento: a Secretaria pede à família.
      if (l.etapa === "complemento")
        P.push({
          e,
          dono: "ATE",
          tipo: "laudo",
          prazo: null,
          desde: l.hist[0].d,
          t: "A CODAE pediu complemento: pedir à família",
          wa: `Olá, aqui é a ${UE_NOME}. Precisamos completar o laudo de alimentação de ${nm}. Pode passar na secretaria? Obrigado.`,
          aba: "alimentacao",
        });
    }
    // nm: primeiro nome. nr: dias até o retorno à UBS. pz: prazo da Ficha de Saúde, 30 dias após a matrícula
    // (Instrução Normativa SME nº 28/2024, mantida na nº 37/2025).
    const nm = primeiro(e.nome),
      nr = dias(e.retorno),
      pz = addDias(e.matricula, 30);
    // Ficha de saúde B ainda não concluída.
    if (e.fb.status !== "concluida")
      P.push({
        e,
        dono: "ATE",
        tipo: "ficha",
        prazo: pz,
        t: "Ficha de saúde B a preencher com a família",
        wa: `Olá, aqui é a ${UE_NOME}. Precisamos preencher a ficha de saúde de ${nm} com vocês. Pode passar na secretaria? Obrigado.`,
        aba: "saude",
      });
    // Ficha E aberta: falta registrar os apoios necessários.
    else if (e.fe && e.fe.status === "aberta")
      P.push({
        e,
        dono: "ATE",
        tipo: "ficha",
        prazo: pz,
        t: "Ficha E aberta: registrar os apoios necessários",
        aba: "saude",
      });
    // Restrição alimentar informada na Ficha B e nenhum laudo registrado: pedir o laudo de dieta.
    if (e.fb.status === "concluida" && e.fb.alim && !laudoAtual(e))
      P.push({
        e,
        dono: "ATE",
        tipo: "laudo",
        prazo: null,
        t: "Restrição alimentar informada na Ficha B: pedir o laudo de dieta",
        wa: `Olá, aqui é a ${UE_NOME}. Para oferecer a alimentação adequada a ${nm}, precisamos do laudo do médico ou do nutricionista. Pode trazer à secretaria? Obrigado.`,
        aba: "alimentacao",
      });
    // DVA (Declaração de Vacinação Atualizada): sem declaração na ficha, ou data de retorno à UBS em até 30 dias ou já passada.
    const msgDVA = `Olá, aqui é a ${UE_NOME}. Pode levar ${nm} a uma UBS para conferir a caderneta de vacinação e trazer a Declaração de Vacinação Atualizada (DVA) à escola? Obrigado.`;
    if (!e.dvaEm)
      P.push({
        e,
        dono: "ATE",
        tipo: "vacina",
        prazo: null,
        t: "Sem DVA na ficha: pedir a declaração à família",
        wa: msgDVA,
        aba: "vacina",
      });
    else if (e.retorno && nr <= JANELA)
      P.push({
        e,
        dono: "ATE",
        tipo: "vacina",
        prazo: e.retorno,
        t:
          nr < 0
            ? "Data de retorno à UBS passou: pedir uma nova DVA"
            : "Retorno à UBS chegando: lembrar a família",
        wa: msgDVA,
        aba: "vacina",
      });
    // Condição grave sem orientação de emergência por escrito.
    if (e.grave && !e.plano)
      P.push({
        e,
        dono: "ATE",
        tipo: "plano",
        prazo: null,
        t: "Falta a orientação de emergência por escrito: pedir à família",
        wa: `Olá, aqui é a ${UE_NOME}. Precisamos de uma orientação por escrito, do médico ou da UBS, sobre como cuidar de ${nm} na escola em caso de emergência. Pode trazer à secretaria? Obrigado.`,
        aba: "cuidados",
      });
    // Plano de apoio com revisão próxima: a Gestão revisa com o NAAPA.
    if (e.apoio && e.apoioRev && dias(e.apoioRev) <= JANELA)
      P.push({
        e,
        dono: "ADE",
        tipo: "apoio",
        prazo: e.apoioRev,
        t: "Revisar o plano de apoio com o NAAPA",
        aba: "apoio",
      });
    // Encaminhamento ao NAAPA ainda sem devolutiva registrada.
    e.enc.forEach((x) => {
      if (x.status !== "Devolutiva registrada")
        P.push({
          e,
          dono: "ADE",
          tipo: "enc",
          prazo: null,
          desde: x.d,
          t: "Encaminhamento ao NAAPA aguardando devolutiva",
          aba: "apoio",
        });
    });
  }
  // Mais urgentes primeiro: prazo mais próximo; sem prazo, quem espera há mais tempo.
  return ordenarInsercao(
    P,
    (x) => (x.prazo ? dias(x.prazo) : 100000) + (x.desde ? dias(x.desde) / 10000 : 0),
  ).lista;
}
// Selo de prazo de cada cobrança: "vencido há N dias", "vence hoje", "vence em N dias" ou "esperando há N dias".
function carimbo(p) {
  if (p.prazo) {
    const n = dias(p.prazo);
    if (n < 0)
      return `<span class="carimbo atraso"><small>vencido há</small><b>${-n} ${-n === 1 ? "dia" : "dias"}</b></span>`;
    if (n === 0) return `<span class="carimbo atraso"><small>vence</small><b>hoje</b></span>`;
    return `<span class="carimbo ${n <= JANELA ? "perto" : "ok"}"><small>vence em</small><b>${n} ${n === 1 ? "dia" : "dias"}</b></span>`;
  }
  if (!p.desde) return `<span class="carimbo neutro"><small>sem data</small><b>a fazer</b></span>`;
  const d = -(dias(p.desde) || 0);
  return `<span class="carimbo neutro"><small>esperando há</small><b>${d} ${d === 1 ? "dia" : "dias"}</b></span>`;
}
// Link do WhatsApp (wa.me) com a mensagem pronta. Usa só os dígitos do telefone, com o prefixo 55 do Brasil.
const linkWA = (e, txt) =>
  "https://wa.me/55" + e.tel.replace(/\D/g, "") + "?text=" + encodeURIComponent(txt);
// Ícones SVG escritos no próprio código, sem arquivos externos.
const ICONE = {
  mensagem:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"/><path d="M8.5 9h7M8.5 12h4.5"/></svg>',
  ficha:
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9.5 13h6M9.5 17h6"/></svg>',
};
// Uma linha da lista Hoje. Mostra só as iniciais do estudante. O botão do WhatsApp aparece apenas para quem pode agir:
// o dono da cobrança ou a Gestão, que faz tudo o que a Secretaria faz.
function itemCobranca(p, dono) {
  const nome = iniciais(p.e.nome) + ", " + p.e.turma,
    ini = esc(iniciais(p.e.nome));
  const podeAgir = dono || sessao.perfil === "ADE";
  return `<li>${carimbo(p)}<div class="o-que"><b>${esc(p.t)}</b><span class="quem-e">${esc(nome)}${p.prazo ? ", data " + fmt(p.prazo) : ""}</span></div><div class="acoes-li">${p.wa && podeAgir ? `<a class="bt-ico wa" href="${linkWA(p.e, p.wa)}" target="_blank" rel="noopener" data-wa="${p.e.id}" data-tip="Cobrar pelo WhatsApp" aria-label="Cobrar pelo WhatsApp a família de ${ini} (abre em nova janela)">${ICONE.mensagem}</a>` : ""}<button class="bt-ico" data-abrir="${p.e.id}" data-aba="${p.aba}" data-tip="Abrir ficha" aria-label="Abrir ficha de ${ini}">${ICONE.ficha}</button></div></li>`;
}
