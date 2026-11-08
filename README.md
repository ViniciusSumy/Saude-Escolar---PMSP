<div align="center">
🩺 Ficha de Cuidado

Cobranças do dia, laudos e fichas de saúde num só lugar. Protótipo web para a secretaria escolar acompanhar prazos sem expor dados de saúde.

<br>

Demo online Mostrar Imagem

Mostrar Imagem Mostrar Imagem Mostrar Imagem Mostrar Imagem Mostrar Imagem Mostrar Imagem

<sub>Projeto Integrador de Laboratório de Programação · Universidade Santo Amaro (UNISA) · 2026</sub>

</div>
✨ O que é

Na secretaria de uma escola municipal, laudos de dieta, declarações de vacinação (DVA) e fichas de saúde chegam em papel, têm prazo de validade e precisam ser cobrados das famílias. Quando um prazo passa despercebido, o processo precisa ser refeito.

A Ficha de Cuidado reúne tudo numa tela diária, com responsável e prazo, e mostra a cada função só o que ela precisa saber para agir.

⚠️ Protótipo acadêmico. Todos os dados são fictícios, o login é simulado e não há integração com o EOL, o SIGPAE nem com sistemas de saúde.

🚀 Teste agora

Online: https://viniciussumy.github.io/Saude-Escolar---PMSP/

Local: baixe o projeto e abra o index.html no navegador. Sem instalação, sem servidor, sem npm install.

Usuário	Senha	Perfil	O que faz
secretaria	demo123	Secretaria	Cobra as famílias e registra o que chega
gestao	demo123	Gestão	Faz o mesmo, confere e envia os laudos e vê o registro de acessos
🧩 Funcionalidades
	
📅 Hoje	Cobranças vencidas, próximas do vencimento e sem prazo, cada uma com o responsável
🥗 Laudos de dieta	Etapas do laudo, validade de 12 meses e aviso 30 dias antes do vencimento
📋 Fichas de saúde e DVA	Prazo de 30 dias após a matrícula e controle da declaração de vacinação
🪪 Cartão de cuidado	Versão para imprimir que diz o que o professor deve fazer, sem diagnóstico
💬 WhatsApp	Mensagem pronta para cobrar a família, sem informação de saúde
🔒 Privacidade por perfil	Cada função vê só o que precisa; as listas mostram apenas as iniciais
🧾 Registro de acessos	Quem abriu ou alterou cada ficha, quando e o quê (Gestão)
🧪 Experimento	Compara busca sequencial e binária com 100, 1.000 e 10.000 registros
🌗 Tema claro e escuro	Funciona no celular e imprime bem
🔄 Jornada do laudo
aprovado
devolvido
complemento
Recebido pela Secretaria
Conferido pela Gestão
Enviado à CODAE
Retorno
Em vigor por 12 meses
Cancelado ou substituído
⚙️ Algoritmos

Escritos à mão em assets/js/algoritmos.js, sem bibliotecas.

Função	O que faz
ordenarInsercao(lista, chave)	Ordena uma cópia da lista e devolve o número de comparações
buscaSequencial(lista, chave, valor)	Percorre item a item
buscaBinaria(lista, chave, valor)	Divide a faixa ao meio a cada comparação (lista já ordenada)
chaveEOL(codigo)	Transforma o código EOL em número para servir de chave
<details> <summary><b>📊 Resultado do experimento</b> (média de 10 execuções, Node.js 22)</summary> <br>
Registros	Comparações por busca: sequencial	Comparações por busca: binária	Ordenação: comparações	Ordenação: tempo
100	50,9	5,8	2.645	0,1 ms
1.000	495,7	9,0	248.432	1,9 ms
10.000	4.923,6	12,4	25.000.785	161,5 ms

Quando a lista cresce cem vezes, a busca sequencial cresce cerca de cem vezes e a binária pouco mais que dobra. A ordenação se paga depois de cerca de 59, 510 e 5.090 buscas. Os tempos dependem da máquina; o número de comparações depende do algoritmo e dos dados.

Para rodar no navegador, entre no sistema e abra a aba Experimento.

</details>
🗂️ Estrutura
Saude-Escolar---PMSP/
├── index.html              página única (o JavaScript troca as telas)
└── assets/
    ├── css/                variaveis · reset · style · responsivo
    └── js/                 carregados nesta ordem pelo index.html
        ├── utilidades.js   datas no horário local, escape de HTML
        ├── perfis.js       Secretaria, Gestão e permissões
        ├── dados.js        dados fictícios e localStorage
        ├── sessao.js       login simulado e registro de acessos
        ├── algoritmos.js   ordenação e buscas
        ├── pendencias.js   cobranças com responsável e prazo
        ├── telas.js        telas do sistema
        └── script.js       eventos e início

Os scripts são comuns (não módulos), para o index.html abrir direto do computador.

🔐 Proteção de dados

Dados de saúde são dados pessoais sensíveis e, no caso de crianças, o tratamento deve atender ao melhor interesse delas (LGPD, art. 14). Por isso:

cada perfil vê somente o que precisa para agir
diagnóstico e código de doença não entram na ficha
as listas mostram só as iniciais dos estudantes
o WhatsApp não leva informação de saúde
cada acesso fica no registro de acessos
🛣️ Roadmap
 Levantamento da rotina e das regras da secretaria
 Perfis, telas e dados fictícios
 Ordenação por inserção e busca binária
 Experimento com 100, 1.000 e 10.000 registros
 Artigo científico
 Teste com usuários reais
 Servidor, banco de dados e login institucional
 Acesso para saúde (UBS), NAAPA e outros órgãos, cada um vendo só o que lhe cabe
👨‍💻 Autor

Vinícius Marques da Silva · Tecnologia em Gestão da Tecnologia da Informação, UNISA Orientador: Prof. Me. Patrick Araújo