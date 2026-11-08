/* Experimento: compara a busca sequencial e a busca binária com 100, 1.000 e 10.000 registros fictícios */
"use strict";

// Resultado da última rodada (null = ainda não rodou).
let resultadoExp = null;
// Para cada tamanho: cria registros com código EOL único, embaralha, ordena por inserção e faz 200 buscas de códigos que existem, sequenciais e binárias.
// Mede comparações e tempo. binPior é o pior caso da busca binária: floor(log2 n) + 1 comparações.
function rodarExperimento() {
  const linhas = [];
  for (const n of [100, 1000, 10000]) {
    // Registros fictícios: códigos EOL únicos, embaralhados.
    const regs = [];
    for (let i = 0; i < n; i++) regs.push({ eol: String(3000000 + i * 7) });
    for (let i = regs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [regs[i], regs[j]] = [regs[j], regs[i]];
    }
    let t = performance.now();
    const ord = ordenarInsercao(regs, chaveEOL);
    const tOrd = performance.now() - t;
    const alvos = [];
    for (let k = 0; k < 200; k++) alvos.push(chaveEOL(regs[Math.floor(Math.random() * n)]));
    let cs = 0,
      cb = 0;
    t = performance.now();
    for (const a of alvos) cs += buscaSequencial(regs, chaveEOL, a).comparacoes;
    const tSeq = performance.now() - t;
    t = performance.now();
    for (const a of alvos) cb += buscaBinaria(ord.lista, chaveEOL, a).comparacoes;
    const tBin = performance.now() - t;
    linhas.push({
      n,
      ordComp: ord.comparacoes,
      ordMs: tOrd,
      seqMed: cs / alvos.length,
      seqMs: tSeq,
      binMed: cb / alvos.length,
      binMs: tBin,
      binPior: Math.floor(Math.log2(n)) + 1,
    });
  }
  return linhas;
}
// Número no formato brasileiro, com d casas decimais.
const num = (x, d = 0) =>
  x.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
// Tela Experimento: botão para rodar e tabela com as médias por busca. Os botões são tratados no script.js.
function telaExperimento() {
  const R = resultadoExp;
  return `<h1 tabindex="-1">Experimento de busca e ordenação</h1><p class="lead">Compara a busca sequencial e a busca binária com 100, 1.000 e 10.000 registros fictícios. Cada rodada ordena os registros por inserção e faz 200 buscas de códigos que existem.</p>
  <div class="linha-bt u-mb4"><button class="bt" id="rodar-exp">${R ? "Rodar de novo" : "Rodar o experimento"}</button>${R ? '<button class="bt sec" id="copiar-exp">Copiar resultados em CSV</button>' : ""}</div>
  ${
    R
      ? `<div class="rolagem"><table class="tb"><caption>Médias por busca. Os tempos variam a cada rodada e de um computador para outro.</caption><thead><tr><th scope="col">Registros</th><th scope="col">Ordenação por inserção: comparações</th><th scope="col">Ordenação: tempo (ms)</th><th scope="col">Sequencial: comparações por busca</th><th scope="col">Binária: comparações por busca</th><th scope="col">Binária: pior caso</th><th scope="col">200 buscas sequenciais (ms)</th><th scope="col">200 buscas binárias (ms)</th></tr></thead><tbody>
  ${R.map((r) => `<tr><td>${num(r.n)}</td><td>${num(r.ordComp)}</td><td>${num(r.ordMs, 1)}</td><td>${num(r.seqMed, 1)}</td><td>${num(r.binMed, 1)}</td><td>${num(r.binPior)}</td><td>${num(r.seqMs, 2)}</td><td>${num(r.binMs, 2)}</td></tr>`).join("")}</tbody></table></div>
  <p class="nota">A busca binária só funciona com a lista ordenada pela mesma chave. Ordenar custa caro uma vez; depois, cada busca fica muito mais barata. O pior caso da binária é o piso de log₂ n mais 1.</p>`
      : `<p class="vazio">Ainda não rodou. Com 10.000 registros, a ordenação por inserção pode levar alguns segundos.</p>`
  }`;
}
