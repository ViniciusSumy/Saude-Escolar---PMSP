/* Dados de demonstração fictícios e persistência no localStorage */
"use strict";
/* ---------- Dados de demonstração (fictícios, datas relativas a hoje) ---------- */
// Cria os dados de demonstração. Tudo é fictício e as datas são relativas a hoje (função D).
function semente() {
  // Estudantes. O de código 2000009 é de outra unidade (ue 888888) e serve para mostrar que a escola não o vê.
  const E = [
    {
      id: 1,
      eol: "1000001",
      nome: "Helena Souza Lima",
      turma: "Berçário II",
      nasc: D(-500),
      resp: "Marta Lima",
      tel: "(11) 90000-0001",
      alerg: "Proteína do leite de vaca",
      grave: false,
      meds: "",
      plano: "",
      dvaEm: D(-200),
      retorno: D(120),
    },
    {
      id: 2,
      eol: "1000002",
      nome: "Pedro Henrique Alves",
      turma: "Maternal I",
      nasc: D(-1100),
      resp: "Josué Alves",
      tel: "(11) 90000-0002",
      alerg: "Ovo",
      grave: false,
      meds: "",
      plano: "",
      dvaEm: D(-300),
      retorno: D(-45),
    },
    {
      id: 3,
      eol: "1000003",
      nome: "Sofia Martins Rocha",
      turma: "Infantil II A",
      nasc: D(-1800),
      resp: "Carla Rocha",
      tel: "(11) 90000-0003",
      alerg: "Amendoim e castanhas, com risco de reação grave",
      grave: true,
      meds: "Adrenalina autoinjetável, guardada na secretaria",
      plano:
        "Se houver inchaço no rosto, falta de ar ou manchas pelo corpo depois de comer: aplicar a adrenalina autoinjetável conforme a orientação da UBS, chamar o SAMU (192) e avisar a responsável.",
      planoPor: "Secretaria",
      planoEm: D(-60),
      planoFonte: "Orientação escrita da UBS, entregue pela mãe",
      dvaEm: D(-150),
      retorno: D(200),
    },
    {
      id: 4,
      eol: "1000004",
      nome: "Davi Nogueira Costa",
      turma: "Infantil I B",
      nasc: D(-1400),
      resp: "Paula Costa",
      tel: "(11) 90000-0004",
      alerg: "Glúten",
      grave: false,
      meds: "",
      plano: "",
      dvaEm: D(-250),
      retorno: D(15),
    },
    {
      id: 5,
      eol: "1000005",
      nome: "Lucas Ferreira Dias",
      turma: "3º ano B",
      nasc: D(-3000),
      resp: "Renata Dias",
      tel: "(11) 90000-0005",
      alerg: "",
      grave: false,
      meds: "Medicação em casa, fora do horário escolar",
      plano: "",
      dvaEm: "",
      retorno: "",
    },
    {
      id: 6,
      eol: "1000006",
      nome: "Isabela Carvalho Prado",
      turma: "5º ano A",
      nasc: D(-3900),
      resp: "Fábio Prado",
      tel: "(11) 90000-0006",
      alerg: "Lactose",
      grave: true,
      meds: "",
      plano: "",
      dvaEm: D(-90),
      retorno: D(60),
    },
    {
      id: 7,
      eol: "1000007",
      nome: "Miguel Santana Reis",
      turma: "7º ano C",
      nasc: D(-4600),
      resp: "Elaine Reis",
      tel: "(11) 90000-0007",
      alerg: "",
      grave: false,
      meds: "",
      plano: "",
      dvaEm: D(-330),
      retorno: D(-10),
    },
    {
      id: 8,
      eol: "1000008",
      nome: "Ana Clara Mendes",
      turma: "9º ano A",
      nasc: D(-5300),
      resp: "Sérgio Mendes",
      tel: "(11) 90000-0008",
      alerg: "",
      grave: true,
      meds: "",
      plano:
        "Em caso de crise: proteger a cabeça, afastar objetos, não conter os movimentos e não colocar nada na boca. Avisar o responsável.",
      planoPor: "Secretaria",
      planoEm: D(-120),
      planoFonte: "Orientação escrita do médico, entregue pelo pai",
      dvaEm: D(-120),
      retorno: D(90),
    },
    {
      id: 9,
      eol: "2000009",
      nome: "Rafael Gomes Teixeira",
      turma: "2º ano A",
      nasc: D(-2700),
      resp: "Lúcia Teixeira",
      tel: "(11) 90000-0009",
      alerg: "",
      grave: false,
      meds: "",
      plano: "",
      dvaEm: D(-340),
      retorno: D(-5),
      ue: "888888",
    },
  ];
  E.forEach((e) => {
    e.ue = e.ue || UE;
    e.cns = "7000000000000" + String(e.id).padStart(2, "0");
    e.apoio = e.apoio || "";
    e.apoioRev = e.apoioRev || "";
    e.obs = [];
    e.enc = [];
  });
  const by = (id) => E.find((e) => e.id === id);
  Object.assign(by(4), {
    apoio:
      "Sensível a ruídos altos. Rotina previsível ajuda; avisar antes de mudanças. Usar apoio visual na comunicação.",
    apoioRev: D(95),
  });
  by(4).enc = [
    {
      d: D(-20),
      de: "Gestão",
      t: "Davi tem tolerado melhor a roda de conversa com apoio visual.",
      status: "Devolutiva registrada",
      dev: "Manter a rotina visual e retomar na próxima reunião de caso.",
    },
  ];
  Object.assign(by(5), {
    apoio: "Tarefas curtas, lugar próximo ao professor e tempo extra em avaliações.",
    apoioRev: D(-20),
  });
  by(5).enc = [
    {
      d: D(-3),
      de: "Gestão",
      t: "Nas últimas duas semanas, mais agitação após o intervalo e dificuldade para concluir tarefas.",
      status: "Enviado",
      dev: "",
    },
  ];
  by(5).obs = [
    {
      d: D(-8),
      t: "Avaliação em sala separada, com tempo extra: melhor desempenho.",
      por: "Carla Menezes",
    },
  ];
  Object.assign(by(7), {
    apoio: "Enunciados lidos em voz alta; não penalizar ortografia em avaliações.",
    apoioRev: D(25),
  });
  // Laudos de dieta, em etapas diferentes para demonstrar cada situação (aprovado, enviado, recebido, complemento).
  const L = [
    {
      id: 1,
      est: 1,
      emitido: D(-380),
      prescritor: "Médico",
      restr: "Sem leite e derivados; usar fórmula sem lactose.",
      recebido: D(-370),
      etapa: "aprovado",
      ref: "",
      hist: [
        { d: D(-370), t: "Laudo recebido na escola", por: "Juliana Prado" },
        { d: D(-368), t: "Conferido e enviado à CODAE", por: "Carla Menezes" },
        { d: D(-355), t: "Aprovado pela CODAE", por: "Carla Menezes" },
      ],
    },
    {
      id: 2,
      est: 3,
      emitido: D(-345),
      prescritor: "Médico",
      restr: "Sem amendoim e castanhas; atenção a traços nos rótulos.",
      recebido: D(-340),
      etapa: "aprovado",
      ref: "",
      hist: [
        { d: D(-340), t: "Laudo recebido na escola", por: "Juliana Prado" },
        { d: D(-339), t: "Conferido e enviado à CODAE", por: "Carla Menezes" },
        { d: D(-330), t: "Aprovado pela CODAE", por: "Carla Menezes" },
      ],
    },
    {
      id: 3,
      est: 6,
      emitido: D(-40),
      prescritor: "Nutricionista",
      restr: "Sem lactose; controle de carboidratos conforme o plano entregue pela família.",
      recebido: D(-30),
      etapa: "enviado",
      ref: "",
      hist: [
        { d: D(-30), t: "Laudo recebido na escola", por: "Juliana Prado" },
        { d: D(-28), t: "Conferido e enviado à CODAE", por: "Carla Menezes" },
      ],
    },
    {
      id: 4,
      est: 4,
      emitido: D(-400),
      prescritor: "Médico",
      restr: "Sem glúten.",
      recebido: D(-1),
      etapa: "recebido",
      ref: "",
      hist: [{ d: D(-1), t: "Laudo recebido na escola", por: "Juliana Prado" }],
    },
    {
      id: 5,
      est: 2,
      emitido: D(-60),
      prescritor: "Médico",
      restr: "Sem ovo.",
      recebido: D(-50),
      etapa: "complemento",
      ref: "",
      hist: [
        { d: D(-50), t: "Laudo recebido na escola", por: "Juliana Prado" },
        { d: D(-49), t: "Conferido e enviado à CODAE", por: "Carla Menezes" },
        {
          d: D(-12),
          t: "CODAE pediu complemento: lista de alimentos permitidos e proibidos",
          por: "Carla Menezes",
        },
      ],
    },
  ];
  // Ficha de saúde B já concluída, com valores padrão; o segundo argumento troca os campos que forem diferentes.
  const FB = (m, o) =>
    Object.assign(
      {
        status: "concluida",
        em: addDias(D(m), 10),
        por: "Juliana Prado",
        informante: "Responsável, na matrícula",
        trat: false,
        cuidado: "",
        alg: false,
        alim: false,
        med: false,
        nee: false,
      },
      o,
    );
  // Por estudante: [dias desde a matrícula, Ficha B, Ficha E]. null na Ficha B = ficha ainda pendente.
  const fichas = {
    1: [-300, FB(-300, { alg: true, alim: true })],
    2: [-12, null],
    3: [
      -280,
      FB(-280, {
        alg: true,
        alim: true,
        med: true,
        cuidado: "Adrenalina autoinjetável guardada na secretaria.",
      }),
    ],
    4: [
      -250,
      FB(-250, { nee: true }),
      {
        status: "concluida",
        abertaEm: D(-240),
        em: D(-235),
        por: "Carla Menezes",
        apoios: "Rotina previsível, aviso antes de mudanças e apoio visual na comunicação.",
        cuidados: "",
        acomp: "NAAPA",
      },
    ],
    5: [-45, FB(-45, { nee: true }), { status: "aberta", abertaEm: D(-35) }],
    6: [
      -200,
      FB(-200, {
        trat: true,
        alg: true,
        alim: true,
        cuidado: "Controle de alimentação conforme o plano entregue pela família.",
      }),
    ],
    7: [-40, null],
    8: [-260, FB(-260, { trat: true, cuidado: "Seguir a orientação de emergência registrada." })],
    9: [-340, FB(-340, {})],
  };
  E.forEach((e) => {
    const f = fichas[e.id];
    e.matricula = D(f[0]);
    e.fb = f[1] || { status: "pendente" };
    e.fe = f[2] || null;
  });
  return { v: 3, est: E, laudos: L, eventos: [], seq: 0 };
}
// Chave do localStorage. O número da versão (v3) muda quando o formato dos dados muda.
const CHAVE = "ficha-de-cuidado-v3";
// S: todos os dados do sistema (estudantes, laudos e registro de acessos).
let S;
// Lê os dados salvos no navegador. Sem dados, ou com versão diferente, volta aos dados de demonstração.
function carregar() {
  try {
    const t = localStorage.getItem(CHAVE);
    if (t) {
      S = JSON.parse(t);
      if (S.v === 3) return;
    }
  } catch (e) {}
  S = semente();
}
// Salva os dados no navegador. Se o navegador impedir (modo privado, por exemplo), o erro é ignorado.
function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(S));
  } catch (e) {}
}
