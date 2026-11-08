/* Aba Alimentação especial e tela Laudos de dieta: jornada do laudo (Informativo Técnico SME/CODAE nº 04/2023) */
"use strict";

// Etapas mostradas na trilha do laudo.
const ETAPAS = [
  ["recebido", "Recebido na escola"],
  ["conferido", "Conferido"],
  ["enviado", "Enviado à CODAE"],
  ["aprovado", "Aprovado"],
];
// Itens que a Gestão confere antes de enviar o laudo à CODAE, conforme o Informativo Técnico SME/CODAE nº 04/2023.
const CONFERE = [
  ["legivel", "A prescrição está legível"],
  ["nome", "Traz o nome completo do estudante"],
  ["data", "Foi emitido há menos de 12 meses"],
  ["diag", "Traz diagnóstico, hipótese diagnóstica ou CID (conferir, sem copiar para a ficha)"],
  ["lista", "Lista os alimentos permitidos e os proibidos"],
  ["prof", "Identifica o profissional: nome, carimbo com registro e assinatura"],
];

// Aba Alimentação especial: trilha das etapas, validade (12 meses) e o formulário da etapa atual (recebimento, conferência e envio, retorno da CODAE ou cancelamento).
// Conferência, retorno e cancelamento são da Gestão (ADE).
function painelLaudo(e) {
  const p = sessao.perfil,
    l = laudoAtual(e),
    ADE = p === "ADE";
  const antigos = S.laudos.filter((x) => x.est === e.id && x.etapa === "cancelado");
  let h = "";
  if (!l || l.etapa === "devolvido") {
    h += l
      ? `<div class="alerta"><b>O último laudo foi devolvido na conferência.</b> Motivo: ${esc(l.motivo || "não informado")}. Peça à família um laudo corrigido.</div>`
      : `<p>${antigos.length ? "A alimentação específica foi cancelada. " : "Sem laudo de alimentação registrado. "}Quando a família entregar um laudo, registre aqui.</p>`;
    h += formRecebimento(e);
  } else {
    const idx = { recebido: 0, devolvido: 0, enviado: 2, complemento: 2, aprovado: 3 }[l.etapa];
    h += `<ol class="trilha" aria-label="Etapas do laudo">${ETAPAS.map(([k, t], i) => `<li class="${i < idx ? "feito" : ""}" ${i === idx ? 'aria-current="step"' : ""}>${t}${i < idx ? '<span class="vh"> (concluída)</span>' : ""}</li>`).join("")}</ol>`;
    const val = validade(l),
      nv = dias(val);
    h += `<div class="grade"><dl class="folha u-m0">${dado("Restrições alimentares", l.restr)}${dado("Prescrito por", l.prescritor)}
      <div class="par"><dt>Emitido em</dt><dd>${fmt(l.emitido)}</dd></div><div class="par"><dt>Recebido na escola em</dt><dd>${fmt(l.recebido)}</dd></div>
      <div class="par"><dt>Validade (12 meses a partir da emissão)</dt><dd>${fmt(val)}${nv < 0 ? `<b class="st-atraso">, vencido</b>` : nv <= JANELA ? `<b class="st-perto">, vence em ${nv} dias</b>` : ""}</dd></div>
      ${l.ref ? dado("Número do pedido no SIGPAE", l.ref) : ""}</dl><div class="folha">`;
    if (l.etapa === "recebido") {
      if (ADE) {
        const vencido = dias(addMeses(l.emitido, 12)) < 0;
        h += `<form id="f-confere" data-l="${l.id}"><fieldset><legend>Conferência antes de enviar à CODAE</legend><p class="ajuda u-mt0">Itens do Informativo Técnico CODAE nº 04/2023.</p>
          ${CONFERE.map(([k, t]) => `<div class="chk"><input type="checkbox" id="k-${k}" ${k === "data" && vencido ? "disabled" : ""}><label for="k-${k}">${t}</label></div>`).join("")}
          ${vencido ? `<p class="alerta" id="aviso-data">Este laudo foi emitido em ${fmt(l.emitido)}, há mais de 12 meses. Ele não pode ser enviado: devolva e peça um novo à família.</p>` : ""}</fieldset>
          ${campo("Número do pedido no SIGPAE (se houver)", "l-ref", "", "O pedido é feito no SIGPAE. Aqui a escola só acompanha.")}
          <p class="erro" id="erro-confere" role="alert"></p>
          <div class="linha-bt"><button class="bt" type="submit" ${vencido ? "disabled" : ""}>Registrar envio à CODAE</button></div></form>
          <form class="u-mt4" id="f-devolve" data-l="${l.id}">${campo("Motivo da devolução", "l-motivo", "", "Exemplo: falta a lista de alimentos permitidos.")}<button class="bt perigo" type="submit">Devolver à secretaria</button></form>`;
      } else h += `<p><b>Aguardando a conferência da gestão.</b></p>`;
    }
    if (l.etapa === "enviado" || l.etapa === "complemento") {
      h +=
        l.etapa === "complemento"
          ? `<p class="alerta"><b>A CODAE pediu complemento.</b> A secretaria cobra a família; quando chegar, registre um novo recebimento.</p>`
          : `<p><b>Aguardando o retorno da CODAE.</b> Enquanto a alimentação específica não é autorizada, a CODAE não interfere na frequência do estudante.</p>`;
      if (ADE)
        h += `<form id="f-retorno" data-l="${l.id}"><fieldset><legend>Retorno da CODAE</legend>${[
          ["aprovado", "Aprovado"],
          ["complemento", "Pediu complemento"],
        ]
          .map(
            ([k, t]) =>
              `<div class="chk"><input type="radio" name="ret" id="r-${k}" value="${k}"><label for="r-${k}">${t}</label></div>`,
          )
          .join(
            "",
          )}</fieldset><p class="erro" id="erro-ret" role="alert"></p><button class="bt" type="submit">Registrar retorno</button></form>`;
      if (l.etapa === "complemento") h += formRecebimento(e, "Registrar o laudo complementado");
    }
    if (l.etapa === "aprovado") {
      h +=
        nv <= JANELA
          ? `<p class="alerta"><b>${nv < 0 ? "Laudo vencido." : "Laudo perto de vencer."}</b> A secretaria pede um novo à família.</p>`
          : `<p><b>Alimentação específica autorizada.</b></p>`;
      h += `<p class="ajuda">Qualquer mudança na prescrição exige novo laudo à CODAE.</p>`;
      if (nv <= JANELA) h += formRecebimento(e, "Registrar o novo laudo");
      if (ADE)
        h += `<details class="u-mt4"><summary class="bt perigo u-inline">Cancelar a alimentação específica</summary>
        <form id="f-cancela" data-l="${l.id}"><fieldset><legend>Motivo</legend>
        <div class="chk"><input type="radio" name="mot" id="m-saiu" value="Estudante saiu da unidade"><label for="m-saiu">O estudante saiu da unidade</label></div>
        <div class="chk"><input type="radio" name="mot" id="m-alta" value="Alta médica"><label for="m-alta">Recebeu alta médica</label></div></fieldset>
        <div class="chk"><input type="checkbox" id="m-laudo"><label for="m-laudo">Na alta: recebi o laudo de alta com nome completo, data, prescritor, registro, carimbo e assinatura</label></div>
        <p class="ajuda">Se a alta cobre só uma das condições, o laudo vai à CODAE como nova solicitação.</p>
        <p class="erro" id="erro-cancela" role="alert"></p><button class="bt perigo" type="submit">Pedir o cancelamento à CODAE</button></form></details>`;
    }
    h += `</div></div><h2>Histórico do laudo</h2><ul class="hist">${l.hist.map((x) => `<li><small>${fmt(x.d)}, ${esc(x.por)}</small>${esc(x.t)}</li>`).join("")}</ul>`;
  }
  h += `<p class="nota">O laudo em papel vai para a CODAE. A ficha guarda só as restrições, sem diagnóstico nem CID.</p>`;
  return h;
}

// Formulário de recebimento do laudo. O parâmetro "titulo" muda o texto quando é um novo laudo ou um complemento.
function formRecebimento(e, titulo) {
  return `<form class="u-mt3" id="f-recebe" data-est="${e.id}"><fieldset><legend>${titulo || "Registrar recebimento do laudo"}</legend>
    <label class="campo"><span>Data de emissão do laudo</span><input type="date" id="l-emit" required><small>A data escrita no laudo. É ela que conta para a validade de 12 meses.</small></label>
    <label class="campo"><span>Prescrito por</span><select id="l-presc"><option value="">Escolha</option><option>Médico</option><option>Nutricionista</option><option>Fonoaudiólogo</option></select></label>
    ${campo("Restrições alimentares", "l-restr", "", "Copie só o que a criança pode e não pode comer. Não copie diagnóstico nem CID.", 1, 300)}
    <p class="erro" id="erro-recebe" role="alert"></p><button class="bt" type="submit">Registrar recebimento</button></fieldset></form>`;
}

// Tela Laudos de dieta: laudos da unidade ordenados por inserção pela data de validade.
function telaLaudos() {
  const V = visiveis(),
    L = ordenarInsercao(
      S.laudos.filter(
        (l) => V.some((e) => e.id === l.est) && !["cancelado", "substituido"].includes(l.etapa),
      ),
      (l) => dias(validade(l)),
    ).lista;
  const nomes = {
    recebido: "Aguardando conferência",
    devolvido: "Devolvido à família",
    enviado: "Aguardando a CODAE",
    complemento: "Complemento pedido",
    aprovado: "Autorizado",
  };
  return `<h1 tabindex="-1">Laudos de dieta</h1><p class="lead">Situação de cada laudo da unidade, com a validade contada a partir da data de emissão.</p>
  <div class="rolagem"><table class="tb cartoes"><thead><tr><th scope="col">EOL</th><th scope="col">Estudante</th><th scope="col">Situação</th><th scope="col">Emitido em</th><th scope="col">Válido até</th><th scope="col"><span class="vh">Ação</span></th></tr></thead><tbody>
  ${L.map((l) => {
    const e = S.est.find((x) => x.id === l.est),
      n = dias(validade(l));
    return `<tr><td data-label="EOL">${e.eol}</td><td data-label="Estudante">${esc(iniciais(e.nome))}, ${esc(e.turma)}</td><td data-label="Situação">${nomes[l.etapa]}</td><td data-label="Emitido em">${fmt(l.emitido)}</td><td data-label="Válido até">${fmt(validade(l))}${n < 0 ? ' <span class="st-atraso">(vencido)</span>' : n <= JANELA ? ' <span class="st-perto">(vence logo)</span>' : ""}</td><td><button class="bt-ico" data-abrir="${e.id}" data-aba="alimentacao" data-tip="Abrir laudo" aria-label="Abrir laudo de ${esc(iniciais(e.nome))}">${ICONE.ficha}</button></td></tr>`;
  }).join("")}</tbody></table></div>`;
}
