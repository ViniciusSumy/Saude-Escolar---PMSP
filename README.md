# Ficha de Cuidado: acompanhamento escolar de laudos, DVA e cuidados (protótipo)

Projeto Integrador de Laboratório de Programação, Universidade Santo Amaro (UNISA), 2026.

Protótipo web, em HTML, CSS e JavaScript puros, para a escola acompanhar laudos de dieta, a Declaração de Vacinação Atualizada (DVA), orientações de emergência e encaminhamentos ao NAAPA. Nesta fase, só a escola tem acesso. Saúde (UBS), NAAPA e outros órgãos ficam para fases futuras.

## Demonstração

- Online (GitHub Pages): `https://viniciussumy.github.io/Saude-Escolar---PMSP/` (ativar em Settings → Pages)
- Local: abra o `index.html` no navegador. Não há instalação nem servidor, e a página não carrega nada de fora.

## Estrutura de pastas

```
ficha-de-cuidado/
├── index.html              # página única (o JavaScript troca as telas)
├── README.md
├── .gitignore
├── assets/
│   ├── favicon.svg
│   ├── css/
│   │   ├── variaveis.css   # cores (claro e escuro), tipografia, espaçamento
│   │   ├── reset.css       # base, foco visível, acessibilidade
│   │   ├── style.css       # componentes
│   │   └── responsivo.css  # tablet, celular e impressão
│   └── js/                 # carregados nesta ordem pelo index.html
│       ├── utilidades.js   # datas no horário local, escape de HTML
│       ├── perfis.js       # Secretaria e Gestão, permissões
│       ├── dados.js        # dados fictícios e localStorage
│       ├── sessao.js       # login simulado e registro de acessos
│       ├── algoritmos.js   # ordenação por inserção, busca sequencial e binária
│       ├── pendencias.js   # cobranças com responsável e prazo
│       ├── telas.js        # telas do sistema
│       └── script.js       # eventos e início
└── docs/                   # requisitos e artigo (PDF)
```

Os scripts são comuns (não módulos), para o `index.html` abrir direto do computador, sem servidor.

## Contas de demonstração (senha: `demo123`)

| Usuário | Perfil | Acessa |
|---|---|---|
| `secretaria` | Secretaria | Cobranças às famílias, recebimento de laudo e DVA, orientação de emergência, cartão de cuidado, observações e encaminhamento ao NAAPA |
| `gestao` | Gestão | Tudo o que a secretaria faz, mais conferência e envio do laudo à CODAE pelo SIGPAE, retorno, cancelamento, devolutiva do NAAPA e registro de acessos |

Códigos EOL de demonstração: `1000001` a `1000008` (unidade 999999). O código `2000009` é de outra unidade e não aparece para a escola.

## Aviso

Todos os dados são **fictícios**. O login é simulado e não há integração com o EOL, com o SIGPAE nem com sistemas de saúde. Em produção seriam necessários servidor, banco de dados e autenticação institucional.

## Autores

- Vinícius Marques da Silva (RA 5899699), Curso Superior de Tecnologia em Gestão de Tecnologia da Informação, viniciusmarques1x@estudante.unisa.br
- Orientador: Prof. Me. Patrick Araújo
