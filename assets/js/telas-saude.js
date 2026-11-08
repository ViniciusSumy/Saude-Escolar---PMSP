/* Fichas de saúde B e E (prazo de 30 dias após a matrícula) e a tela com a lista delas */
"use strict";

// Pergunta de sim ou não, com dois botões de rádio.
const simnao = (nome, leg, val, ajuda) =>
  `<fieldset><legend>${leg}</legend>${ajuda ? `<p class="ajuda u-mt0">${ajuda}</p>` : ""}<div class="chk"><input type="radio" name="${nome}" id="${nome}-s" value="s" ${val === true ? "checked" : ""}><label for="${nome}-s">Sim</label></div><div class="chk"><input type="radio" name="${nome}" id="${nome}-n" value="n" ${val === false ? "checked" : ""}><label for="${nome}-n">Não</label></div></fieldset>`;
// Converte verdadeiro/falso em "Sim"/"Não".
const sn = (v) => (v ? "Sim" : "Não");
// Situação da ficha do estudante: [classe de cor, texto]. "perto" = precisa de ação; "ok" = em dia.
function situacaoFicha(e) {
  if (e.fb.status !== "concluida") return ["perto", "Ficha B pendente"];
  if (e.fe && e.fe.status === "aberta") return ["perto", "Ficha E aberta"];
  if (e.fe) return ["ok", "Ficha E concluída"];
  return ["ok", "Ficha B concluída"];
}

// Aba Ficha de saúde. Ficha B: triagem de saúde de todos os estudantes. Ficha E: estudantes com deficiência, TGD ou altas habilidades, aberta quando a Ficha B indica.
// Prazo: 30 dias após a matrícula (Instrução Normativa SME nº 28/2024, mantida na nº 37/2025).
function painelSaude(e) {
  const b = e.fb,
    f = e.fe,
    pz = addDias(e.matricula, 30),
    np = dias(pz),
    sit = situacaoFicha(e),
    editB = b.status !== "concluida";
  const etapa = editB ? 0 : f && f.status === "aberta" ? 1 : 2;
  let h = `<ol class="trilha" aria-label="Etapas da ficha de saúde"><li class="${etapa > 0 ? "feito" : ""}" ${etapa === 0 ? 'aria-current="step"' : ""}>Ficha B: triagem com a família</li>${b.nee || f ? `<li class="${etapa > 1 ? "feito" : ""}" ${etapa === 1 ? 'aria-current="step"' : ""}>Ficha E: apoios necessários</li>` : ""}<li ${etapa === 2 ? 'aria-current="step"' : ""}>Ficha de saúde concluída</li></ol>
  <div class="grade"><div class="folha u-m0"><p><span class="carimbo ${sit[0]} u-inline"><b>${sit[1]}</b></span></p>
    <dl>${dado("Matrícula em", fmt(e.matricula))}${dado("Prazo para a ficha (30 dias após a matrícula)", fmt(pz) + (etapa < 2 ? (np < 0 ? ", vencido" : ", faltam " + np + " dias") : ""))}</dl>
    <p class="nota">Ficha B: triagem de saúde de todos os estudantes. Ficha E: estudantes com deficiência, transtorno global do desenvolvimento (TGD) ou altas habilidades, com os apoios de que precisam.</p></div>`;
  if (editB) {
    h += `<form id="f-fichab" data-est="${e.id}" class="folha u-m0"><h2 class="u-mt0">Ficha B</h2>
      <dl>${dado("Estudante", e.nome)}${dado("Nascimento e turma", fmt(e.nasc) + ", " + e.turma)}${dado("Vacinação", !e.dvaEm ? "Sem DVA na ficha" : "DVA recebida em " + fmt(e.dvaEm))}</dl>
      ${simnao("fb-trat", "Faz tratamento de saúde que precisa de cuidado na escola?", b.trat)}
      ${campo("Cuidados que a escola precisa ter", "fb-cuid", b.cuidado || "", "O que fazer, sem diagnóstico.", 1, 300)}
      ${simnao("fb-alg", "Tem alergia a medicamento, alimento, inseto ou outro?", b.alg)}
      ${campo("Quais alergias", "fb-algq", e.alerg || "")}
      <div class="chk"><input type="checkbox" id="fb-alim" ${b.alim ? "checked" : ""}><label for="fb-alim">Tem alergia ou restrição alimentar: a escola vai precisar do laudo de dieta</label></div>
      ${simnao("fb-med", "Usa medicação contínua ou precisa de orientação de primeiros socorros?", b.med, "O medicamento e a orientação de emergência ficam na aba Cuidados e emergência.")}
      ${simnao("fb-nee", "A família informou deficiência, TGD ou altas habilidades?", b.nee, "Se sim, o sistema abre a Ficha E. Não registre o diagnóstico.")}
      ${campo("Quem informou", "fb-inf", b.informante || "", "Exemplo: mãe, na matrícula.")}
      <p class="erro" id="erro-fb" role="alert"></p><button class="bt" type="submit">Concluir Ficha B</button></form></div>`;
  } else {
    h += `<div class="folha u-m0"><h2 class="u-mt0">Ficha B</h2><p class="ajuda u-mt0">Concluída em ${fmt(b.em)} por ${esc(b.por)}. Informado por: ${esc(b.informante || "não registrado")}.</p>
      <dl>${dado("Tratamento que pede cuidado na escola", sn(b.trat) + (b.cuidado ? ": " + b.cuidado : ""))}${dado("Alergias", sn(b.alg) + (b.alg && e.alerg ? ": " + e.alerg : "") + (b.alim ? " (alimentar)" : ""))}${dado("Medicação contínua ou primeiros socorros", sn(b.med))}${dado("Deficiência, TGD ou altas habilidades", sn(b.nee))}</dl>
      <button class="bt sec peq" data-refazer="b" data-est="${e.id}">Atualizar Ficha B</button></div></div>`;
    if (f) {
      if (f.status === "aberta")
        h += `<form id="f-fichae" data-est="${e.id}" class="folha u-mt4"><h2 class="u-mt0">Ficha E</h2><p class="ajuda u-mt0">Aberta em ${fmt(f.abertaEm)} a partir da Ficha B.</p>
        ${campo("Apoios necessários na escola", "fe-apoio", f.apoios || "", "Exemplo: rotina previsível, apoio visual, tempo extra, acompanhamento na alimentação. Sem diagnóstico.", 1, 500)}
        ${campo("Cuidados de saúde específicos na escola", "fe-cuid", f.cuidados || "", "Se houver. Para emergência, use também a aba Cuidados e emergência.", 1, 400)}
        ${campo("Acompanhamento fora da escola", "fe-acomp", f.acomp || "", "Exemplo: UBS, NAAPA, centro especializado.")}
        <p class="erro" id="erro-fe" role="alert"></p><button class="bt" type="submit">Concluir Ficha E</button></form>`;
      else
        h += `<div class="folha u-mt4"><h2 class="u-mt0">Ficha E</h2><p class="ajuda u-mt0">Concluída em ${fmt(f.em)} por ${esc(f.por)}.</p>
        <dl>${dado("Apoios necessários na escola", f.apoios)}${dado("Cuidados de saúde específicos", f.cuidados)}${dado("Acompanhamento fora da escola", f.acomp)}</dl>
        <button class="bt sec peq" data-refazer="e" data-est="${e.id}">Atualizar Ficha E</button></div>`;
    }
  }
  h += `<p class="nota">Fichas previstas na Portaria SME nº 3.056/2004; prazo de 30 dias após a matrícula pela Instrução Normativa SME nº 28/2024. Os campos são provisórios: o modelo oficial das fichas não está publicado na página da portaria. A ficha registra o que a família informa e não substitui avaliação de profissional de saúde.</p>`;
  return h;
}

// Tela Fichas de saúde: lista da unidade ordenada por inserção. Primeiro as com Ficha B pendente, depois as com Ficha E aberta, depois as concluídas; em cada grupo, pelo prazo.
function telaFichas() {
  const o = (x) => (x.fb.status !== "concluida" ? 0 : x.fe && x.fe.status === "aberta" ? 1 : 2);
  const V = ordenarInsercao(
    visiveis(),
    (x) => o(x) * 100000 + dias(addDias(x.matricula, 30)),
  ).lista;
  const pend = V.filter((e) => situacaoFicha(e)[0] !== "ok").length;
  return `<h1 tabindex="-1">Fichas de saúde</h1><p class="lead">${pend ? `${pend} ${pend === 1 ? "ficha precisa" : "fichas precisam"} de atenção.` : "Todas as fichas estão concluídas."} O prazo é de 30 dias após a matrícula.</p>
  <div class="rolagem"><table class="tb cartoes"><thead><tr><th scope="col">EOL</th><th scope="col">Estudante</th><th scope="col">Situação</th><th scope="col">Prazo</th><th scope="col"><span class="vh">Ação</span></th></tr></thead><tbody>
  ${V.map((e) => {
    const s = situacaoFicha(e),
      pz = addDias(e.matricula, 30),
      n = dias(pz);
    return `<tr><td data-label="EOL">${e.eol}</td><td data-label="Estudante">${esc(iniciais(e.nome))}, ${esc(e.turma)}</td><td data-label="Situação">${s[1]}</td><td data-label="Prazo">${s[0] === "ok" ? "—" : fmt(pz) + (n < 0 ? ' <span class="st-atraso">(vencido)</span>' : "")}</td><td><button class="bt-ico" data-abrir="${e.id}" data-aba="saude" data-tip="Abrir ficha de saúde" aria-label="Abrir ficha de saúde de ${esc(iniciais(e.nome))}">${ICONE.ficha}</button></td></tr>`;
  }).join("")}</tbody></table></div>`;
}
