/* Perfis (Secretaria e Gestão), permissões e abas da ficha */
"use strict";
/* ---------- Perfis ---------- */
const USUARIOS={
  secretaria:{nome:"Juliana Prado",cargo:"Secretaria",perfil:"ATE",unid:UE},
  gestao:{nome:"Carla Menezes",cargo:"Gestão",perfil:"ADE",unid:UE}
};
const PODE={
  ATE:"Cobrar das famílias os laudos de dieta, a DVA e as orientações de emergência, registrar o que recebe, imprimir o cartão de cuidado e encaminhar ao NAAPA.",
  ADE:"Tudo o que a secretaria faz, mais conferir o laudo e registrar o envio à CODAE pelo SIGPAE, registrar o retorno e o cancelamento, registrar a devolutiva do NAAPA e ver o registro de acessos."
};
const NAO_VE={
  ATE:"diagnósticos, CID e histórico de vacinas. A ficha guarda só o que a escola precisa fazer.",
  ADE:"diagnósticos, CID e histórico de vacinas. A ficha guarda só o que a escola precisa fazer."
};
const ABAS={
  ATE:["saude","cuidados","alimentacao","vacina","apoio","obs","contato"],
  ADE:["saude","cuidados","alimentacao","vacina","apoio","obs","contato"],
};
const NOME_ABA={saude:"Ficha de saúde",cuidados:"Cuidados e emergência",alimentacao:"Alimentação especial",vacina:"Vacinação (DVA)",apoio:"Apoio e NAAPA",obs:"Observações da escola",contato:"Contato da família"};
const escola=p=>p==="ATE"||p==="ADE";

