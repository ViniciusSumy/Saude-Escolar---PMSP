/* Perfis (Secretaria e Gestão), permissões e abas da ficha */
"use strict";
/* ---------- Perfis ---------- */
// Contas de demonstração, que simulam duas funções reais da escola:
// ATE = Auxiliar Técnico de Educação (Secretaria) e ADE = Assistente de Diretor de Escola (Gestão).
const USUARIOS = {
  secretaria: { nome: "Juliana Prado", cargo: "Secretaria", perfil: "ATE", unid: UE },
  gestao: { nome: "Carla Menezes", cargo: "Gestão", perfil: "ADE", unid: UE },
};
// O que cada perfil pode fazer (texto da tela Privacidade e fontes).
const PODE = {
  ATE: "Cobrar das famílias os laudos de dieta, a DVA e as orientações de emergência, registrar o que recebe, imprimir o cartão de cuidado e encaminhar ao NAAPA.",
  ADE: "Tudo o que a secretaria faz, mais conferir o laudo e registrar o envio à CODAE pelo SIGPAE, registrar o retorno e o cancelamento, registrar a devolutiva do NAAPA e ver o registro de acessos.",
};
// O que cada perfil não vê (texto da tela Privacidade e fontes).
const NAO_VE = {
  ATE: "diagnósticos, CID e histórico de vacinas. A ficha guarda só o que a escola precisa fazer.",
  ADE: "diagnósticos, CID e histórico de vacinas. A ficha guarda só o que a escola precisa fazer.",
};
// Abas da ficha do estudante, por perfil. Nesta versão os dois perfis têm as mesmas abas.
const ABAS = {
  ATE: ["saude", "cuidados", "alimentacao", "vacina", "apoio", "obs", "contato"],
  ADE: ["saude", "cuidados", "alimentacao", "vacina", "apoio", "obs", "contato"],
};
// Nome de cada aba da ficha, como aparece na tela.
const NOME_ABA = {
  saude: "Ficha de saúde",
  cuidados: "Cuidados e emergência",
  alimentacao: "Alimentação especial",
  vacina: "Vacinação (DVA)",
  apoio: "Apoio e NAAPA",
  obs: "Observações da escola",
  contato: "Contato da família",
};
// Verdadeiro para os perfis que trabalham na escola.
const escola = (p) => p === "ATE" || p === "ADE";
