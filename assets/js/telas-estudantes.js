/* Lista de estudantes (filtro por turma, ordenação) e cartão de cuidado para imprimir.
   A busca por código EOL (ordenação por inserção + busca binária) está no script.js. */
"use strict";

// Estado da tela: turma escolhida, texto da busca, ordem escolhida e a última mensagem de busca.
let filtroTurma = "",
  busca = "",
  ordem = "eol",
  ultimaBusca = null;
// Ordens da lista: [texto, função que dá a chave de ordenação]. A ordem "pend" é calculada dentro de telaEstudantes.
const ORDENS = {
  eol: ["Código EOL", (e) => Number(e.eol)],
  turma: ["Turma", (e) => e.turma + " " + e.eol],
  pend: ["Mais cobranças", null],
};
// Lista os estudantes da unidade, ordenados por inserção (ordenarInsercao) pela ordem escolhida.
function telaEstudantes() {
  const p = sessao.perfil,
    P = pendencias(),
    V = visiveis();
  const nPend = (e) => P.filter((x) => x.e === e && (x.dono === p || p === "ADE")).length;
  const turmas = ordenarInsercao([...new Set(V.map((e) => e.turma))], (t) => t).lista;
  const F = V.filter((e) => !filtroTurma || e.turma === filtroTurma);
  const ch = ordem === "pend" ? (e) => -nPend(e) * 10000000 + Number(e.eol) : ORDENS[ordem][1];
  const R = ordenarInsercao(F, ch),
    L = R.lista;
  return `<h1 tabindex="-1">Estudantes</h1><p class="lead">Busque pelo código EOL ou filtre por turma.</p>
  <form id="f-busca" class="folha filtros">
    <label class="campo"><span>Código EOL</span><input type="text" id="busca" inputmode="numeric" autocomplete="off" value="${esc(busca)}" placeholder="Exemplo: 1000001"></label>
    <button class="bt" type="submit">Abrir ficha</button>
    <label class="campo"><span>Turma</span><select id="turma"><option value="">Todas</option>${turmas.map((t) => `<option ${t === filtroTurma ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>
    <label class="campo"><span>Ordenar por</span><select id="ordem">${Object.entries(ORDENS)
      .map(([k, [t]]) => `<option value="${k}" ${k === ordem ? "selected" : ""}>${t}</option>`)
      .join("")}</select></label>
  </form><p class="erro" id="erro-busca" role="alert"></p>
  ${ultimaBusca ? `<p class="nota" id="info-busca">${esc(ultimaBusca)}</p>` : ""}
  <div class="rolagem"><table class="tb cartoes"><caption>${L.length} ${L.length === 1 ? "estudante" : "estudantes"}${filtroTurma ? " na turma " + esc(filtroTurma) : ""}, em ordem de ${{ eol: "código EOL", turma: "turma", pend: "número de cobranças" }[ordem]} (ordenação por inserção, ${R.comparacoes} comparações). Na lista aparecem só as iniciais.</caption>
  <thead><tr><th scope="col">EOL</th><th scope="col">Estudante</th><th scope="col">Turma</th><th scope="col">Cobranças</th><th scope="col"><span class="vh">Ação</span></th></tr></thead>
  <tbody>${L.map((e) => {
    const n = nPend(e);
    return `<tr><td data-label="EOL">${e.eol}</td><td data-label="Estudante">${esc(iniciais(e.nome))}</td><td data-label="Turma">${esc(e.turma)}</td><td data-label="Cobranças">${n ? `<span class="contagem">${n}</span>` : "nenhuma"}</td><td><button class="bt-ico" data-abrir="${e.id}" data-tip="Abrir ficha" aria-label="Abrir ficha de ${esc(iniciais(e.nome))}">${ICONE.ficha}</button></td></tr>`;
  }).join("")}</tbody></table></div>`;
}

// Cartão de cuidado para imprimir: diz o que fazer, sem diagnóstico. Na impressão, o que tem a classe nao-imprime some (responsivo.css).
function telaCartao() {
  const e = S.est.find((x) => x.id === rota.id);
  return `<p class="nao-imprime u-mb2"><button class="bt sec peq" data-abrir="${e.id}" data-aba="cuidados">Voltar à ficha</button></p>
  <h1 tabindex="-1" class="nao-imprime">Cartão de cuidado</h1><p class="lead nao-imprime">Para deixar com o professor. Não traz diagnóstico, só o que fazer.</p>
  <article class="cartao" aria-label="Cartão de cuidado de ${esc(e.nome)}"><h2>${esc(e.nome)}</h2><p class="turma">${esc(e.turma)}, ${UE_NOME}</p>
    ${e.alerg ? `<p class="se">Não pode comer ou ter contato com</p><p>${esc(e.alerg)}</p>` : ""}
    ${e.meds ? `<p class="se">Medicamento</p><p>${esc(e.meds)}</p>` : ""}
    <p class="se">Se acontecer uma emergência</p><p class="u-pre">${e.plano ? esc(e.plano) : "Ainda sem orientação por escrito. Chame o SAMU (192) e avise o responsável."}</p>
    <p class="se">Avisar</p><p>${esc(e.resp)}, ${esc(e.tel)}</p>
    <p class="rodape-c">Gerado em ${agora()} por ${esc(sessao.nome)}. ${e.planoEm ? "Orientação registrada em " + fmt(e.planoEm) + ". " : ""}Em emergência, siga a orientação de profissionais de saúde e ligue 192. Protótipo com dados fictícios.</p></article>
  <div class="linha-bt nao-imprime"><button class="bt" id="imprimir">Imprimir cartão</button></div>
  <p class="ajuda nao-imprime" id="aviso-impr"></p>`;
}
