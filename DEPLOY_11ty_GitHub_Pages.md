# Eleventy + GitHub Pages (Actions) — Setup & Atualização

Este guia coloca seu site **Eleventy (11ty)** no ar usando **GitHub Pages** com **GitHub Actions** e mostra o fluxo de **atualização em um único lugar** (commit → push → publica).

> **URL curta**: use o repositório especial `wellingtonmsantos.github.io` para o site principal em `https://wellingtonmsantos.github.io/`.

---

## ✅ Pré‑requisitos
- **Git** instalado e autenticado no GitHub.
- **Node.js** LTS (18 ou 20) + **npm**.
- Repositório **público** no GitHub chamado **`wellingtonmsantos.github.io`** (já criado).

---

## 1) Inicializar o projeto (local)
No diretório do seu site:
```bash
npm init -y
npm i -D @11ty/eleventy
```

> Se ainda não houver conteúdo, crie um `index.html` simples para testar.

---

## 2) Configuração mínima de projeto

### `package.json`
Adicione os scripts de build/servidor de desenvolvimento:
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

### `.eleventy.js` (opcional e enxuto)
Para site na raiz do domínio, manter o *pathPrefix* em `/`:
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
Crie o arquivo **`.github/workflows/deploy.yml`**:

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

---

## 4) Conectar ao repositório remoto e publicar a primeira versão

> **Repositório alvo:** `https://github.com/wellingtonmsantos/wellingtonmsantos.github.io`

```bash
git init
git add .
git commit -m "deploy: eleventy on gh-pages (root)"
git branch -M main
git remote add origin https://github.com/wellingtonmsantos/wellingtonmsantos.github.io.git
git push -u origin main
```

No GitHub (web), vá em **Settings → Pages** e, em **Source**, selecione **GitHub Actions**.

A primeira execução do workflow:
- instala dependências;
- gera `_site/` com o Eleventy;
- publica no Pages.

**URL:** `https://wellingtonmsantos.github.io/`

---

## 5) Fluxo de atualização em um único lugar (dia a dia)

Sempre que alterar algo localmente:
```bash
npm run dev           # opcional: validar localmente
git status            # ver o que mudou
git add -A
git commit -m "feat: descreva a mudança aqui"
git push origin main  # o Actions publica automaticamente
```

Para pegar mudanças feitas em outro computador antes de começar:
```bash
git pull origin main
```

Forçar recarregamento no navegador se não aparecer na hora: **Ctrl + F5**.

---

## 6) Dicas e diagnóstico rápido

- **Falha no Actions?** Abra a aba **Actions** no GitHub e verifique os logs do job `build` e `deploy-pages`.
- **Node incompatível?** Ajuste `node-version` para `18` ou `20` no workflow.
- **404 em CSS/JS?** Para o site raiz `*.github.io`, `pathPrefix: "/"` é suficiente. (Se migrar para subpasta, use `EleventyHtmlBasePlugin` + `pathPrefix` correspondente.)
- **Não commitar `_site/`**: ele é gerado no CI.
- **Instalou/Removeu pacotes?** O commit deve incluir `package.json` **e** `package-lock.json`.

---

## 7) (Opcional) Domínio próprio curto
1. Em **Settings → Pages → Custom domain**, informe seu domínio (ex.: `ws.dev`).
2. No DNS do seu domínio, crie um **CNAME** apontando para `wellingtonmsantos.github.io`.
3. O GitHub configura HTTPS automaticamente.

---

### Pronto!
Você tem deploy automatizado: **edite → commit → push → publicado**.
