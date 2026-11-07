/* Render, foco, eventos, tema e aviso de projeto acadêmico; inicia o sistema */
"use strict";
/* ---------- Render e foco ---------- */
function render(foco=true){
  const m=$("#conteudo");
  if(!sessao){m.innerHTML=telaLogin()}
  else m.innerHTML=({hoje:telaHoje,estudantes:telaEstudantes,ficha:telaFicha,cartao:telaCartao,fichas:telaFichas,experimento:telaExperimento,laudos:telaLaudos,registro:telaRegistro,privacidade:telaPrivacidade}[rota.v]||telaHoje)();
  desenharNav();
  document.body.classList.toggle("logado",!!sessao);
  // No celular as tabelas viram cartões (display:block); os papéis ARIA mantêm a leitura como tabela.
  m.querySelectorAll(".tb.cartoes").forEach(t=>{t.setAttribute("role","table");t.querySelectorAll("thead,tbody").forEach(g=>g.setAttribute("role","rowgroup"));t.querySelectorAll("tr").forEach(r=>r.setAttribute("role","row"));t.querySelectorAll("th").forEach(c=>c.setAttribute("role","columnheader"));t.querySelectorAll("td").forEach(c=>c.setAttribute("role","cell"))});
  // Cada mensagem de erro fica ligada aos campos do mesmo formulário.
  m.querySelectorAll("form").forEach(f=>{const er=f.querySelector(".erro")||(f.nextElementSibling&&f.nextElementSibling.classList.contains("erro")?f.nextElementSibling:null);if(er&&er.id)f.querySelectorAll("input:not([type=checkbox]):not([type=radio]),select,textarea").forEach(c=>c.setAttribute("aria-describedby",[c.getAttribute("aria-describedby"),er.id].filter(Boolean).join(" ")))});
  $("#quem").hidden=!sessao;$("#sair").hidden=!sessao;
  if(sessao)$("#quem").innerHTML=`<b>${esc(sessao.nome)}</b><small>${esc(sessao.cargo)}${sessao.unid?", unidade "+sessao.unid:""}</small>`;
  document.title=(sessao?({hoje:"Hoje",estudantes:"Estudantes",ficha:"Ficha",cartao:"Cartão de cuidado",fichas:"Fichas de saúde",experimento:"Experimento",laudos:"Laudos de dieta",registro:"Registro de acessos",privacidade:"Privacidade e fontes"}[rota.v]+", "):"")+"Ficha de Cuidado";
  if(foco){const h=m.querySelector("h1");if(h)h.focus();window.scrollTo(0,0)}
}
function ir(v,extra){rota=Object.assign({v},extra||{});if(v==="ficha"){const e=S.est.find(x=>x.id===rota.id);registrar("Abriu a ficha",e,NOME_ABA[rota.aba]||"")}render()}
function focarAba(k){const t=document.getElementById("tab-"+k);if(t)t.focus()}

/* ---------- Eventos ---------- */
const SENS=/\b(cid|[a-z]\d{2}(\.\d{1,2})?|diagn[oó]stic\w*|tdah|autis\w*|tea|epilep\w*|depress\w*|ansiedade|transtorno\w*|s[ií]ndrome)\b/i;
let avisado="";
function confereTexto(chave,t){if(SENS.test(t)&&avisado!==chave+t){avisado=chave+t;falar("O texto parece citar um diagnóstico. Registre só necessidades ou fatos observados. Para manter assim, envie de novo.");return false}avisado="";return true}

document.addEventListener("click",ev=>{
  const b=ev.target.closest("button,a");if(!b)return;
  if(b.dataset.conta){$("#usuario").value=b.dataset.conta;$("#senha").value=SENHA;$("#senha").focus();falar("Conta "+USUARIOS[b.dataset.conta].cargo+" preenchida. Pressione Entrar.");return}
  if(b.dataset.filtro){filtroHoje=filtroHoje===b.dataset.filtro?"":b.dataset.filtro;render(false);const n=document.querySelector(`.resumo [data-filtro="${b.dataset.filtro}"]`);if(n)n.focus();return}
  if(b.dataset.ir){ev.preventDefault();if(b.dataset.ir==="estudantes"){busca=""}ir(b.dataset.ir);return}
  if(b.dataset.abrir){ir("ficha",{id:+b.dataset.abrir,aba:b.dataset.aba||""});return}
  if(b.dataset.abaFicha){rota.aba=b.dataset.abaFicha;render(false);focarAba(rota.aba);return}
  if(b.dataset.refazer){const e=S.est.find(x=>x.id===+b.dataset.est);if(b.dataset.refazer==="b"){e.fb.status="pendente";registrar("Reabriu a Ficha B para atualizar",e)}else{e.fe.status="aberta";registrar("Reabriu a Ficha E para atualizar",e)}salvar();render(false);focarAba("saude");falar("Ficha reaberta para atualização.");return}
  if(b.dataset.cartao){const e=S.est.find(x=>x.id===+b.dataset.cartao);registrar("Gerou o cartão de cuidado",e);rota={v:"cartao",id:e.id};render();return}
  if(b.dataset.wa){const e=S.est.find(x=>x.id===+b.dataset.wa);registrar("Abriu mensagem de WhatsApp para a família",e);return}
  if(b.id==="imprimir"){try{window.print();$("#aviso-impr").textContent="Se a janela de impressão não abriu, abra este arquivo direto no navegador e use Imprimir."}catch(e){$("#aviso-impr").textContent="A impressão foi bloqueada aqui. Abra o arquivo no navegador e use Imprimir."}return}
  if(b.id==="rodar-exp"){b.disabled=true;b.textContent="Rodando…";falar("Rodando o experimento.");setTimeout(()=>{resultadoExp=rodarExperimento();registrar("Rodou o experimento de busca e ordenação");render(false);$("#rodar-exp").focus();falar("Experimento concluído.")},30);return}
  if(b.id==="copiar-exp"){const c=[["registros","ordenacao_comparacoes","ordenacao_ms","sequencial_comparacoes_media","binaria_comparacoes_media","binaria_pior_caso","sequencial_200_ms","binaria_200_ms"]].concat(resultadoExp.map(r=>[r.n,r.ordComp,r.ordMs.toFixed(1),r.seqMed.toFixed(1),r.binMed.toFixed(1),r.binPior,r.seqMs.toFixed(2),r.binMs.toFixed(2)])).map(r=>r.join(",")).join("\n");
    (navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(()=>falar("Resultados copiados em CSV."),()=>falar("Não foi possível copiar aqui. Abra o arquivo direto no navegador."));return}
  if(b.id==="copiar-csv"){const c=[["numero","data_hora","quem","cargo","acao","estudante","detalhe"]].concat(S.eventos.map(x=>[x.n,x.t,x.quem,x.cargo,x.acao,x.alvo,x.detalhe])).map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n");
    registrar("Copiou o registro de acessos","",S.eventos.length+" linhas");
    (navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(()=>falar("Registro copiado em CSV. Cole numa planilha."),()=>falar("Não foi possível copiar aqui. Abra o arquivo direto no navegador."));return}
});
document.addEventListener("keydown",ev=>{if(ev.key==="Escape"&&ev.target.classList&&ev.target.classList.contains("bt-ico")){ev.target.classList.add("sem-dica");return}

  const t=ev.target;
  if(t.getAttribute&&t.getAttribute("role")==="tab"){
    const L=[...document.querySelectorAll("[role=tab]")],i=L.indexOf(t);let j=null;
    if(ev.key==="ArrowRight")j=(i+1)%L.length;if(ev.key==="ArrowLeft")j=(i-1+L.length)%L.length;if(ev.key==="Home")j=0;if(ev.key==="End")j=L.length-1;
    if(j!==null){ev.preventDefault();rota.aba=L[j].dataset.abaFicha;render(false);focarAba(rota.aba)}}
});
document.addEventListener("change",ev=>{if(ev.target.id==="turma"){filtroTurma=ev.target.value;render(false);$("#turma").focus()}if(ev.target.id==="ordem"){ordem=ev.target.value;render(false);$("#ordem").focus()}});
document.addEventListener("submit",ev=>{
  ev.preventDefault();const f=ev.target,v=id=>{const x=document.getElementById(id);return x?x.value.trim():""};
  if(f.id==="f-login"){const u=v("usuario").toLowerCase(),c=USUARIOS[u];
    if(!c||v("senha")!==SENHA){$("#erro-login").textContent="Usuário ou senha incorretos. Use uma das contas de demonstração ao lado.";$("#usuario").focus();return}
    sessao=Object.assign({usuario:u},c);registrar("Entrou no sistema");ir("hoje");return}
  if(f.id==="f-busca"){const q=v("busca").replace(/\D/g,"");if(!q){$("#erro-busca").textContent="Digite o número para buscar.";$("#busca").focus();return}
    // A busca binária exige a lista ordenada pela mesma chave: ordena por EOL e depois busca.
    const ord=ordenarInsercao(visiveis(),chaveEOL).lista,alvo=Number(q);
    const bin=buscaBinaria(ord,chaveEOL,alvo),seq=buscaSequencial(visiveis(),chaveEOL,alvo);
    const resumo=`Busca binária: ${bin.comparacoes} ${bin.comparacoes===1?"comparação":"comparações"}. Busca sequencial na mesma lista: ${seq.comparacoes}.`;
    if(bin.posicao!==-1){const e=ord[bin.posicao];busca="";ultimaBusca=`EOL ${e.eol} encontrado. ${resumo}`;ir("ficha",{id:e.id});falar(ultimaBusca)}
    else{busca=q;ultimaBusca=null;$("#erro-busca").textContent=`Nenhum estudante com o código ${q} nesta unidade. ${resumo}`;$("#busca").focus()}return}
  const e=f.dataset.est?S.est.find(x=>x.id===+f.dataset.est):null;
  const l=f.dataset.l?S.laudos.find(x=>x.id===+f.dataset.l):null;
  const le=l?S.est.find(x=>x.id===l.est):null;
  const fim=(msg,ev2,est,det)=>{const n=registrar(ev2,est,det);salvar();render(false);focarAba(rota.aba);falar(msg+" Registro nº "+n+".")};
  if(f.id==="f-fichab"){const r=n=>{const x=f.querySelector(`input[name=${n}]:checked`);return x?x.value==="s":null};
    const trat=r("fb-trat"),alg=r("fb-alg"),med=r("fb-med"),nee=r("fb-nee");
    if([trat,alg,med,nee].includes(null)){$("#erro-fb").textContent="Responda sim ou não às quatro perguntas.";(f.querySelector("fieldset input:not(:checked)")||$("#fb-trat-s")).focus();return}
    if(!confereTexto("fb",v("fb-cuid")))return;
    const alim=alg&&$("#fb-alim").checked;
    e.fb={status:"concluida",em:hoje(),por:sessao.nome,informante:v("fb-inf"),trat,cuidado:v("fb-cuid"),alg,alim,med,nee};
    if(alg&&v("fb-algq"))e.alerg=v("fb-algq");
    if((trat||med)&&!e.plano)e.grave=true;
    let msg="Ficha B concluída. A ficha de saúde está completa.";
    if(nee){if(!e.fe)e.fe={status:"aberta",abertaEm:hoje()};msg=e.fe.status==="aberta"?"Ficha B concluída. A Ficha E foi aberta para registrar os apoios.":"Ficha B concluída. A Ficha E continua válida."}
    else if(e.fe){e.fe=null;msg="Ficha B concluída. A Ficha E foi encerrada porque a família não informou mais a condição."}
    if(alim&&!laudoAtual(e))msg+=" Peça o laudo de dieta à família.";
    return fim(msg,"Concluiu a Ficha B",e,nee?"Deriva para a Ficha E":"Sem derivação")}
  if(f.id==="f-fichae"){const ap=v("fe-apoio");if(!ap){$("#erro-fe").textContent="Descreva ao menos um apoio necessário na escola.";$("#fe-apoio").focus();return}
    if(!confereTexto("fe",ap+" "+v("fe-cuid")))return;
    Object.assign(e.fe,{status:"concluida",em:hoje(),por:sessao.nome,apoios:ap,cuidados:v("fe-cuid"),acomp:v("fe-acomp")});
    return fim("Ficha E concluída.","Concluiu a Ficha E",e)}
  if(f.id==="f-cuidados"){if(!confereTexto("cuid",v("c-plano")+" "+v("c-alerg")))return;
    Object.assign(e,{alerg:v("c-alerg"),grave:$("#c-grave").checked,meds:v("c-meds")});
    if(v("c-plano")!==e.plano||v("c-fonte")!==(e.planoFonte||"")){e.plano=v("c-plano");e.planoFonte=v("c-fonte");e.planoPor=sessao.cargo;e.planoEm=hoje()}
    return fim("Cuidados salvos.","Alterou cuidados e emergência",e)}
  if(f.id==="f-vacina"){const dv=v("v-dva"),rt=v("v-ret");
    if(!dv){$("#erro-dva").textContent="Informe a data em que a DVA foi recebida.";$("#v-dva").focus();return}
    if(dv>hoje()){$("#erro-dva").textContent="A data de recebimento não pode estar no futuro.";$("#v-dva").focus();return}
    e.dvaEm=dv;e.retorno=rt;return fim("DVA registrada.","Registrou DVA",e,rt?"Retorno à UBS em "+fmt(rt):"Sem retorno marcado")}
  if(f.id==="f-apoio"){if(!confereTexto("apoio",v("a-texto")))return;if(v("a-texto")&&!v("a-rev")){falar("Informe a próxima revisão do plano.");$("#a-rev").focus();return}
    e.apoio=v("a-texto");e.apoioRev=v("a-rev");return fim("Plano de apoio salvo.","Alterou o plano de apoio",e)}
  if(f.classList.contains("f-dev")){const i=+f.dataset.i,x=e.enc[i];if(!confereTexto("dev"+i,v("d-t"+i)))return;
    x.status=v("d-s"+i);x.dev=v("d-t"+i);return fim("Devolutiva registrada.","Registrou devolutiva do NAAPA",e,x.status)}
  if(f.id==="f-enc"){const t=v("n-enc");if(!t){falar("Descreva o motivo do encaminhamento.");$("#n-enc").focus();return}if(!confereTexto("enc",t))return;
    e.enc.unshift({d:hoje(),de:sessao.cargo,t,status:"Enviado",dev:""});return fim("Encaminhamento enviado ao NAAPA.","Encaminhou ao NAAPA",e)}
  if(f.id==="f-obs"){const t=v("n-obs");if(!t){falar("Escreva a observação.");$("#n-obs").focus();return}if(!confereTexto("obs",t))return;
    e.obs.unshift({d:hoje(),t,por:sessao.nome});return fim("Observação registrada.","Registrou observação",e)}
  if(f.id==="f-recebe"){const emit=v("l-emit"),presc=v("l-presc"),restr=v("l-restr");
    if(!emit||!presc||!restr){$("#erro-recebe").textContent="Preencha a data de emissão, quem prescreveu e as restrições.";(!emit?$("#l-emit"):!presc?$("#l-presc"):$("#l-restr")).focus();return}
    if(emit>hoje()){$("#erro-recebe").textContent="A data de emissão não pode estar no futuro.";$("#l-emit").focus();return}
    if(!confereTexto("rec",restr))return;
    const ant=laudoAtual(e);if(ant){ant.etapa="substituido";ant.hist.unshift({d:hoje(),t:"Substituído por um novo laudo",por:sessao.nome})}
    const id=Math.max(0,...S.laudos.map(x=>x.id))+1;
    S.laudos.push({id,est:e.id,emitido:emit,prescritor:presc,restr,recebido:hoje(),etapa:"recebido",ref:"",hist:[{d:hoje(),t:"Laudo recebido na escola",por:sessao.nome}]});
    const velho=dias(addMeses(emit,12))<0;
    return fim(velho?"Recebimento registrado. Atenção: o laudo tem mais de 12 meses e será barrado na conferência.":"Recebimento registrado. A gestão vai conferir.","Registrou recebimento do laudo de dieta",e,"Emitido em "+fmt(emit))}
  if(f.id==="f-confere"){const falta=CONFERE.filter(([k])=>!$("#k-"+k).checked);
    if(falta.length){$("#erro-confere").textContent="Faltam "+falta.length+" "+(falta.length===1?"item":"itens")+" da conferência. Se o laudo não atende, devolva com o motivo.";$("#k-"+falta[0][0]).focus();return}
    l.etapa="enviado";l.ref=v("l-ref");l.hist.unshift({d:hoje(),t:"Conferido e enviado à CODAE",por:sessao.nome});
    return fim("Envio à CODAE registrado.","Conferiu e registrou envio à CODAE",le,l.ref?"Pedido SIGPAE "+l.ref:"6 itens conferidos")}
  if(f.id==="f-devolve"){const m=v("l-motivo");if(!m){falar("Escreva o motivo da devolução.");$("#l-motivo").focus();return}
    l.etapa="devolvido";l.motivo=m;l.hist.unshift({d:hoje(),t:"Devolvido na conferência: "+m,por:sessao.nome});
    return fim("Laudo devolvido. A secretaria vai cobrar a família.","Devolveu o laudo na conferência",le,m)}
  if(f.id==="f-retorno"){const r=f.querySelector("input[name=ret]:checked");if(!r){$("#erro-ret").textContent="Escolha o retorno da CODAE.";return}
    l.etapa=r.value;l.hist.unshift({d:hoje(),t:r.value==="aprovado"?"Aprovado pela CODAE":"CODAE pediu complemento",por:sessao.nome});
    return fim(r.value==="aprovado"?"Aprovação registrada.":"Pedido de complemento registrado. A secretaria vai cobrar a família.","Registrou retorno da CODAE",le,r.value)}
  if(f.id==="f-cancela"){const r=f.querySelector("input[name=mot]:checked");if(!r){$("#erro-cancela").textContent="Escolha o motivo.";return}
    if(r.value==="Alta médica"&&!$("#m-laudo").checked){$("#erro-cancela").textContent="Na alta, a CODAE precisa do laudo de alta. Confirme que ele foi recebido.";$("#m-laudo").focus();return}
    l.etapa="cancelado";l.hist.unshift({d:hoje(),t:"Cancelamento pedido à CODAE: "+r.value,por:sessao.nome});
    return fim("Cancelamento registrado.","Pediu cancelamento da alimentação específica",le,r.value)}
});
// Depois de cada envio: o campo que recebeu o foco por causa de um erro fica marcado como inválido.
document.addEventListener("submit",()=>setTimeout(()=>{document.querySelectorAll("[aria-invalid]").forEach(c=>c.removeAttribute("aria-invalid"));const temErro=[...document.querySelectorAll(".erro")].some(x=>x.textContent.trim());const ae=document.activeElement;if(temErro&&ae&&ae.matches("input,select,textarea"))ae.setAttribute("aria-invalid","true")},0));
document.addEventListener("focusout",ev=>{if(ev.target.classList&&ev.target.classList.contains("bt-ico"))ev.target.classList.remove("sem-dica")});
document.addEventListener("mouseout",ev=>{const b=ev.target.closest&&ev.target.closest(".bt-ico");if(b)b.classList.remove("sem-dica")});
$("#sair").onclick=()=>{registrar("Saiu do sistema");sessao=null;rota={v:"hoje"};filtroTurma="";busca="";render()};
$("#recomecar").onclick=()=>{try{localStorage.removeItem(CHAVE)}catch(e){}S=semente();sessao=null;rota={v:"hoje"};render();falar("Demonstração recomeçada com os dados iniciais.")};
const tema=$("#tema");try{const t=localStorage.getItem("fc-tema");if(t)tema.value=t}catch(e){}
const aplicaTema=()=>{const v=tema.value;if(v==="auto")delete document.documentElement.dataset.tema;else document.documentElement.dataset.tema=v;try{localStorage.setItem("fc-tema",v)}catch(e){}};
tema.onchange=aplicaTema;aplicaTema();
/* ---------- Aviso de projeto acadêmico ---------- */
const aviso=$("#aviso");let focoAntes=null;
function abrirAviso(){focoAntes=document.activeElement;try{aviso.showModal()}catch(e){aviso.setAttribute("open","")}aviso.scrollTop=0;$("#aviso-titulo").focus({preventScroll:true})}
function fecharAviso(){aviso.close?aviso.close():aviso.removeAttribute("open")}
aviso.addEventListener("close",()=>{setTimeout(()=>{const u=$("#usuario");if(focoAntes&&focoAntes!==document.body&&focoAntes!==aviso&&document.contains(focoAntes))focoAntes.focus();else if(u)u.focus();else{const h=document.querySelector("main h1");if(h)h.focus()}},0)});
$("#aviso-ok").onclick=fecharAviso;
document.addEventListener("click",ev=>{if(ev.target.id==="abrir-aviso")abrirAviso()});
carregar();render(false);abrirAviso();
