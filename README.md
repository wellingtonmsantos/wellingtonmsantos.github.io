## Site Wellington Santos

Este repositório contém o site estático construído com [Eleventy](https://www.11ty.dev/).

### Requisitos

- Node.js 18 ou superior (recomendado LTS)
- npm (instalado junto com o Node.js)

### Instalação

`Bash
npm install
`

### Desenvolvimento local

`Bash
npm start
`

Eleventy iniciará o servidor em http://localhost:8080/ com live reload.

### Build

`Bash
npm run build
`

Os arquivos gerados ficam na pasta _site/.

### Deploy com GitHub Pages

1. Crie um repositório no GitHub e conecte o projeto:
   `Bash
   git remote add origin git@github.com:SEU_USUARIO/site-well.git
   git add .
   git commit -m "chore: inicializa site Eleventy"
   git push -u origin main
   `
2. Adicione a workflow em .github/workflows/eleventy.yml (já presente no projeto) para buildar e enviar o conteúdo de _site.
3. No GitHub, acesse **Settings → Pages** e selecione **GitHub Actions** como fonte.
4. Aguarde o workflow terminar; seu site estará disponível em https://SEU_USUARIO.github.io/site-well/.

### Estrutura principal

- index.njk – página principal
- casos/ – dados dos casos de clientes
- projetos/ – projetos em destaque
- rtigos/ – conteúdos publicados
- _includes/ – layouts e componentes Nunjucks
- ssets/ – CSS, JS e imagens

### Scripts adicionais

- 
pm run lint – roda HTMLHint e Stylelint
- 
pm run clean – remove a pasta _site

### Licença

Defina aqui a licença de acordo com a sua necessidade (por exemplo, MIT).
