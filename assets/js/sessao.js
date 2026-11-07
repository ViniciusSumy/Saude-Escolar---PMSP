/* Sessão, registro de acessos e validade do laudo */
"use strict";
/* ---------- Sessão e registro de acessos ---------- */
let sessao=null,rota={v:"hoje"};
function registrar(acao,est,detalhe){
  S.seq++;const n=new Date().getFullYear()+"-"+String(S.seq).padStart(5,"0");
  S.eventos.unshift({n,t:agora(),quem:sessao?sessao.nome:"",cargo:sessao?sessao.cargo:"",acao,alvo:est?(sessao&&sessao.perfil==="UBS"?"CNS "+est.cns:"EOL "+est.eol):"",detalhe:detalhe||""});
  salvar();return n}
const visiveis=()=>S.est.filter(e=>!sessao.unid||e.ue===sessao.unid);
const ident=e=>sessao.perfil==="UBS"?e.cns:e.eol;
const laudoAtual=e=>S.laudos.filter(l=>l.est===e.id&&!["cancelado","substituido"].includes(l.etapa)).sort((a,b)=>b.id-a.id)[0];
const validade=l=>addMeses(l.emitido,12);

