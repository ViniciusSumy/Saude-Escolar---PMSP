/* Ficha do estudante: abas Ficha de saúde, Cuidados, Alimentação, Vacinação, Apoio, Observações e Contato.
   Ficha de saúde e Alimentação ficam em telas-saude.js e telas-laudos.js. */
"use strict";

// Ficha de um estudante: cabeçalho, abas (role tablist) e o painel da aba escolhida. O acesso é registrado em ir() (script.js).
function telaFicha() {
  const e = S.est.find((x) => x.id === rota.id),
    p = sessao.perfil,
    abas = ABAS[p];
  if (!rota.aba || !abas.includes(rota.aba)) rota.aba = abas[0];
  const P = pendencias().filter((x) => x.e === e);
  return `<p class="nao-imprime u-mb2"><button class="bt sec peq" data-ir="estudantes">Voltar à lista</button></p>
  <h1 tabindex="-1">${esc(e.nome)}</h1><p class="lead">${p === "UBS" ? "CNS " + e.cns : "EOL " + e.eol}${escola(p) ? ", " + esc(e.turma) : ""}, ${idade(e.nasc)}. Este acesso fica no registro.</p>
  <div role="tablist" aria-label="Seções da ficha">${abas
    .map((k) => {
      const n = P.filter((x) => x.aba === k).length;
      return `<button role="tab" id="tab-${k}" aria-controls="painel" aria-selected="${k === rota.aba}" tabindex="${k === rota.aba ? 0 : -1}" data-aba-ficha="${k}">${NOME_ABA[k]}${n ? ` <span class="contagem" aria-label="${n} pendente${n > 1 ? "s" : ""}">${n}</span>` : ""}</button>`;
    })
    .join("")}</div>
  <div role="tabpanel" id="painel" aria-labelledby="tab-${rota.aba}" tabindex="0">${painel(e, rota.aba)}</div>`;
}

// Campo de texto (ou área de texto, se "area" for verdadeiro) com rótulo e texto de ajuda.
const campo = (rot, id, val, ajuda, area, max) =>
  `<label class="campo"><span>${rot}</span>${area ? `<textarea id="${id}" maxlength="${max || 500}">${esc(val)}</textarea>` : `<input type="text" id="${id}" value="${esc(val)}">`}${ajuda ? `<small>${ajuda}</small>` : ""}</label>`;
// Par rótulo/valor para lista de dados. Sem valor mostra "Nada registrado."
const dado = (rot, val) =>
  `<div class="par"><dt>${rot}</dt><dd>${val ? esc(val) : "Nada registrado."}</dd></div>`;

// Escolhe a função que desenha o painel da aba. Aba desconhecida devolve texto vazio.
function painel(e, aba) {
  const paineis = {
    saude: painelSaude,
    cuidados: painelCuidados,
    alimentacao: painelLaudo,
    vacina: painelVacina,
    apoio: painelApoio,
    obs: painelObservacoes,
    contato: painelContato,
  };
  return paineis[aba] ? paineis[aba](e) : "";
}

// Aba Cuidados e emergência: alergias, medicamentos, orientação de emergência por escrito e acesso ao cartão de cuidado.
function painelCuidados(e) {
  return `<div class="grade"><form id="f-cuidados" data-est="${e.id}" class="folha u-m0"><h2 class="u-mt0">Cuidados na escola</h2>
      ${campo("Alergias e restrições", "c-alerg", e.alerg)}
      <div class="chk"><input type="checkbox" id="c-grave" ${e.grave ? "checked" : ""}><label for="c-grave">Pode precisar de atendimento de emergência na escola</label></div>
      ${campo("Medicamentos usados na escola", "c-meds", e.meds, "Inclua onde o medicamento fica guardado.")}
      ${campo("O que fazer em emergência", "c-plano", e.plano, "Copie a orientação escrita que a família trouxe, do médico ou da UBS, em passos simples. Não registre diagnóstico.", 1, 600)}
      ${campo("De onde veio a orientação", "c-fonte", e.planoFonte || "", "Exemplo: orientação escrita da UBS, entregue pela mãe.")}
      <div class="linha-bt"><button class="bt" type="submit">Salvar cuidados</button></div></form>
    <div class="folha"><h2 class="u-mt0">Cartão de cuidado</h2><p>Resumo para o professor deixar na sala, sem diagnóstico.</p>
      ${e.plano ? `<p class="ajuda">Orientação registrada por ${esc(e.planoPor)} em ${fmt(e.planoEm)}${e.planoFonte ? ". Fonte: " + esc(e.planoFonte) : ""}.</p>` : `<p class="${e.grave ? "alerta" : "ajuda"}">${e.grave ? "Ainda sem orientação por escrito. Até chegar, siga o combinado com a família e chame o SAMU (192) se precisar." : "Sem orientação de emergência registrada."}</p>`}
      <div class="linha-bt"><button class="bt" data-cartao="${e.id}">Ver cartão de cuidado para a sala</button></div></div></div>`;
}

// Aba Vacinação (DVA): situação da DVA e da data de retorno à UBS, e formulário para registrar uma nova DVA.
function painelVacina(e) {
  const n = dias(e.retorno);
  const sit = !e.dvaEm
    ? ["atraso", "Sem DVA"]
    : !e.retorno
      ? ["ok", "DVA em dia, sem retorno marcado"]
      : n < 0
        ? ["atraso", "Retorno à UBS vencido"]
        : n <= JANELA
          ? ["perto", "Retorno à UBS próximo"]
          : ["ok", "DVA em dia"];
  const pedir = !e.dvaEm || (e.retorno && n <= JANELA);
  return `<div class="grade"><div class="folha u-m0"><p><span class="carimbo ${sit[0]} u-inline"><b>${sit[1]}</b></span></p>
      <dl>${dado("DVA recebida em", e.dvaEm ? fmt(e.dvaEm) : "")}${dado("Data de retorno à UBS (conforme a DVA)", e.retorno ? fmt(e.retorno) : "")}</dl>
      ${pedir ? `<a class="bt-ico wa u-mt1" data-tip="Pedir a DVA pelo WhatsApp" aria-label="Pedir a DVA pelo WhatsApp (abre em nova janela)" href="${linkWA(e, `Olá, aqui é a ${UE_NOME}. Pode levar ${primeiro(e.nome)} a uma UBS para conferir a caderneta de vacinação e trazer a Declaração de Vacinação Atualizada (DVA) à escola? Obrigado.`)}" target="_blank" rel="noopener" data-wa="${e.id}">${ICONE.mensagem}</a>` : ""}</div>
    <form id="f-vacina" data-est="${e.id}" class="folha u-m0"><h2 class="u-mt0">Registrar nova DVA</h2>
      <label class="campo"><span>DVA recebida em</span><input type="date" id="v-dva" value="${hoje()}"></label>
      <label class="campo"><span>Data de retorno à UBS</span><input type="date" id="v-ret"><small>A data escrita na DVA, a mesma que vai para o EOL. Deixe em branco se a DVA não marcar retorno.</small></label>
      <p class="erro" id="erro-dva" role="alert"></p><button class="bt" type="submit">Registrar DVA</button></form></div>
    <p class="nota">A DVA é emitida pela UBS e entregue pela família. A escola registra só quando recebeu e a data de retorno; o histórico de doses fica com a saúde.</p>`;
}

// Aba Apoio e NAAPA: a Gestão edita o que ajuda na sala e registra a devolutiva; os dois perfis criam encaminhamentos.
function painelApoio(e) {
  const p = sessao.perfil;
  let h = "";
  if (p === "ADE")
    h += `<form id="f-apoio" data-est="${e.id}">${campo("O que ajuda na sala", "a-texto", e.apoio, "Estratégias combinadas com o NAAPA. Não registre diagnóstico: o apoio pedagógico não depende de laudo.", 1, 400)}
      <label class="campo"><span>Próxima revisão com o NAAPA</span><input type="date" id="a-rev" value="${e.apoioRev || ""}"></label><div class="linha-bt"><button class="bt" type="submit">Salvar plano de apoio</button></div></form>`;
  else
    h += `<div class="folha"><h2 class="u-mt0">O que ajuda na sala</h2>${e.apoio ? `<p class="u-pre">${esc(e.apoio)}</p><p class="ajuda">Próxima revisão com o NAAPA: ${fmt(e.apoioRev)}.</p>` : "<p>Nenhum plano de apoio registrado.</p>"}</div>`;
  h += `<h2>Encaminhamentos ao NAAPA</h2>`;
  h += e.enc.length
    ? `<ul class="hist">${e.enc
        .map(
          (
            x,
            i,
          ) => `<li><small>${fmt(x.d)}, ${esc(x.de)}. Situação: <b>${esc(x.status)}</b></small>${esc(x.t)}${x.dev ? `<br><small>Devolutiva: ${esc(x.dev)}</small>` : ""}
      ${p === "ADE" ? `<form class="f-dev" data-est="${e.id}" data-i="${i}"><label class="campo"><span>Situação</span><select id="d-s${i}">${["Enviado", "Em reunião de caso", "Devolutiva registrada"].map((o) => `<option ${o === x.status ? "selected" : ""}>${o}</option>`).join("")}</select></label>${campo("Devolutiva recebida do NAAPA", "d-t" + i, x.dev, "Curta, sem diagnóstico.", 1, 300)}<button class="bt sec peq" type="submit">Registrar devolutiva</button></form>` : ""}</li>`,
        )
        .join("")}</ul>`
    : `<p class="vazio">Nenhum encaminhamento.</p>`;
  h += `<form id="f-enc" data-est="${e.id}">${campo("Novo encaminhamento", "n-enc", "", "Descreva o que foi observado na escola, sem hipótese de diagnóstico. O NAAPA responde na reunião de caso.", 1, 500)}<div class="linha-bt"><button class="bt" type="submit">Encaminhar ao NAAPA</button></div></form>
      <p class="nota">Nesta fase o NAAPA não entra no sistema: a gestão registra a devolutiva recebida na reunião de caso.</p>`;
  return h;
}

// Aba Observações da escola: fatos observados, sem diagnóstico.
function painelObservacoes(e) {
  return `${e.obs.length ? `<ul class="hist">${e.obs.map((o) => `<li><small>${fmt(o.d)}, ${esc(o.por || "")}</small>${esc(o.t)}</li>`).join("")}</ul>` : `<p class="vazio">Nenhuma observação.</p>`}
    <form id="f-obs" data-est="${e.id}">${campo("Nova observação pedagógica", "n-obs", "", "Registre fatos observados, não diagnósticos.", 1, 500)}<div class="linha-bt"><button class="bt" type="submit">Registrar observação</button></div></form>`;
}

// Aba Contato da família: responsável, telefone e link do WhatsApp.
function painelContato(e) {
  return `<dl class="folha">${dado("Responsável", e.resp)}${dado("Telefone", e.tel)}</dl>
    <div class="linha-bt"><a class="bt-ico wa" data-tip="Enviar mensagem pelo WhatsApp" aria-label="Enviar mensagem pelo WhatsApp (abre em nova janela)" href="${linkWA(e, `Olá, aqui é a ${UE_NOME}. Precisamos conversar sobre ${primeiro(e.nome)}. Pode nos retornar?`)}" target="_blank" rel="noopener" data-wa="${e.id}">${ICONE.mensagem}</a></div>
    <p class="nota">As mensagens prontas não levam nenhuma informação de saúde. Se o link não abrir, ligue para ${esc(e.tel)}.</p>`;
}
