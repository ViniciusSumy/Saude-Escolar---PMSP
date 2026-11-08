/* Funções auxiliares: seletor, escape de HTML, datas no horário local */
"use strict";
/* ---------- Utilidades ---------- */
// Atalho para document.querySelector.
const $ = (s) => document.querySelector(s);
// Troca &, <, >, aspas e apóstrofo por entidades HTML antes de o texto entrar em innerHTML.
// Evita que um texto digitado vire código na página.
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
// Data local no formato AAAA-MM-DD. Não usa toISOString(), que converte para UTC e pode mudar o dia.
const iso = (d) =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");
// Data de hoje no formato AAAA-MM-DD.
const hoje = () => iso(new Date());
// Hoje somado a n dias (n negativo é passado). Os dados de demonstração usam D(n) para que os prazos
// fiquem sempre vencidos, próximos ou em dia, qualquer que seja o dia em que o sistema é aberto.
const D = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
};
// Soma n dias a uma data AAAA-MM-DD. O "T00:00:00" faz a data ser lida no horário local.
const addDias = (s, n) => {
  const d = new Date(s + "T00:00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
};
// Soma m meses a uma data AAAA-MM-DD (usada na validade de 12 meses do laudo).
const addMeses = (s, m) => {
  const d = new Date(s + "T00:00:00");
  d.setMonth(d.getMonth() + m);
  return iso(d);
};
// Dias de hoje até a data s: negativo = já passou, 0 = hoje, null = sem data.
// 864e5 é o número de milissegundos de um dia.
const dias = (s) =>
  s ? Math.round((new Date(s + "T00:00:00") - new Date(hoje() + "T00:00:00")) / 864e5) : null;
// AAAA-MM-DD para DD/MM/AAAA.
const fmt = (s) => (s ? s.split("-").reverse().join("/") : "não informado");
// Data e hora atuais no formato brasileiro (registro de acessos).
const agora = () => new Date().toLocaleString("pt-BR");
// Idade completa em meses a partir da data de nascimento. Desconta 1 mês se o dia do aniversário ainda não chegou.
const idadeMeses = (n) => {
  const a = new Date(n + "T00:00:00"),
    b = new Date();
  return (
    (b.getFullYear() - a.getFullYear()) * 12 +
    b.getMonth() -
    a.getMonth() -
    (b.getDate() < a.getDate() ? 1 : 0)
  );
};
// Até 23 meses mostra em meses; depois, em anos.
const idade = (n) => {
  const m = idadeMeses(n);
  return m < 24 ? m + " meses" : Math.floor(m / 12) + " anos";
};
// "Ana Clara de Souza" vira "A. C. S.". Palavras de até 2 letras (de, da) são ignoradas.
// As listas mostram só as iniciais para expor menos dados.
const iniciais = (n) =>
  n
    .split(" ")
    .filter((w) => w.length > 2)
    .map((w) => w[0] + ".")
    .join(" ");
// Primeiro nome, usado nas mensagens de WhatsApp.
const primeiro = (n) => n.split(" ")[0];
// Janela de aviso, em dias: um prazo que vence em até 30 dias aparece como "perto de vencer".
const JANELA = 30;
// Unidade escolar fictícia: código e nome.
const UE = "999999",
  UE_NOME = "EMEF Modelo";
// Senha das contas de demonstração. Num sistema real o login seria institucional e a senha não ficaria no código.
const SENHA = "demo123";
// Anuncia a mensagem para leitores de tela na região #status (aria-live) e a apaga depois de alguns segundos.
let falar = (t) => {
  const s = $("#status");
  s.textContent = "";
  setTimeout(() => {
    s.textContent = t;
  }, 30);
  clearTimeout(falar.t);
  falar.t = setTimeout(
    () => {
      s.textContent = "";
    },
    Math.max(4000, t.length * 70),
  );
};
