/* Ordenação por inserção, busca sequencial e busca binária (escritas à mão) */
"use strict";
/* ---------- Algoritmos escritos à mão: ordenação por inserção, busca sequencial e busca binária ---------- */
// Ordena uma cópia da lista pelo valor que chave(item) devolve, contando as comparações.
function ordenarInsercao(lista,chave){
  const a=lista.slice();let comparacoes=0;
  for(let i=1;i<a.length;i++){
    const atual=a[i],k=chave(atual);let j=i-1;
    while(j>=0){comparacoes++;if(chave(a[j])>k){a[j+1]=a[j];j--}else break}
    a[j+1]=atual}
  return {lista:a,comparacoes}}
// Percorre a lista item a item até achar o valor procurado.
function buscaSequencial(lista,chave,alvo){
  let comparacoes=0;
  for(let i=0;i<lista.length;i++){comparacoes++;if(chave(lista[i])===alvo)return {posicao:i,comparacoes}}
  return {posicao:-1,comparacoes}}
// Divide ao meio uma lista já ordenada pela mesma chave até achar o valor ou esgotar a faixa.
function buscaBinaria(lista,chave,alvo){
  let inicio=0,fim=lista.length-1,comparacoes=0;
  while(inicio<=fim){const meio=Math.floor((inicio+fim)/2),v=chave(lista[meio]);comparacoes++;
    if(v===alvo)return {posicao:meio,comparacoes};
    if(v<alvo)inicio=meio+1;else fim=meio-1}
  return {posicao:-1,comparacoes}}
const chaveEOL=e=>Number(e.eol);

