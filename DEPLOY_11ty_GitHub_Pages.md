# Eleventy + GitHub Pages (Actions) - Setup & Atualização

Este guia publica o seu site **Eleventy (11ty)** usando **GitHub Pages** com **GitHub Actions**, garantindo o fluxo completo (**commit → push → site atualizado**).

> **URL curta**: mantenha o repositório `wellingtonmsantos.github.io` para servir `https://wellingtonmsantos.github.io/`.

---

## Pré-requisitos
- **Git** instalado e autenticado no GitHub.
- **Node.js** LTS (18 ou 20) + **npm**.
- Repositório **público** chamado **`wellingtonmsantos.github.io`**.

---

## 1) Inicializar o projeto (local)
No diretório do site:
```bash
npm init -y
npm i -D @11ty/eleventy
```

> Ainda sem conteúdo? Crie um `index.html` simples para validar.

---

## 2) Configuração mínima do projeto

### `package.json`
Adicione os scripts de build/servidor:
```json
{
  "scripts": {
    "build": "eleventy",
    "dev": "eleventy --serve"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0"
  }
}
```

### `.eleventy.js`
Para site na raiz do domínio (`*.github.io`), mantenha o `pathPrefix` em `/`:
```js
module.exports = function () {
  return { pathPrefix: "/" };
};
```

### `.gitignore`
Evite commitar build e dependências:
```
node_modules/
_site/
.env
```

---

## 3) Workflow do GitHub Actions
Crie **`.github/workflows/deploy.yml`**:

```yaml
name: Deploy Eleventy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> Se houver um workflow antigo ou configurações de “Deploy from branch”, remova-os para evitar conflitos.

---

## 4) Conectar ao repositório remoto e publicar a primeira versão

> **Repositório remoto:** `https://github.com/wellingtonmsantos/wellingtonmsantos.github.io`

```bash
git init
git add .
git commit -m "deploy: eleventy on gh-pages (root)"
git branch -M main
git remote add origin https://github.com/wellingtonmsantos/wellingtonmsantos.github.io.git
git push -u origin main
```

No GitHub (web), abra **Settings → Pages → Build and deployment → Source** e selecione **GitHub Actions**. Certifique-se de **não** deixar “Deploy from a branch” habilitado.

A primeira execução do workflow:
- instala dependências;
- gera `_site/` com o Eleventy;
- publica no Pages.

**URL final:** `https://wellingtonmsantos.github.io/`

---

## 5) Fluxo diário (edição → publicação)

Sempre que alterar algo:
```bash
npm run dev           # opcional: testar localmente
git status            # visualizar mudanças
git add -A
git commit -m "feat: descreva a mudança"
git push origin main  # Actions cuida do deploy
```

Para apenas disparar um rebuild (sem mudanças de conteúdo):
```bash
git commit --allow-empty -m "chore: trigger deploy"
git push
```

Antes de começar em outra máquina:
```bash
git pull origin main
```

Depois do deploy, atualize o navegador com **Ctrl + F5**.

---

## 6) Dicas e diagnóstico rápido

- **Falha no Actions?** Verifique os logs dos jobs `build` e `deploy-pages` na aba **Actions**.
- **Deploy não atualiza?** Confirme em **Settings → Pages** que a fonte continua como **GitHub Actions**.
- **Node incompatível?** Ajuste `node-version` para `18` ou `20` no workflow.
- **404 em arquivos estáticos?** Para domínios `*.github.io`, `pathPrefix: "/"` é suficiente (use `EleventyHtmlBasePlugin` + `pathPrefix` apenas para subpastas).
- **Não commite `_site/`**: a pasta é criada apenas no CI.
- **Instalou/removeu dependências?** Commits devem incluir `package.json` **e** `package-lock.json`.

---

## 7) (Opcional) Domínio próprio curto
1. Em **Settings → Pages → Custom domain**, informe o domínio (ex.: `ws.dev`).
2. No DNS do domínio, crie um **CNAME** apontando para `wellingtonmsantos.github.io`.
3. O GitHub ativa HTTPS automaticamente.

---

Pronto! O ciclo ficou automático: **edite → commit → push → site publicado**.
