# Site pessoal – Wellington Santos

Este repositório contém o código-fonte do site pessoal de Wellington Santos, construído com **Eleventy (11ty)** e publicado automaticamente no **GitHub Pages**.

## 🚀 Tech stack
- [Eleventy](https://www.11ty.dev/) para geração estática
- [Nunjucks](https://mozilla.github.io/nunjucks/) para templates
- Markdown como formato principal de conteúdo
- Workflows do GitHub Actions para build e deploy contínuo

## 📦 Pré-requisitos
- Node.js 18 ou 20
- npm (instalado junto com o Node.js)
- Git configurado e autenticado no GitHub

## 🛠️ Scripts úteis
```bash
npm install        # instala dependências
npm run dev        # inicia servidor local em modo watch
npm run build      # gera a pasta _site pronta para deploy
npm run clean      # remove a pasta _site
npm run lint       # executa validações HTML e CSS
```

## 🗂️ Estrutura principal
```
.
├── artigos/                  # posts e artigos por tema
├── casos/                    # estudos de caso
├── projetos/                 # projetos e palestras
├── assets/                   # CSS, imagens e estáticos
├── _includes/                # layouts Nunjucks
├── _data/                    # dados globais
├── index.njk                 # homepage
├── .eleventy.js              # configuração do Eleventy
└── .github/workflows/        # workflow de deploy
```

## 🌐 Deploy automático
O repositório utiliza o workflow `Deploy Eleventy to GitHub Pages`, que é disparado a cada push no branch `main`. Certifique-se de que em **Settings → Pages → Build and deployment → Source** a opção **GitHub Actions** esteja selecionada.

Em caso de dúvida, consulte o guia detalhado em `DEPLOY_11ty_GitHub_Pages.md`.

## 🤝 Contribuindo
1. Crie um fork ou branch a partir de `main`.
2. Rode `npm run dev` para desenvolver localmente.
3. Garanta que `npm run lint` e `npm run build` estejam passando.
4. Abra um Pull Request descrevendo as mudanças.

## 📄 Licença
Projeto licenciado sob ISC – veja `package.json` para mais detalhes.
