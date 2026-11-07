/* Telas: login, Hoje, estudantes, ficha, fichas de saúde, laudos, experimento, privacidade */
"use strict";
/* ---------- Telas ---------- */
const NAV={ATE:[["hoje","Hoje"],["estudantes","Estudantes"],["fichas","Fichas de saúde"],["laudos","Laudos de dieta"],["experimento","Experimento"],["privacidade","Privacidade e fontes"]],
  ADE:[["hoje","Hoje"],["estudantes","Estudantes"],["fichas","Fichas de saúde"],["laudos","Laudos de dieta"],["registro","Registro de acessos"],["experimento","Experimento"],["privacidade","Privacidade e fontes"]]};
function desenharNav(){const n=$("#nav");if(!sessao){n.hidden=true;return}n.hidden=false;
  n.innerHTML=NAV[sessao.perfil].map(([k,t])=>`<button data-ir="${k}" ${rota.v===k||(rota.v==="ficha"&&k==="estudantes")||(rota.v==="cartao"&&k==="estudantes")?'aria-current="page"':""}>${t}</button>`).join("")}

const CURTO={ATE:"Cobra as famílias e registra o que chega: laudos, DVA, fichas e orientações.",ADE:"Faz o que a secretaria faz, confere e envia os laudos à CODAE e acompanha tudo."};
function telaLogin(){
  return `<div class="login"><section class="entrada" aria-labelledby="t-entrada">
    <h1 id="t-entrada" tabindex="-1">Cobranças do dia, laudos e fichas de saúde num só lugar</h1>
    <p class="lead">Protótipo para a secretaria e a gestão de uma escola municipal. Escolha uma conta de demonstração para preencher o acesso. <button type="button" class="link-aviso" id="abrir-aviso">Sobre este protótipo</button></p>
    <h2 class="vh">Contas de demonstração</h2>
    <ul class="contas">${Object.entries(USUARIOS).map(([u,c])=>`<li><button type="button" data-conta="${u}"><b>${c.cargo}</b><span>${CURTO[c.perfil]}</span><small>Usar a conta ${u}</small></button></li>`).join("")}</ul></section>
  <form class="folha" id="f-login" novalidate><h2>Entrar</h2>
    <label class="campo"><span>Usuário</span><input type="text" id="usuario" name="usuario" autocomplete="username" required></label>
    <label class="campo"><span>Senha</span><input type="password" id="senha" name="senha" autocomplete="current-password" required><small>Nas contas de demonstração, a senha é demo123.</small></label>
    <p class="erro" id="erro-login" role="alert"></p>
    <button class="bt u-w100" type="submit">Entrar</button></form></div>`}

let filtroHoje="";
const FILTROS_HOJE={vencidas:["r-atraso","vencidas",x=>x.prazo&&dias(x.prazo)<0],proximas:["r-perto","nos próximos 30 dias",x=>x.prazo&&dias(x.prazo)>=0],semprazo:["r-neutro","sem prazo",x=>!x.prazo]};
function telaHoje(){
  const P=pendencias(),p=sessao.perfil,meus=P.filter(x=>x.dono===p);
  const dataLonga=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
  const f=filtroHoje?FILTROS_HOJE[filtroHoje][2]:()=>true;
  let h=`<h1 tabindex="-1">Hoje, ${esc(dataLonga)}</h1><p class="lead">${meus.length?`Você tem ${meus.length} ${meus.length===1?"cobrança":"cobranças"}. As mais urgentes vêm primeiro.`:"Nada para cobrar hoje."} Unidade ${UE} ${UE_NOME}.</p>`;
  if(meus.length)h+=`<div class="resumo" role="group" aria-label="Filtrar cobranças">${Object.entries(FILTROS_HOJE).map(([k,[cl,txt,fn]])=>{const n=meus.filter(fn).length;return `<button type="button" class="${cl}" data-filtro="${k}" aria-pressed="${filtroHoje===k}"><b>${n}</b><span>${txt}</span></button>`}).join("")}</div>${filtroHoje?`<p class="ajuda">Mostrando só as cobranças ${FILTROS_HOJE[filtroHoje][1]}. <button type="button" class="link-aviso" data-filtro="${filtroHoje}">Mostrar todas</button></p>`:""}`;
  h+=grupo("Para você",meus.filter(f),true);
  if(p==="ADE")h+=grupo("Com a secretaria",P.filter(x=>x.dono==="ATE").filter(f),false,"Você acompanha e pode agir se precisar.");
  if(p==="ATE"){const n=P.filter(x=>x.dono==="ADE"&&x.tipo==="laudo").length;if(n)h+=`<p class="nota">${n} ${n===1?"laudo aguarda":"laudos aguardam"} conferência da gestão.</p>`}
  return h}
function grupo(titulo,L,dono,sub){
  return `<section class="grupo" aria-labelledby="g-${titulo.length}"><h2 id="g-${titulo.length}">${titulo} <span class="contagem">${L.length}</span></h2>${sub?`<p class="lead">${sub}</p>`:""}${L.length?`<ul class="cobrancas">${L.map(x=>itemCobranca(x,dono)).join("")}</ul>`:`<p class="vazio">Nenhuma cobrança aqui.</p>`}</section>`}

let filtroTurma="",busca="",ordem="eol",ultimaBusca=null;
const ORDENS={eol:["Código EOL",e=>Number(e.eol)],turma:["Turma",e=>e.turma+" "+e.eol],pend:["Mais cobranças",null]};
function telaEstudantes(){
  const p=sessao.perfil,P=pendencias(),V=visiveis();
  const nPend=e=>P.filter(x=>x.e===e&&(x.dono===p||p==="ADE")).length;
  const turmas=ordenarInsercao([...new Set(V.map(e=>e.turma))],t=>t).lista;
  const F=V.filter(e=>(!filtroTurma||e.turma===filtroTurma));
  const ch=ordem==="pend"?(e=>-nPend(e)*10000000+Number(e.eol)):ORDENS[ordem][1];
  const R=ordenarInsercao(F,ch),L=R.lista;
  return `<h1 tabindex="-1">Estudantes</h1><p class="lead">Busque pelo código EOL ou filtre por turma.</p>
  <form id="f-busca" class="folha filtros">
    <label class="campo"><span>Código EOL</span><input type="text" id="busca" inputmode="numeric" autocomplete="off" value="${esc(busca)}" placeholder="Exemplo: 1000001"></label>
    <button class="bt" type="submit">Abrir ficha</button>
    <label class="campo"><span>Turma</span><select id="turma"><option value="">Todas</option>${turmas.map(t=>`<option ${t===filtroTurma?"selected":""}>${esc(t)}</option>`).join("")}</select></label>
    <label class="campo"><span>Ordenar por</span><select id="ordem">${Object.entries(ORDENS).map(([k,[t]])=>`<option value="${k}" ${k===ordem?"selected":""}>${t}</option>`).join("")}</select></label>
  </form><p class="erro" id="erro-busca" role="alert"></p>
  ${ultimaBusca?`<p class="nota" id="info-busca">${esc(ultimaBusca)}</p>`:""}
  <div class="rolagem"><table class="tb cartoes"><caption>${L.length} ${L.length===1?"estudante":"estudantes"}${filtroTurma?" na turma "+esc(filtroTurma):""}, em ordem de ${({eol:"código EOL",turma:"turma",pend:"número de cobranças"})[ordem]} (ordenação por inserção, ${R.comparacoes} comparações). Na lista aparecem só as iniciais.</caption>
  <thead><tr><th scope="col">EOL</th><th scope="col">Estudante</th><th scope="col">Turma</th><th scope="col">Cobranças</th><th scope="col"><span class="vh">Ação</span></th></tr></thead>
  <tbody>${L.map(e=>{const n=nPend(e);return `<tr><td data-label="EOL">${e.eol}</td><td data-label="Estudante">${esc(iniciais(e.nome))}</td><td data-label="Turma">${esc(e.turma)}</td><td data-label="Cobranças">${n?`<span class="contagem">${n}</span>`:"nenhuma"}</td><td><button class="bt-ico" data-abrir="${e.id}" data-tip="Abrir ficha" aria-label="Abrir ficha de ${esc(iniciais(e.nome))}">${ICONE.ficha}</button></td></tr>`}).join("")}</tbody></table></div>`}
function telaFicha(){
  const e=S.est.find(x=>x.id===rota.id),p=sessao.perfil,abas=ABAS[p];
  if(!rota.aba||!abas.includes(rota.aba))rota.aba=abas[0];
  const P=pendencias().filter(x=>x.e===e);
  return `<p class="nao-imprime u-mb2"><button class="bt sec peq" data-ir="estudantes">Voltar à lista</button></p>
  <h1 tabindex="-1">${esc(e.nome)}</h1><p class="lead">${p==="UBS"?"CNS "+e.cns:"EOL "+e.eol}${escola(p)?", "+esc(e.turma):""}, ${idade(e.nasc)}. Este acesso fica no registro.</p>
  <div role="tablist" aria-label="Seções da ficha">${abas.map(k=>{const n=P.filter(x=>x.aba===k).length;return `<button role="tab" id="tab-${k}" aria-controls="painel" aria-selected="${k===rota.aba}" tabindex="${k===rota.aba?0:-1}" data-aba-ficha="${k}">${NOME_ABA[k]}${n?` <span class="contagem" aria-label="${n} pendente${n>1?"s":""}">${n}</span>`:""}</button>`}).join("")}</div>
  <div role="tabpanel" id="painel" aria-labelledby="tab-${rota.aba}" tabindex="0">${painel(e,rota.aba)}</div>`}

const campo=(rot,id,val,ajuda,area,max)=>`<label class="campo"><span>${rot}</span>${area?`<textarea id="${id}" maxlength="${max||500}">${esc(val)}</textarea>`:`<input type="text" id="${id}" value="${esc(val)}">`}${ajuda?`<small>${ajuda}</small>`:""}</label>`;
const dado=(rot,val)=>`<div class="par"><dt>${rot}</dt><dd>${val?esc(val):"Nada registrado."}</dd></div>`;

function painel(e,aba){
  const p=sessao.perfil;
  if(aba==="saude")return painelSaude(e);
  if(aba==="cuidados")return `<div class="grade"><form id="f-cuidados" data-est="${e.id}" class="folha u-m0"><h2 class="u-mt0">Cuidados na escola</h2>
      ${campo("Alergias e restrições","c-alerg",e.alerg)}
      <div class="chk"><input type="checkbox" id="c-grave" ${e.grave?"checked":""}><label for="c-grave">Pode precisar de atendimento de emergência na escola</label></div>
      ${campo("Medicamentos usados na escola","c-meds",e.meds,"Inclua onde o medicamento fica guardado.")}
      ${campo("O que fazer em emergência","c-plano",e.plano,"Copie a orientação escrita que a família trouxe, do médico ou da UBS, em passos simples. Não registre diagnóstico.",1,600)}
      ${campo("De onde veio a orientação","c-fonte",e.planoFonte||"","Exemplo: orientação escrita da UBS, entregue pela mãe.")}
      <div class="linha-bt"><button class="bt" type="submit">Salvar cuidados</button></div></form>
    <div class="folha"><h2 class="u-mt0">Cartão de cuidado</h2><p>Resumo para o professor deixar na sala, sem diagnóstico.</p>
      ${e.plano?`<p class="ajuda">Orientação registrada por ${esc(e.planoPor)} em ${fmt(e.planoEm)}${e.planoFonte?". Fonte: "+esc(e.planoFonte):""}.</p>`:`<p class="${e.grave?"alerta":"ajuda"}">${e.grave?"Ainda sem orientação por escrito. Até chegar, siga o combinado com a família e chame o SAMU (192) se precisar.":"Sem orientação de emergência registrada."}</p>`}
      <div class="linha-bt"><button class="bt" data-cartao="${e.id}">Ver cartão de cuidado para a sala</button></div></div></div>`;
  if(aba==="alimentacao")return painelLaudo(e);
  if(aba==="vacina"){const n=dias(e.retorno);
    const sit=!e.dvaEm?["atraso","Sem DVA"]:!e.retorno?["ok","DVA em dia, sem retorno marcado"]:n<0?["atraso","Retorno à UBS vencido"]:n<=JANELA?["perto","Retorno à UBS próximo"]:["ok","DVA em dia"];
    const pedir=!e.dvaEm||(e.retorno&&n<=JANELA);
    return `<div class="grade"><div class="folha u-m0"><p><span class="carimbo ${sit[0]} u-inline"><b>${sit[1]}</b></span></p>
      <dl>${dado("DVA recebida em",e.dvaEm?fmt(e.dvaEm):"")}${dado("Data de retorno à UBS (conforme a DVA)",e.retorno?fmt(e.retorno):"")}</dl>
      ${pedir?`<a class="bt-ico wa u-mt1" data-tip="Pedir a DVA pelo WhatsApp" aria-label="Pedir a DVA pelo WhatsApp (abre em nova janela)" href="${linkWA(e,`Olá, aqui é a ${UE_NOME}. Pode levar ${primeiro(e.nome)} a uma UBS para conferir a caderneta de vacinação e trazer a Declaração de Vacinação Atualizada (DVA) à escola? Obrigado.`)}" target="_blank" rel="noopener" data-wa="${e.id}">${ICONE.mensagem}</a>`:""}</div>
    <form id="f-vacina" data-est="${e.id}" class="folha u-m0"><h2 class="u-mt0">Registrar nova DVA</h2>
      <label class="campo"><span>DVA recebida em</span><input type="date" id="v-dva" value="${hoje()}"></label>
      <label class="campo"><span>Data de retorno à UBS</span><input type="date" id="v-ret"><small>A data escrita na DVA, a mesma que vai para o EOL. Deixe em branco se a DVA não marcar retorno.</small></label>
      <p class="erro" id="erro-dva" role="alert"></p><button class="bt" type="submit">Registrar DVA</button></form></div>
    <p class="nota">A DVA é emitida pela UBS e entregue pela família. A escola registra só quando recebeu e a data de retorno; o histórico de doses fica com a saúde.</p>`}
  if(aba==="apoio"){
    let h="";
    if(p==="ADE")h+=`<form id="f-apoio" data-est="${e.id}">${campo("O que ajuda na sala","a-texto",e.apoio,"Estratégias combinadas com o NAAPA. Não registre diagnóstico: o apoio pedagógico não depende de laudo.",1,400)}
      <label class="campo"><span>Próxima revisão com o NAAPA</span><input type="date" id="a-rev" value="${e.apoioRev||""}"></label><div class="linha-bt"><button class="bt" type="submit">Salvar plano de apoio</button></div></form>`;
    else h+=`<div class="folha"><h2 class="u-mt0">O que ajuda na sala</h2>${e.apoio?`<p class="u-pre">${esc(e.apoio)}</p><p class="ajuda">Próxima revisão com o NAAPA: ${fmt(e.apoioRev)}.</p>`:"<p>Nenhum plano de apoio registrado.</p>"}</div>`;
    h+=`<h2>Encaminhamentos ao NAAPA</h2>`;
    h+=e.enc.length?`<ul class="hist">${e.enc.map((x,i)=>`<li><small>${fmt(x.d)}, ${esc(x.de)}. Situação: <b>${esc(x.status)}</b></small>${esc(x.t)}${x.dev?`<br><small>Devolutiva: ${esc(x.dev)}</small>`:""}
      ${p==="ADE"?`<form class="f-dev" data-est="${e.id}" data-i="${i}"><label class="campo"><span>Situação</span><select id="d-s${i}">${["Enviado","Em reunião de caso","Devolutiva registrada"].map(o=>`<option ${o===x.status?"selected":""}>${o}</option>`).join("")}</select></label>${campo("Devolutiva recebida do NAAPA","d-t"+i,x.dev,"Curta, sem diagnóstico.",1,300)}<button class="bt sec peq" type="submit">Registrar devolutiva</button></form>`:""}</li>`).join("")}</ul>`:`<p class="vazio">Nenhum encaminhamento.</p>`;
    h+=`<form id="f-enc" data-est="${e.id}">${campo("Novo encaminhamento","n-enc","","Descreva o que foi observado na escola, sem hipótese de diagnóstico. O NAAPA responde na reunião de caso.",1,500)}<div class="linha-bt"><button class="bt" type="submit">Encaminhar ao NAAPA</button></div></form>
      <p class="nota">Nesta fase o NAAPA não entra no sistema: a gestão registra a devolutiva recebida na reunião de caso.</p>`;
    return h}
  if(aba==="obs")return `${e.obs.length?`<ul class="hist">${e.obs.map(o=>`<li><small>${fmt(o.d)}, ${esc(o.por||"")}</small>${esc(o.t)}</li>`).join("")}</ul>`:`<p class="vazio">Nenhuma observação.</p>`}
    <form id="f-obs" data-est="${e.id}">${campo("Nova observação pedagógica","n-obs","","Registre fatos observados, não diagnósticos.",1,500)}<div class="linha-bt"><button class="bt" type="submit">Registrar observação</button></div></form>`;
  if(aba==="contato")return `<dl class="folha">${dado("Responsável",e.resp)}${dado("Telefone",e.tel)}</dl>
    <div class="linha-bt"><a class="bt-ico wa" data-tip="Enviar mensagem pelo WhatsApp" aria-label="Enviar mensagem pelo WhatsApp (abre em nova janela)" href="${linkWA(e,`Olá, aqui é a ${UE_NOME}. Precisamos conversar sobre ${primeiro(e.nome)}. Pode nos retornar?`)}" target="_blank" rel="noopener" data-wa="${e.id}">${ICONE.mensagem}</a></div>
    <p class="nota">As mensagens prontas não levam nenhuma informação de saúde. Se o link não abrir, ligue para ${esc(e.tel)}.</p>`;
  return ""}

/* ---------- Jornada do laudo de dieta (IT CODAE 04/2023) ---------- */
const ETAPAS=[["recebido","Recebido na escola"],["conferido","Conferido"],["enviado","Enviado à CODAE"],["aprovado","Aprovado"]];
const CONFERE=[
  ["legivel","A prescrição está legível"],
  ["nome","Traz o nome completo do estudante"],
  ["data","Foi emitido há menos de 12 meses"],
  ["diag","Traz diagnóstico, hipótese diagnóstica ou CID (conferir, sem copiar para a ficha)"],
  ["lista","Lista os alimentos permitidos e os proibidos"],
  ["prof","Identifica o profissional: nome, carimbo com registro e assinatura"]
];
const simnao=(nome,leg,val,ajuda)=>`<fieldset><legend>${leg}</legend>${ajuda?`<p class="ajuda u-mt0">${ajuda}</p>`:""}<div class="chk"><input type="radio" name="${nome}" id="${nome}-s" value="s" ${val===true?"checked":""}><label for="${nome}-s">Sim</label></div><div class="chk"><input type="radio" name="${nome}" id="${nome}-n" value="n" ${val===false?"checked":""}><label for="${nome}-n">Não</label></div></fieldset>`;
const sn=v=>v?"Sim":"Não";
function situacaoFicha(e){
  if(e.fb.status!=="concluida")return ["perto","Ficha B pendente"];
  if(e.fe&&e.fe.status==="aberta")return ["perto","Ficha E aberta"];
  if(e.fe)return ["ok","Ficha E concluída"];
  return ["ok","Ficha B concluída"];
}
function painelSaude(e){
  const b=e.fb,f=e.fe,pz=addDias(e.matricula,30),np=dias(pz),sit=situacaoFicha(e),editB=b.status!=="concluida";
  const etapa=editB?0:(f&&f.status==="aberta")?1:2;
  let h=`<ol class="trilha" aria-label="Etapas da ficha de saúde"><li class="${etapa>0?"feito":""}" ${etapa===0?'aria-current="step"':""}>Ficha B: triagem com a família</li>${b.nee||f?`<li class="${etapa>1?"feito":""}" ${etapa===1?'aria-current="step"':""}>Ficha E: apoios necessários</li>`:""}<li ${etapa===2?'aria-current="step"':""}>Ficha de saúde concluída</li></ol>
  <div class="grade"><div class="folha u-m0"><p><span class="carimbo ${sit[0]} u-inline"><b>${sit[1]}</b></span></p>
    <dl>${dado("Matrícula em",fmt(e.matricula))}${dado("Prazo para a ficha (30 dias após a matrícula)",fmt(pz)+(etapa<2?(np<0?", vencido":", faltam "+np+" dias"):""))}</dl>
    <p class="nota">Ficha B: triagem de saúde de todos os estudantes. Ficha E: estudantes com deficiência, transtorno global do desenvolvimento (TGD) ou altas habilidades, com os apoios de que precisam.</p></div>`;
  if(editB){
    h+=`<form id="f-fichab" data-est="${e.id}" class="folha u-m0"><h2 class="u-mt0">Ficha B</h2>
      <dl>${dado("Estudante",e.nome)}${dado("Nascimento e turma",fmt(e.nasc)+", "+e.turma)}${dado("Vacinação",!e.dvaEm?"Sem DVA na ficha":"DVA recebida em "+fmt(e.dvaEm))}</dl>
      ${simnao("fb-trat","Faz tratamento de saúde que precisa de cuidado na escola?",b.trat)}
      ${campo("Cuidados que a escola precisa ter","fb-cuid",b.cuidado||"","O que fazer, sem diagnóstico.",1,300)}
      ${simnao("fb-alg","Tem alergia a medicamento, alimento, inseto ou outro?",b.alg)}
      ${campo("Quais alergias","fb-algq",e.alerg||"")}
      <div class="chk"><input type="checkbox" id="fb-alim" ${b.alim?"checked":""}><label for="fb-alim">Tem alergia ou restrição alimentar: a escola vai precisar do laudo de dieta</label></div>
      ${simnao("fb-med","Usa medicação contínua ou precisa de orientação de primeiros socorros?",b.med,"O medicamento e a orientação de emergência ficam na aba Cuidados e emergência.")}
      ${simnao("fb-nee","A família informou deficiência, TGD ou altas habilidades?",b.nee,"Se sim, o sistema abre a Ficha E. Não registre o diagnóstico.")}
      ${campo("Quem informou","fb-inf",b.informante||"","Exemplo: mãe, na matrícula.")}
      <p class="erro" id="erro-fb" role="alert"></p><button class="bt" type="submit">Concluir Ficha B</button></form></div>`;
  } else {
    h+=`<div class="folha u-m0"><h2 class="u-mt0">Ficha B</h2><p class="ajuda u-mt0">Concluída em ${fmt(b.em)} por ${esc(b.por)}. Informado por: ${esc(b.informante||"não registrado")}.</p>
      <dl>${dado("Tratamento que pede cuidado na escola",sn(b.trat)+(b.cuidado?": "+b.cuidado:""))}${dado("Alergias",sn(b.alg)+(b.alg&&e.alerg?": "+e.alerg:"")+(b.alim?" (alimentar)":""))}${dado("Medicação contínua ou primeiros socorros",sn(b.med))}${dado("Deficiência, TGD ou altas habilidades",sn(b.nee))}</dl>
      <button class="bt sec peq" data-refazer="b" data-est="${e.id}">Atualizar Ficha B</button></div></div>`;
    if(f){
      if(f.status==="aberta")h+=`<form id="f-fichae" data-est="${e.id}" class="folha u-mt4"><h2 class="u-mt0">Ficha E</h2><p class="ajuda u-mt0">Aberta em ${fmt(f.abertaEm)} a partir da Ficha B.</p>
        ${campo("Apoios necessários na escola","fe-apoio",f.apoios||"","Exemplo: rotina previsível, apoio visual, tempo extra, acompanhamento na alimentação. Sem diagnóstico.",1,500)}
        ${campo("Cuidados de saúde específicos na escola","fe-cuid",f.cuidados||"","Se houver. Para emergência, use também a aba Cuidados e emergência.",1,400)}
        ${campo("Acompanhamento fora da escola","fe-acomp",f.acomp||"","Exemplo: UBS, NAAPA, centro especializado.")}
        <p class="erro" id="erro-fe" role="alert"></p><button class="bt" type="submit">Concluir Ficha E</button></form>`;
      else h+=`<div class="folha u-mt4"><h2 class="u-mt0">Ficha E</h2><p class="ajuda u-mt0">Concluída em ${fmt(f.em)} por ${esc(f.por)}.</p>
        <dl>${dado("Apoios necessários na escola",f.apoios)}${dado("Cuidados de saúde específicos",f.cuidados)}${dado("Acompanhamento fora da escola",f.acomp)}</dl>
        <button class="bt sec peq" data-refazer="e" data-est="${e.id}">Atualizar Ficha E</button></div>`;
    }
  }
  h+=`<p class="nota">Fichas previstas na Portaria SME nº 3.056/2004; prazo de 30 dias após a matrícula pela Instrução Normativa SME nº 28/2024. Os campos são provisórios: o modelo oficial das fichas não está publicado na página da portaria. A ficha registra o que a família informa e não substitui avaliação de profissional de saúde.</p>`;
  return h}
function painelLaudo(e){
  const p=sessao.perfil,l=laudoAtual(e),ADE=p==="ADE";
  const antigos=S.laudos.filter(x=>x.est===e.id&&x.etapa==="cancelado");
  let h="";
  if(!l||l.etapa==="devolvido"){
    h+=l?`<div class="alerta"><b>O último laudo foi devolvido na conferência.</b> Motivo: ${esc(l.motivo||"não informado")}. Peça à família um laudo corrigido.</div>`:`<p>${antigos.length?"A alimentação específica foi cancelada. ":"Sem laudo de alimentação registrado. "}Quando a família entregar um laudo, registre aqui.</p>`;
    h+=formRecebimento(e);
  } else {
    const idx={recebido:0,devolvido:0,enviado:2,complemento:2,aprovado:3}[l.etapa];
    h+=`<ol class="trilha" aria-label="Etapas do laudo">${ETAPAS.map(([k,t],i)=>`<li class="${i<idx?"feito":""}" ${i===idx?'aria-current="step"':""}>${t}${i<idx?'<span class="vh"> (concluída)</span>':""}</li>`).join("")}</ol>`;
    const val=validade(l),nv=dias(val);
    h+=`<div class="grade"><dl class="folha u-m0">${dado("Restrições alimentares",l.restr)}${dado("Prescrito por",l.prescritor)}
      <div class="par"><dt>Emitido em</dt><dd>${fmt(l.emitido)}</dd></div><div class="par"><dt>Recebido na escola em</dt><dd>${fmt(l.recebido)}</dd></div>
      <div class="par"><dt>Validade (12 meses a partir da emissão)</dt><dd>${fmt(val)}${nv<0?`<b class="st-atraso">, vencido</b>`:nv<=JANELA?`<b class="st-perto">, vence em ${nv} dias</b>`:""}</dd></div>
      ${l.ref?dado("Número do pedido no SIGPAE",l.ref):""}</dl><div class="folha">`;
    if(l.etapa==="recebido"){
      if(ADE){const vencido=dias(addMeses(l.emitido,12))<0;
        h+=`<form id="f-confere" data-l="${l.id}"><fieldset><legend>Conferência antes de enviar à CODAE</legend><p class="ajuda u-mt0">Itens do Informativo Técnico CODAE nº 04/2023.</p>
          ${CONFERE.map(([k,t])=>`<div class="chk"><input type="checkbox" id="k-${k}" ${k==="data"&&vencido?"disabled":""}><label for="k-${k}">${t}</label></div>`).join("")}
          ${vencido?`<p class="alerta" id="aviso-data">Este laudo foi emitido em ${fmt(l.emitido)}, há mais de 12 meses. Ele não pode ser enviado: devolva e peça um novo à família.</p>`:""}</fieldset>
          ${campo("Número do pedido no SIGPAE (se houver)","l-ref","","O pedido é feito no SIGPAE. Aqui a escola só acompanha.")}
          <p class="erro" id="erro-confere" role="alert"></p>
          <div class="linha-bt"><button class="bt" type="submit" ${vencido?"disabled":""}>Registrar envio à CODAE</button></div></form>
          <form class="u-mt4" id="f-devolve" data-l="${l.id}">${campo("Motivo da devolução","l-motivo","","Exemplo: falta a lista de alimentos permitidos.")}<button class="bt perigo" type="submit">Devolver à secretaria</button></form>`;
      } else h+=`<p><b>Aguardando a conferência da gestão.</b></p>`;
    }
    if(l.etapa==="enviado"||l.etapa==="complemento"){
      h+=l.etapa==="complemento"?`<p class="alerta"><b>A CODAE pediu complemento.</b> A secretaria cobra a família; quando chegar, registre um novo recebimento.</p>`:`<p><b>Aguardando o retorno da CODAE.</b> Enquanto a alimentação específica não é autorizada, a CODAE não interfere na frequência do estudante.</p>`;
      if(ADE)h+=`<form id="f-retorno" data-l="${l.id}"><fieldset><legend>Retorno da CODAE</legend>${[["aprovado","Aprovado"],["complemento","Pediu complemento"]].map(([k,t])=>`<div class="chk"><input type="radio" name="ret" id="r-${k}" value="${k}"><label for="r-${k}">${t}</label></div>`).join("")}</fieldset><p class="erro" id="erro-ret" role="alert"></p><button class="bt" type="submit">Registrar retorno</button></form>`;
      if(l.etapa==="complemento")h+=formRecebimento(e,"Registrar o laudo complementado");
    }
    if(l.etapa==="aprovado"){
      h+=nv<=JANELA?`<p class="alerta"><b>${nv<0?"Laudo vencido.":"Laudo perto de vencer."}</b> A secretaria pede um novo à família.</p>`:`<p><b>Alimentação específica autorizada.</b></p>`;
      h+=`<p class="ajuda">Qualquer mudança na prescrição exige novo laudo à CODAE.</p>`;
      if(nv<=JANELA)h+=formRecebimento(e,"Registrar o novo laudo");
      if(ADE)h+=`<details class="u-mt4"><summary class="bt perigo u-inline">Cancelar a alimentação específica</summary>
        <form id="f-cancela" data-l="${l.id}"><fieldset><legend>Motivo</legend>
        <div class="chk"><input type="radio" name="mot" id="m-saiu" value="Estudante saiu da unidade"><label for="m-saiu">O estudante saiu da unidade</label></div>
        <div class="chk"><input type="radio" name="mot" id="m-alta" value="Alta médica"><label for="m-alta">Recebeu alta médica</label></div></fieldset>
        <div class="chk"><input type="checkbox" id="m-laudo"><label for="m-laudo">Na alta: recebi o laudo de alta com nome completo, data, prescritor, registro, carimbo e assinatura</label></div>
        <p class="ajuda">Se a alta cobre só uma das condições, o laudo vai à CODAE como nova solicitação.</p>
        <p class="erro" id="erro-cancela" role="alert"></p><button class="bt perigo" type="submit">Pedir o cancelamento à CODAE</button></form></details>`;
    }
    h+=`</div></div><h2>Histórico do laudo</h2><ul class="hist">${l.hist.map(x=>`<li><small>${fmt(x.d)}, ${esc(x.por)}</small>${esc(x.t)}</li>`).join("")}</ul>`;
  }
  h+=`<p class="nota">O laudo em papel vai para a CODAE. A ficha guarda só as restrições, sem diagnóstico nem CID.</p>`;
  return h}
function formRecebimento(e,titulo){
  return `<form class="u-mt3" id="f-recebe" data-est="${e.id}"><fieldset><legend>${titulo||"Registrar recebimento do laudo"}</legend>
    <label class="campo"><span>Data de emissão do laudo</span><input type="date" id="l-emit" required><small>A data escrita no laudo. É ela que conta para a validade de 12 meses.</small></label>
    <label class="campo"><span>Prescrito por</span><select id="l-presc"><option value="">Escolha</option><option>Médico</option><option>Nutricionista</option><option>Fonoaudiólogo</option></select></label>
    ${campo("Restrições alimentares","l-restr","","Copie só o que a criança pode e não pode comer. Não copie diagnóstico nem CID.",1,300)}
    <p class="erro" id="erro-recebe" role="alert"></p><button class="bt" type="submit">Registrar recebimento</button></fieldset></form>`}

function telaCartao(){
  const e=S.est.find(x=>x.id===rota.id);
  return `<p class="nao-imprime u-mb2"><button class="bt sec peq" data-abrir="${e.id}" data-aba="cuidados">Voltar à ficha</button></p>
  <h1 tabindex="-1" class="nao-imprime">Cartão de cuidado</h1><p class="lead nao-imprime">Para deixar com o professor. Não traz diagnóstico, só o que fazer.</p>
  <article class="cartao" aria-label="Cartão de cuidado de ${esc(e.nome)}"><h2>${esc(e.nome)}</h2><p class="turma">${esc(e.turma)}, ${UE_NOME}</p>
    ${e.alerg?`<p class="se">Não pode comer ou ter contato com</p><p>${esc(e.alerg)}</p>`:""}
    ${e.meds?`<p class="se">Medicamento</p><p>${esc(e.meds)}</p>`:""}
    <p class="se">Se acontecer uma emergência</p><p class="u-pre">${e.plano?esc(e.plano):"Ainda sem orientação por escrito. Chame o SAMU (192) e avise o responsável."}</p>
    <p class="se">Avisar</p><p>${esc(e.resp)}, ${esc(e.tel)}</p>
    <p class="rodape-c">Gerado em ${agora()} por ${esc(sessao.nome)}. ${e.planoEm?"Orientação registrada em "+fmt(e.planoEm)+". ":""}Em emergência, siga a orientação de profissionais de saúde e ligue 192. Protótipo com dados fictícios.</p></article>
  <div class="linha-bt nao-imprime"><button class="bt" id="imprimir">Imprimir cartão</button></div>
  <p class="ajuda nao-imprime" id="aviso-impr"></p>`}

function telaLaudos(){
  const V=visiveis(),L=ordenarInsercao(S.laudos.filter(l=>V.some(e=>e.id===l.est)&&!["cancelado","substituido"].includes(l.etapa)),l=>dias(validade(l))).lista;
  const nomes={recebido:"Aguardando conferência",devolvido:"Devolvido à família",enviado:"Aguardando a CODAE",complemento:"Complemento pedido",aprovado:"Autorizado"};
  return `<h1 tabindex="-1">Laudos de dieta</h1><p class="lead">Situação de cada laudo da unidade, com a validade contada a partir da data de emissão.</p>
  <div class="rolagem"><table class="tb cartoes"><thead><tr><th scope="col">EOL</th><th scope="col">Estudante</th><th scope="col">Situação</th><th scope="col">Emitido em</th><th scope="col">Válido até</th><th scope="col"><span class="vh">Ação</span></th></tr></thead><tbody>
  ${L.map(l=>{const e=S.est.find(x=>x.id===l.est),n=dias(validade(l));return `<tr><td data-label="EOL">${e.eol}</td><td data-label="Estudante">${esc(iniciais(e.nome))}, ${esc(e.turma)}</td><td data-label="Situação">${nomes[l.etapa]}</td><td data-label="Emitido em">${fmt(l.emitido)}</td><td data-label="Válido até">${fmt(validade(l))}${n<0?' <span class="st-atraso">(vencido)</span>':n<=JANELA?' <span class="st-perto">(vence logo)</span>':""}</td><td><button class="bt-ico" data-abrir="${e.id}" data-aba="alimentacao" data-tip="Abrir laudo" aria-label="Abrir laudo de ${esc(iniciais(e.nome))}">${ICONE.ficha}</button></td></tr>`}).join("")}</tbody></table></div>`}

function telaFichas(){
  const o=x=>x.fb.status!=="concluida"?0:(x.fe&&x.fe.status==="aberta")?1:2;
  const V=ordenarInsercao(visiveis(),x=>o(x)*100000+dias(addDias(x.matricula,30))).lista;
  const pend=V.filter(e=>situacaoFicha(e)[0]!=="ok").length;
  return `<h1 tabindex="-1">Fichas de saúde</h1><p class="lead">${pend?`${pend} ${pend===1?"ficha precisa":"fichas precisam"} de atenção.`:"Todas as fichas estão concluídas."} O prazo é de 30 dias após a matrícula.</p>
  <div class="rolagem"><table class="tb cartoes"><thead><tr><th scope="col">EOL</th><th scope="col">Estudante</th><th scope="col">Situação</th><th scope="col">Prazo</th><th scope="col"><span class="vh">Ação</span></th></tr></thead><tbody>
  ${V.map(e=>{const s=situacaoFicha(e),pz=addDias(e.matricula,30),n=dias(pz);return `<tr><td data-label="EOL">${e.eol}</td><td data-label="Estudante">${esc(iniciais(e.nome))}, ${esc(e.turma)}</td><td data-label="Situação">${s[1]}</td><td data-label="Prazo">${s[0]==="ok"?"—":fmt(pz)+(n<0?' <span class="st-atraso">(vencido)</span>':"")}</td><td><button class="bt-ico" data-abrir="${e.id}" data-aba="saude" data-tip="Abrir ficha de saúde" aria-label="Abrir ficha de saúde de ${esc(iniciais(e.nome))}">${ICONE.ficha}</button></td></tr>`}).join("")}</tbody></table></div>`}
let resultadoExp=null;
function rodarExperimento(){
  const linhas=[];
  for(const n of [100,1000,10000]){
    // Registros fictícios: códigos EOL únicos, embaralhados.
    const regs=[];for(let i=0;i<n;i++)regs.push({eol:String(3000000+i*7)});
    for(let i=regs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[regs[i],regs[j]]=[regs[j],regs[i]]}
    let t=performance.now();const ord=ordenarInsercao(regs,chaveEOL);const tOrd=performance.now()-t;
    const alvos=[];for(let k=0;k<200;k++)alvos.push(chaveEOL(regs[Math.floor(Math.random()*n)]));
    let cs=0,cb=0;t=performance.now();for(const a of alvos)cs+=buscaSequencial(regs,chaveEOL,a).comparacoes;const tSeq=performance.now()-t;
    t=performance.now();for(const a of alvos)cb+=buscaBinaria(ord.lista,chaveEOL,a).comparacoes;const tBin=performance.now()-t;
    linhas.push({n,ordComp:ord.comparacoes,ordMs:tOrd,seqMed:cs/alvos.length,seqMs:tSeq,binMed:cb/alvos.length,binMs:tBin,binPior:Math.floor(Math.log2(n))+1})}
  return linhas}
const num=(x,d=0)=>x.toLocaleString("pt-BR",{minimumFractionDigits:d,maximumFractionDigits:d});
function telaExperimento(){
  const R=resultadoExp;
  return `<h1 tabindex="-1">Experimento de busca e ordenação</h1><p class="lead">Compara a busca sequencial e a busca binária com 100, 1.000 e 10.000 registros fictícios. Cada rodada ordena os registros por inserção e faz 200 buscas de códigos que existem.</p>
  <div class="linha-bt u-mb4"><button class="bt" id="rodar-exp">${R?"Rodar de novo":"Rodar o experimento"}</button>${R?'<button class="bt sec" id="copiar-exp">Copiar resultados em CSV</button>':""}</div>
  ${R?`<div class="rolagem"><table class="tb"><caption>Médias por busca. Os tempos variam a cada rodada e de um computador para outro.</caption><thead><tr><th scope="col">Registros</th><th scope="col">Ordenação por inserção: comparações</th><th scope="col">Ordenação: tempo (ms)</th><th scope="col">Sequencial: comparações por busca</th><th scope="col">Binária: comparações por busca</th><th scope="col">Binária: pior caso</th><th scope="col">200 buscas sequenciais (ms)</th><th scope="col">200 buscas binárias (ms)</th></tr></thead><tbody>
  ${R.map(r=>`<tr><td>${num(r.n)}</td><td>${num(r.ordComp)}</td><td>${num(r.ordMs,1)}</td><td>${num(r.seqMed,1)}</td><td>${num(r.binMed,1)}</td><td>${num(r.binPior)}</td><td>${num(r.seqMs,2)}</td><td>${num(r.binMs,2)}</td></tr>`).join("")}</tbody></table></div>
  <p class="nota">A busca binária só funciona com a lista ordenada pela mesma chave. Ordenar custa caro uma vez; depois, cada busca fica muito mais barata. O pior caso da binária é o piso de log₂ n mais 1.</p>`:`<p class="vazio">Ainda não rodou. Com 10.000 registros, a ordenação por inserção pode levar alguns segundos.</p>`}`}
function telaRegistro(){
  return `<h1 tabindex="-1">Registro de acessos</h1><p class="lead">Cada abertura de ficha e cada alteração ficam aqui, com quem, quando e o quê. Ninguém apaga linhas. Neste protótipo o registro fica no navegador; em produção ficaria no servidor, fora do alcance de quem acessa.</p>
  <div class="linha-bt u-mb4"><button class="bt sec" id="copiar-csv">Copiar registro em CSV</button></div>
  ${S.eventos.length?`<div class="rolagem"><table class="tb cartoes"><thead><tr><th scope="col">Nº</th><th scope="col">Data e hora</th><th scope="col">Quem</th><th scope="col">Ação</th><th scope="col">Estudante</th><th scope="col">Detalhe</th></tr></thead><tbody>
  ${S.eventos.map(x=>`<tr><td data-label="Nº">${x.n}</td><td data-label="Data e hora">${esc(x.t)}</td><td data-label="Quem">${esc(x.quem)} <small>(${esc(x.cargo)})</small></td><td data-label="Ação">${esc(x.acao)}</td><td data-label="Estudante">${esc(x.alvo)||"—"}</td><td data-label="Detalhe">${esc(x.detalhe)||"—"}</td></tr>`).join("")}</tbody></table></div>`:`<p class="vazio">Nenhum acesso registrado ainda.</p>`}`}

function telaPrivacidade(){
  const p=sessao.perfil;
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
  <h2>Limites deste protótipo</h2><ul><li>Nesta fase só a escola tem acesso. Saúde (UBS), NAAPA e outros órgãos, como o sistema de Justiça, ficam para fases futuras.</li><li>Login simulado, sem servidor, sem integração com EOL, SIGPAE ou sistemas de saúde.</li><li>Não foi testado com servidores reais da escola.</li><li>O WhatsApp é um canal fora do controle da Prefeitura; em produção, o canal oficial precisa ser definido.</li></ul>`}

