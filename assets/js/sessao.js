/* Sessão, registro de acessos e validade do laudo */
"use strict";
/* ---------- Sessão e registro de acessos ---------- */
// sessao: usuário que entrou (null = ninguém). rota: tela atual.
let sessao = null,
  rota = { v: "hoje" };
// Grava uma linha no registro de acessos: quem, quando, o quê e qual estudante (pelo código EOL).
// Devolve o número do registro. O ramo "UBS" prepara a fase futura da Saúde, que ainda não existe nesta versão.
function registrar(acao, est, detalhe) {
  S.seq++;
  const n = new Date().getFullYear() + "-" + String(S.seq).padStart(5, "0");
  S.eventos.unshift({
    n,
    t: agora(),
    quem: sessao ? sessao.nome : "",
    cargo: sessao ? sessao.cargo : "",
    acao,
    alvo: est ? (sessao && sessao.perfil === "UBS" ? "CNS " + est.cns : "EOL " + est.eol) : "",
    detalhe: detalhe || "",
  });
  salvar();
  return n;
}
// Estudantes que o usuário pode ver: só os da própria unidade (cada escola vê apenas os seus).
const visiveis = () => S.est.filter((e) => !sessao.unid || e.ue === sessao.unid);
// Identificador mostrado do estudante: código EOL para a escola.
const ident = (e) => (sessao.perfil === "UBS" ? e.cns : e.eol);
// Laudo em andamento do estudante: o mais recente que não foi cancelado nem substituído.
const laudoAtual = (e) =>
  S.laudos
    .filter((l) => l.est === e.id && !["cancelado", "substituido"].includes(l.etapa))
    .sort((a, b) => b.id - a.id)[0];
// Validade do laudo: 12 meses a partir da emissão (Informativo Técnico SME/CODAE nº 04/2023: "data do laudo inferior a 12 meses").
const validade = (l) => addMeses(l.emitido, 12);
