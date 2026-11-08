/* Telas gerais: menu de navegação, login, registro de acessos e privacidade.
   As outras telas ficam em telas-hoje.js, telas-estudantes.js, telas-ficha.js, telas-saude.js,
   telas-laudos.js e experimento.js. Cada tela é uma função que devolve o HTML dela como texto;
   o script.js (função render) coloca esse texto na página. */
"use strict";

// Menu de cada perfil: [identificador da tela, texto do botão]. A Gestão (ADE) tem a tela extra Registro de acessos.
const NAV = {
  ATE: [
    ["hoje", "Hoje"],
    ["estudantes", "Estudantes"],
    ["fichas", "Fichas de saúde"],
    ["laudos", "Laudos de dieta"],
    ["experimento", "Experimento"],
    ["privacidade", "Privacidade e fontes"],
  ],
  ADE: [
    ["hoje", "Hoje"],
    ["estudantes", "Estudantes"],
    ["fichas", "Fichas de saúde"],
    ["laudos", "Laudos de dieta"],
    ["registro", "Registro de acessos"],
    ["experimento", "Experimento"],
    ["privacidade", "Privacidade e fontes"],
  ],
};

// Desenha os botões do menu e marca com aria-current a tela atual (a ficha e o cartão contam como Estudantes).
function desenharNav() {
  const n = $("#nav");
  if (!sessao) {
    n.hidden = true;
    return;
  }
  n.hidden = false;
  n.innerHTML = NAV[sessao.perfil]
    .map(
      ([k, t]) =>
        `<button data-ir="${k}" ${rota.v === k || (rota.v === "ficha" && k === "estudantes") || (rota.v === "cartao" && k === "estudantes") ? 'aria-current="page"' : ""}>${t}</button>`,
    )
    .join("");
}

// Descrição curta de cada perfil, mostrada nos botões de conta da tela de login.
const CURTO = {
  ATE: "Cobra as famílias e registra o que chega: laudos, DVA, fichas e orientações.",
  ADE: "Faz o que a secretaria faz, confere e envia os laudos à CODAE e acompanha tudo.",
};
// Tela de login: botões que preenchem uma conta de demonstração e o formulário de entrada.
function telaLogin() {
  return `<div class="login"><section class="entrada" aria-labelledby="t-entrada">
    <h1 id="t-entrada" tabindex="-1">Cobranças do dia, laudos e fichas de saúde num só lugar</h1>
    <p class="lead">Protótipo para a secretaria e a gestão de uma escola municipal. Escolha uma conta de demonstração para preencher o acesso. <button type="button" class="link-aviso" id="abrir-aviso">Sobre este protótipo</button></p>
    <h2 class="vh">Contas de demonstração</h2>
    <ul class="contas">${Object.entries(USUARIOS)
      .map(
        ([u, c]) =>
          `<li><button type="button" data-conta="${u}"><b>${c.cargo}</b><span>${CURTO[c.perfil]}</span><small>Usar a conta ${u}</small></button></li>`,
      )
      .join("")}</ul></section>
  <form class="folha" id="f-login" novalidate><h2>Entrar</h2>
    <label class="campo"><span>Usuário</span><input type="text" id="usuario" name="usuario" autocomplete="username" required></label>
    <label class="campo"><span>Senha</span><input type="password" id="senha" name="senha" autocomplete="current-password" required><small>Nas contas de demonstração, a senha é demo123.</small></label>
    <p class="erro" id="erro-login" role="alert"></p>
    <button class="bt u-w100" type="submit">Entrar</button></form></div>`;
}

// Registro de acessos (só Gestão): uma linha para cada abertura ou alteração de ficha.
function telaRegistro() {
  return `<h1 tabindex="-1">Registro de acessos</h1><p class="lead">Cada abertura de ficha e cada alteração ficam aqui, com quem, quando e o quê. Ninguém apaga linhas. Neste protótipo o registro fica no navegador; em produção ficaria no servidor, fora do alcance de quem acessa.</p>
  <div class="linha-bt u-mb4"><button class="bt sec" id="copiar-csv">Copiar registro em CSV</button></div>
  ${
    S.eventos.length
      ? `<div class="rolagem"><table class="tb cartoes"><thead><tr><th scope="col">Nº</th><th scope="col">Data e hora</th><th scope="col">Quem</th><th scope="col">Ação</th><th scope="col">Estudante</th><th scope="col">Detalhe</th></tr></thead><tbody>
  ${S.eventos.map((x) => `<tr><td data-label="Nº">${x.n}</td><td data-label="Data e hora">${esc(x.t)}</td><td data-label="Quem">${esc(x.quem)} <small>(${esc(x.cargo)})</small></td><td data-label="Ação">${esc(x.acao)}</td><td data-label="Estudante">${esc(x.alvo) || "—"}</td><td data-label="Detalhe">${esc(x.detalhe) || "—"}</td></tr>`).join("")}</tbody></table></div>`
      : `<p class="vazio">Nenhum acesso registrado ainda.</p>`
  }`;
}

// Tela Privacidade e fontes: o que o perfil pode e não pode ver, como os dados são tratados, as fontes das regras e os limites do protótipo.
function telaPrivacidade() {
  const p = sessao.perfil;
  return `<h1 tabindex="-1">Privacidade e fontes</h1><p class="lead">O que você vê, o que não vê, e de onde vêm as regras deste protótipo.</p>
  <div class="grade"><div class="folha"><h2 class="u-mt0">Seu acesso</h2><p><b>Você pode:</b> ${PODE[p]}</p><p><b>Você não vê:</b> ${NAO_VE[p]}</p></div>
  <div class="folha"><h2 class="u-mt0">Como os dados são tratados</h2><ul>
    <li>Cada dado tem um dono que escreve e um público que lê.</li><li>A escola sabe o que fazer, não o porquê: diagnóstico e CID ficam fora da ficha.</li>
    <li>Listas mostram só iniciais; a ficha completa fica no registro de acessos.</li><li>Mensagens prontas de WhatsApp não levam informação de saúde.</li>
    <li>A página não carrega nada de fora e guarda os dados só neste navegador.</li></ul></div></div>
  <h2>Fontes usadas nas regras</h2><ul>
    <li><a href="https://educacao.sme.prefeitura.sp.gov.br/wp-content/uploads/2023/06/IT-No-04-2023-Laudos-e-cancelamento-de-alimentacao-especifica.pdf" target="_blank" rel="noopener">Informativo Técnico SME/CODAE nº 04/2023</a>: itens do laudo, validade, cancelamento e alta. Lido na íntegra.</li>
    <li><a href="https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html" target="_blank" rel="noopener">Lei 13.709/2018 (LGPD)</a>, art. 6º (necessidade) e art. 14 (melhor interesse da criança), e o Enunciado CD/ANPD nº 1/2023.</li>
    <li>Portaria Conjunta SME/SMS nº 1/2021: Declaração de Vacinação Atualizada (DVA).</li>
    <li><a href="https://legislacao.prefeitura.sp.gov.br/portaria-secretaria-municipal-da-educacao-3056-de-21-de-maio-de-2004/consolidado" target="_blank" rel="noopener">Portaria SME nº 3.056/2004</a>: fichas de saúde A, B, C e E. Instrução Normativa SME nº 28/2024: prazo de 30 dias após a matrícula, lida por matéria do Sinpeem.</li>
    <li>Decreto municipal nº 55.309/2014: criação do NAAPA. Citado por fonte secundária.</li>
    <li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/" target="_blank" rel="noopener">WCAG 2.2</a>: critérios de acessibilidade usados nos testes.</li></ul>
  <h2>Limites deste protótipo</h2><ul><li>Nesta fase só a escola tem acesso. Saúde (UBS), NAAPA e outros órgãos, como o sistema de Justiça, ficam para fases futuras.</li><li>Login simulado, sem servidor, sem integração com EOL, SIGPAE ou sistemas de saúde.</li><li>Não foi testado com servidores reais da escola.</li><li>O WhatsApp é um canal fora do controle da Prefeitura; em produção, o canal oficial precisa ser definido.</li></ul>`;
}
