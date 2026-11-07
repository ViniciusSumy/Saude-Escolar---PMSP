/* Funções auxiliares: seletor, escape de HTML, datas no horário local */
"use strict";
/* ---------- Utilidades ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const hoje=()=>iso(new Date());
const D=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const addDias=(s,n)=>{const d=new Date(s+"T00:00:00");d.setDate(d.getDate()+n);return iso(d)};
const addMeses=(s,m)=>{const d=new Date(s+"T00:00:00");d.setMonth(d.getMonth()+m);return iso(d)};
const dias=s=>s?Math.round((new Date(s+"T00:00:00")-new Date(hoje()+"T00:00:00"))/864e5):null;
const fmt=s=>s?s.split("-").reverse().join("/"):"não informado";
const agora=()=>new Date().toLocaleString("pt-BR");
const idadeMeses=n=>{const a=new Date(n+"T00:00:00"),b=new Date();return (b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth()-(b.getDate()<a.getDate()?1:0)};
const idade=n=>{const m=idadeMeses(n);return m<24?m+" meses":Math.floor(m/12)+" anos"};
const iniciais=n=>n.split(" ").filter(w=>w.length>2).map(w=>w[0]+".").join(" ");
const primeiro=n=>n.split(" ")[0];
const JANELA=30;
const UE="999999",UE_NOME="EMEF Modelo";
const SENHA="demo123";
let falar=t=>{const s=$("#status");s.textContent="";setTimeout(()=>{s.textContent=t},30);clearTimeout(falar.t);falar.t=setTimeout(()=>{s.textContent=""},Math.max(4000,t.length*70))};

