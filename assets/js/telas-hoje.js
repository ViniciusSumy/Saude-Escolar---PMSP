/* Tela Hoje: cobranças do dia, com filtro pela situação do prazo */
"use strict";

// Filtro escolhido na tela Hoje (texto vazio = todas as cobranças).
let filtroHoje = "";
// Filtros do resumo: [classe CSS, texto, função que diz se a cobrança entra]. "proximas" = prazo de hoje em diante.
const FILTROS_HOJE = {
  vencidas: ["r-atraso", "vencidas", (x) => x.prazo && dias(x.prazo) < 0],
  proximas: ["r-perto", "nos próximos 30 dias", (x) => x.prazo && dias(x.prazo) >= 0],
  semprazo: ["r-neutro", "sem prazo", (x) => !x.prazo],
};
// Tela Hoje. Cada perfil vê as próprias cobranças; a Gestão vê também, em outro grupo, as da secretaria.
function telaHoje() {
  const P = pendencias(),
    p = sessao.perfil,
    meus = P.filter((x) => x.dono === p);
  const dataLonga = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const f = filtroHoje ? FILTROS_HOJE[filtroHoje][2] : () => true;
  let h = `<h1 tabindex="-1">Hoje, ${esc(dataLonga)}</h1><p class="lead">${meus.length ? `Você tem ${meus.length} ${meus.length === 1 ? "cobrança" : "cobranças"}. As mais urgentes vêm primeiro.` : "Nada para cobrar hoje."} Unidade ${UE} ${UE_NOME}.</p>`;
  if (meus.length)
    h += `<div class="resumo" role="group" aria-label="Filtrar cobranças">${Object.entries(
      FILTROS_HOJE,
    )
      .map(([k, [cl, txt, fn]]) => {
        const n = meus.filter(fn).length;
        return `<button type="button" class="${cl}" data-filtro="${k}" aria-pressed="${filtroHoje === k}"><b>${n}</b><span>${txt}</span></button>`;
      })
      .join(
        "",
      )}</div>${filtroHoje ? `<p class="ajuda">Mostrando só as cobranças ${FILTROS_HOJE[filtroHoje][1]}. <button type="button" class="link-aviso" data-filtro="${filtroHoje}">Mostrar todas</button></p>` : ""}`;
  h += grupo("Para você", meus.filter(f), true);
  if (p === "ADE")
    h += grupo(
      "Com a secretaria",
      P.filter((x) => x.dono === "ATE").filter(f),
      false,
      "Você acompanha e pode agir se precisar.",
    );
  if (p === "ATE") {
    const n = P.filter((x) => x.dono === "ADE" && x.tipo === "laudo").length;
    if (n)
      h += `<p class="nota">${n} ${n === 1 ? "laudo aguarda" : "laudos aguardam"} conferência da gestão.</p>`;
  }
  return h;
}
// Uma seção da lista Hoje: título, contagem e as cobranças (cada uma desenhada por itemCobranca).
function grupo(titulo, L, dono, sub) {
  return `<section class="grupo" aria-labelledby="g-${titulo.length}"><h2 id="g-${titulo.length}">${titulo} <span class="contagem">${L.length}</span></h2>${sub ? `<p class="lead">${sub}</p>` : ""}${L.length ? `<ul class="cobrancas">${L.map((x) => itemCobranca(x, dono)).join("")}</ul>` : `<p class="vazio">Nenhuma cobrança aqui.</p>`}</section>`;
}
