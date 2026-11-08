"use strict";

// ---------- ALGORITMOS DE ORDENAÇÃO E BUSCA ---------- //
// Todos escritos à mão, sem usar sort() nem indexOf() do JavaScript,
// para que o número de comparações possa ser contado e comparado.

// ---------- ORDENAÇÃO POR INSERÇÃO ---------- //
// Recebe a lista e uma função "chave" que diz por qual valor ordenar
// (ex.: estudante => Number(estudante.eol)).
// Devolve uma cópia ordenada e quantas comparações foram feitas.
function ordenarInsercao(lista, chave) {
  // Trabalha numa cópia para não alterar a lista original
  const copia = lista.slice();
  let comparacoes = 0;

  // Começa do segundo item: o primeiro sozinho já está "ordenado"
  for (let i = 1; i < copia.length; i++) {
    const itemAtual = copia[i];
    const valorAtual = chave(itemAtual);
    let j = i - 1;

    // Empurra para a direita os itens maiores que o atual
    while (j >= 0) {
      comparacoes++;

      if (chave(copia[j]) > valorAtual) {
        copia[j + 1] = copia[j];
        j--;
      } else {
        break;
      }
    }

    // Encaixa o item atual na posição que sobrou
    copia[j + 1] = itemAtual;
  }

  return { lista: copia, comparacoes: comparacoes };
}

// ---------- BUSCA SEQUENCIAL ---------- //
// Olha item por item, do começo ao fim, até achar o valor procurado.
// Funciona com a lista em qualquer ordem.
// Devolve a posição (ou -1 se não achar) e quantas comparações foram feitas.
function buscaSequencial(lista, chave, valorProcurado) {
  let comparacoes = 0;

  for (let i = 0; i < lista.length; i++) {
    comparacoes++;

    if (chave(lista[i]) === valorProcurado) {
      return { posicao: i, comparacoes: comparacoes };
    }
  }

  // Chegou ao fim da lista sem achar
  return { posicao: -1, comparacoes: comparacoes };
}

// ---------- BUSCA BINÁRIA ---------- //
// ATENÇÃO: a lista precisa estar ordenada pela MESMA chave
// (use ordenarInsercao antes).
// A cada comparação, descarta metade da faixa que ainda falta olhar.
// Devolve a posição (ou -1 se não achar) e quantas comparações foram feitas.
function buscaBinaria(lista, chave, valorProcurado) {
  let inicio = 0;
  let fim = lista.length - 1;
  let comparacoes = 0;

  while (inicio <= fim) {
    const meio = Math.floor((inicio + fim) / 2);
    const valorDoMeio = chave(lista[meio]);
    comparacoes++;

    if (valorDoMeio === valorProcurado) {
      return { posicao: meio, comparacoes: comparacoes };
    }

    if (valorDoMeio < valorProcurado) {
      // O valor só pode estar na metade da direita
      inicio = meio + 1;
    } else {
      // O valor só pode estar na metade da esquerda
      fim = meio - 1;
    }
  }

  // A faixa acabou sem achar o valor
  return { posicao: -1, comparacoes: comparacoes };
}

// ---------- CHAVES DE ORDENAÇÃO ---------- //
// Transforma o código EOL (texto) em número, para comparar 1000002 < 1000010
// corretamente (como texto, "1000010" viria antes de "1000002").
const chaveEOL = (estudante) => Number(estudante.eol);
