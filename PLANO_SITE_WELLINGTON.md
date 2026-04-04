# Plano de Desenvolvimento — Site Wellington Santos
> Usar com **Claude Code** via terminal dentro de `C:\Dev\well-site`
> Stack: Eleventy (11ty) · Nunjucks · Markdown · GitHub Pages · Decap CMS

---

## Contexto do Projeto

Site pessoal de portfólio unificado com objetivo de:
1. Mostrar autoridade nas 4 modalidades de coaching
2. Listar publicações científicas (13 artigos)
3. Exibir cases de alunos com depoimentos
4. Converter visitantes em clientes de consultoria
5. Ter painel de edição visual (`/admin`) sem precisar abrir código

**Repositório:** `https://github.com/wellingtonmsantos/wellingtonmsantos.github.io`
**Local:** `C:\Dev\well-site`
**Deploy:** automático via GitHub Actions a cada `git push main`

---

## Stack Completa

### Mantém (já existe e funciona)
| Tecnologia | Papel |
|---|---|
| Eleventy (11ty) | Gerador de site estático |
| Nunjucks (.njk) | Templates HTML |
| Markdown (.md) | Conteúdo de artigos, projetos, casos |
| `_data/*.json` | Dados globais (site, modalidades, etc.) |
| CSS customizado | Estilo (glass-panel, bento-grid, cyber-gradient) |
| GitHub Pages | Hospedagem gratuita |
| GitHub Actions | CI/CD automático |
| `.eleventy.js` | Config central com filtros e collections |

### Adiciona (novo)
| Tecnologia | Papel |
|---|---|
| Decap CMS | Painel visual `/admin` para edição sem código |
| GitHub OAuth | Autenticação do painel (usa conta GitHub) |
| `_data/modalidades.json` | Dados das 4 modalidades |
| `_data/publicacoes.json` | Dados dos 13 artigos científicos |
| `_includes/partials/publication-card.njk` | Card de publicação científica |

---

## Estrutura de Arquivos (após o plano)

```
C:\Dev\well-site\
├── _data\
│   ├── site.json              # config geral (existente)
│   ├── modalidades.json       # ← NOVO: dados das 4 modalidades
│   └── publicacoes.json       # ← NOVO: 13 artigos científicos
├── _includes\
│   └── partials\
│       ├── case-card.njk      # existente
│       ├── project-card.njk   # existente
│       ├── article-card.njk   # existente
│       └── publication-card.njk  # ← NOVO
├── admin\                     # ← NOVO: painel Decap CMS
│   ├── index.html
│   └── config.yml
├── artigos\                   # existente
├── casos\                     # existente
├── projetos\                  # existente
├── assets\
│   └── css\
│       └── style.css          # adicionar estilos de publicações
├── index.njk                  # editar: modalidades + publicações + nav
├── sections.config.json       # adicionar: "publicacoes": true
├── .eleventy.js               # manter/verificar filtros
└── package.json               # existente
```

---

## Fase 1 — Modalidades (4 cards completos)

**Objetivo:** Substituir os 3 cards atuais (Personal, CrossFit, HYROX) por 4 cards orientados a dados, movendo o conteúdo para JSON.

**Estimativa:** ~1 hora

### 1.1 — Criar `_data/modalidades.json`

Criar o arquivo com a estrutura abaixo. O Claude Code deve gerar o arquivo completo:

```json
[
  {
    "slug": "personal-trainer",
    "titulo": "Personal Trainer",
    "badges": ["Presencial", "Online"],
    "descricao": "Atendimento individual com controle de carga, dados fisiológicos e feedback contínuo para evolução segura e consistente.",
    "bullets": [
      "Planejamento 100% personalizado",
      "Monitoramento de progresso com dados",
      "Relatórios mensais mensuráveis"
    ],
    "cta": "Quero treino personalizado"
  },
  {
    "slug": "crossfit",
    "titulo": "CrossFit",
    "badges": ["Presencial", "Online"],
    "descricao": "Periodização e ajuste de intensidade em contextos de alta exigência, com foco em técnica, performance e longevidade.",
    "bullets": [
      "Gestão de volume e intensidade",
      "Prevenção de lesões com análise de movimento",
      "Métricas de performance por ciclo"
    ],
    "cta": "Quero evoluir no CrossFit"
  },
  {
    "slug": "hyrox",
    "titulo": "HYROX",
    "badges": ["Presencial", "Online"],
    "descricao": "Preparação para provas híbridas unindo resistência, força e recuperação baseada em dados fisiológicos.",
    "bullets": [
      "Estratégia por blocos (meso/micro)",
      "Testes e checkpoints de performance",
      "Controle de recuperação (HRR/sono)"
    ],
    "cta": "Quero me preparar para HYROX"
  },
  {
    "slug": "treino-hibrido",
    "titulo": "Treino Híbrido",
    "badges": ["Presencial", "Online"],
    "descricao": "Combinação inteligente de musculação e endurance para quem quer força e resistência ao mesmo tempo, sem sacrificar um pelo outro.",
    "bullets": [
      "Periodização dual: força + cardio",
      "Equilíbrio entre modalidades sem overtraining",
      "Protocolo baseado em evidência científica"
    ],
    "cta": "Quero treino híbrido"
  }
]
```

### 1.2 — Atualizar `index.njk` — section `#modalidades`

Substituir o bloco estático dos 3 cards pela iteração dinâmica via JSON:

```nunjucks
{% if site.sections.modalidades | default(true) %}
<section class="atuo section" id="modalidades" aria-labelledby="atuo-title">
  <div class="container section__header">
    <h2 id="atuo-title">Modalidades</h2>
    <p>Ciência aplicada a cada estilo de treino</p>
  </div>
  <div class="container">
    <div class="atuo__grid bento-grid">
      {% for m in modalidades %}
      <article class="atuo-card glass-panel">
        <h3 class="atuo-card__title" style="display:flex;align-items:center;justify-content:space-between;">
          {{ m.titulo }}
          <svg class="ecg-svg" width="40" height="20" viewBox="0 0 40 20" stroke="var(--color-accent)" stroke-width="2" fill="none" stroke-linejoin="round">
            <polyline points="0,10 10,10 15,2 20,18 25,10 40,10"></polyline>
          </svg>
        </h3>
        <div class="atuo-card__badges">
          {% for badge in m.badges %}
          <span class="atuo-card__badge atuo-card__badge--{{ badge | lower }}">{{ badge }}</span>
          {% endfor %}
        </div>
        <p class="atuo-card__text">{{ m.descricao }}</p>
        <ul class="atuo-card__bullets">
          {% for bullet in m.bullets %}
          <li>{{ bullet }}</li>
          {% endfor %}
        </ul>
      </article>
      {% endfor %}
    </div>
    <div class="section__cta" style="margin-top:3rem;text-align:center;">
      <a class="button button--primary" href="https://wa.me/5519920034839">
        Falar com especialista
      </a>
    </div>
  </div>
</section>
{% endif %}
```

### 1.3 — Atualizar filtros da seção `#casos`

No `index.njk`, dentro do `<select id="filter-modalidade">`, adicionar as opções novas:

```html
<option value="Treino Híbrido">Treino Híbrido</option>
<option value="Musculação">Musculação</option>
```

### 1.4 — Verificar e testar localmente

```bash
cd C:\Dev\well-site
npm run dev
# Abrir http://localhost:8080 e conferir os 4 cards
```

---

## Fase 2 — Publicações Científicas (seção nova)

**Objetivo:** Criar seção `/publicacoes` com os 13 artigos, cada um com resumo e link DOI.

**Estimativa:** ~1 hora

### 2.1 — Criar `_data/publicacoes.json`

Estrutura base — Wellington deve preencher com os dados reais de cada artigo:

```json
[
  {
    "titulo": "Título completo do artigo",
    "autores": "Santos W, Autor B, Autor C",
    "revista": "Nome da Revista",
    "ano": 2023,
    "doi": "https://doi.org/10.xxxx/xxxxx",
    "area": "fisiologia",
    "resumo": "Resumo de 2-3 linhas explicando o que foi estudado, o método e o principal achado do estudo.",
    "destaque": true
  }
]
```

**Campos de `area` válidos:** `fisiologia` · `cognição` · `dados` · `saúde` · `performance`

**Repetir para os 13 artigos.** Os que têm `"destaque": true` aparecem primeiro.

### 2.2 — Criar `_includes/partials/publication-card.njk`

```nunjucks
<article class="pub-card glass-panel" data-area="{{ publicacao.area }}">
  <div class="pub-card__header">
    <span class="pub-card__badge pub-card__badge--{{ publicacao.area }}">
      {{ publicacao.area | capitalize }}
    </span>
    <span class="pub-card__year">{{ publicacao.ano }}</span>
  </div>
  <h3 class="pub-card__title">{{ publicacao.titulo }}</h3>
  <p class="pub-card__authors">{{ publicacao.autores }}</p>
  <p class="pub-card__journal">
    <em>{{ publicacao.revista }}</em>
  </p>
  <p class="pub-card__resumo">{{ publicacao.resumo }}</p>
  {% if publicacao.doi %}
  <a class="pub-card__link" href="{{ publicacao.doi }}" target="_blank" rel="noopener">
    Ver artigo completo →
  </a>
  {% endif %}
</article>
```

### 2.3 — Adicionar section `#publicacoes` no `index.njk`

Inserir após a section `#sobre` e antes de `#modalidades`:

```nunjucks
{% if site.sections.publicacoes | default(true) %}
<section class="publications section" id="publicacoes">
  <div class="container section__header">
    <h2>Publicações Científicas</h2>
    <p>{{ publicacoes | length }} artigos peer-reviewed em periódicos internacionais</p>
  </div>

  <div class="container">
    <div class="tabs-with-label">
      <label class="tabs-label">Área:</label>
      <div class="pub-filters">
        <button class="pub-filter is-active" data-area="todos">Todos</button>
        <button class="pub-filter" data-area="fisiologia">Fisiologia</button>
        <button class="pub-filter" data-area="cognição">Cognição</button>
        <button class="pub-filter" data-area="performance">Performance</button>
        <button class="pub-filter" data-area="saúde">Saúde</button>
        <button class="pub-filter" data-area="dados">Dados</button>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="pub-grid bento-grid" id="pub-grid">
      {% for publicacao in publicacoes | sort(true, false, 'ano') %}
        {% include "partials/publication-card.njk" %}
      {% endfor %}
    </div>
  </div>
</section>
{% endif %}
```

### 2.4 — Atualizar `sections.config.json`

```json
{
  "hero": true,
  "sobre": true,
  "publicacoes": true,
  "modalidades": true,
  "casos": true,
  "projetos": true,
  "videos": false,
  "artigos": true,
  "contato": true
}
```

### 2.5 — Adicionar link no nav do `index.njk`

```html
<li><a href="#publicacoes">Publicações</a></li>
```

### 2.6 — Adicionar CSS em `assets/css/style.css`

```css
/* Publication cards */
.pub-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.pub-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pub-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pub-card__badge {
  font-size: 0.7rem;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pub-card__badge--fisiologia  { background: rgba(29,158,117,0.15); color: #1D9E75; }
.pub-card__badge--cognição    { background: rgba(20,122,255,0.15);  color: #147aff; }
.pub-card__badge--performance { background: rgba(234,89,56,0.15);   color: #ea5938; }
.pub-card__badge--saúde       { background: rgba(139,92,246,0.15);  color: #8b5cf6; }
.pub-card__badge--dados       { background: rgba(245,158,11,0.15);  color: #f59e0b; }

.pub-card__year {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.pub-card__title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
}

.pub-card__authors {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.pub-card__journal {
  font-size: 0.8rem;
  color: var(--color-accent);
}

.pub-card__resumo {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-muted);
  flex: 1;
}

.pub-card__link {
  font-size: 0.85rem;
  color: var(--color-accent);
  text-decoration: none;
  margin-top: 0.5rem;
  font-weight: 500;
}

.pub-card__link:hover {
  text-decoration: underline;
}

/* Filtros de publicações */
.pub-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pub-filter {
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid var(--color-border, rgba(255,255,255,0.1));
  background: transparent;
  color: var(--color-muted);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.pub-filter.is-active,
.pub-filter:hover {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}
```

### 2.7 — Adicionar JS de filtro (no final de `assets/js/scripts.js`)

```javascript
// Filtro de publicações
document.querySelectorAll('.pub-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pub-filter').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const area = btn.dataset.area;
    document.querySelectorAll('.pub-card').forEach(card => {
      card.style.display = (area === 'todos' || card.dataset.area === area) ? '' : 'none';
    });
  });
});
```

---

## Fase 3 — Painel de Edição (Decap CMS)

**Objetivo:** Acessar `seusite.github.io/admin`, logar com GitHub e editar qualquer conteúdo do site por formulários visuais, sem abrir código.

**Estimativa:** ~2 horas

### 3.1 — Criar `admin/index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin | Wellington Santos</title>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### 3.2 — Criar `admin/config.yml`

```yaml
backend:
  name: github
  repo: wellingtonmsantos/wellingtonmsantos.github.io
  branch: main

media_folder: assets/img/uploads
public_folder: /assets/img/uploads

collections:

  # ── ALUNOS / CASES ──────────────────────────────────────────
  - name: casos
    label: Alunos & Cases
    folder: casos
    create: true
    slug: "{{slug}}"
    extension: md
    format: frontmatter
    fields:
      - { label: Nome, name: title, widget: string }
      - { label: Visível no site, name: visible, widget: boolean, default: true }
      - { label: Idade, name: idade, widget: number }
      - { label: Profissão, name: profissao, widget: string }
      - { label: Modalidade, name: modalidade, widget: select,
          options: [Personal Trainer, CrossFit, HYROX, Treino Híbrido, Musculação] }
      - { label: Formato, name: formato, widget: select,
          options: [Presencial, Online] }
      - { label: Tipo, name: tipo, widget: select,
          options: [pessoa, empresa] }
      - { label: Objetivo, name: objetivo, widget: string }
      - { label: Resultado, name: resultado, widget: string }
      - { label: Tempo de treino, name: tempo, widget: string,
          hint: "Ex: 6 meses, 1 ano" }
      - { label: Depoimento, name: depoimento, widget: text }
      - { label: Foto (opcional), name: foto, widget: image, required: false }
      - { label: Objetivo (tag), name: objetivo_tag, widget: select,
          options: [Performance, Saude], required: false }

  # ── PROJETOS ────────────────────────────────────────────────
  - name: projetos
    label: Projetos
    folder: projetos
    create: true
    slug: "{{slug}}"
    extension: md
    format: frontmatter
    fields:
      - { label: Título, name: title, widget: string }
      - { label: Visível no site, name: visible, widget: boolean, default: true }
      - { label: Categoria, name: category, widget: select,
          options: [tecnologia, palestras, outros] }
      - { label: Descrição curta, name: description, widget: text }
      - { label: Link (opcional), name: link, widget: string, required: false }
      - { label: Imagem (opcional), name: imagem, widget: image, required: false }
      - { label: Data, name: date, widget: date }
      - { label: Conteúdo, name: body, widget: markdown }

  # ── ARTIGOS / CONTEÚDO ──────────────────────────────────────
  - name: artigos
    label: Artigos & Conteúdo
    folder: artigos
    create: true
    slug: "{{slug}}"
    extension: md
    format: frontmatter
    fields:
      - { label: Título, name: title, widget: string }
      - { label: Visível no site, name: visible, widget: boolean, default: true }
      - { label: Categoria, name: category, widget: select,
          options: [performance, saude, dados, tecnologia] }
      - { label: Descrição curta, name: description, widget: text }
      - { label: Data, name: date, widget: date }
      - { label: Imagem (opcional), name: imagem, widget: image, required: false }
      - { label: Conteúdo, name: body, widget: markdown }

  # ── PUBLICAÇÕES CIENTÍFICAS ──────────────────────────────────
  - name: publicacoes
    label: Publicações Científicas
    files:
      - label: Lista de Publicações
        name: publicacoes
        file: _data/publicacoes.json
        fields:
          - label: Artigos
            name: publicacoes
            widget: list
            fields:
              - { label: Título, name: titulo, widget: string }
              - { label: Autores, name: autores, widget: string }
              - { label: Revista, name: revista, widget: string }
              - { label: Ano, name: ano, widget: number }
              - { label: DOI / Link, name: doi, widget: string, required: false }
              - { label: Área, name: area, widget: select,
                  options: [fisiologia, cognição, performance, saúde, dados] }
              - { label: Resumo, name: resumo, widget: text }
              - { label: Destaque, name: destaque, widget: boolean, default: false }

  # ── MODALIDADES ─────────────────────────────────────────────
  - name: modalidades-data
    label: Modalidades
    files:
      - label: Lista de Modalidades
        name: modalidades
        file: _data/modalidades.json
        fields:
          - label: Modalidades
            name: modalidades
            widget: list
            fields:
              - { label: Slug, name: slug, widget: string }
              - { label: Título, name: titulo, widget: string }
              - { label: Badges, name: badges, widget: list,
                  field: { label: Badge, name: badge, widget: string } }
              - { label: Descrição, name: descricao, widget: text }
              - { label: Bullets, name: bullets, widget: list,
                  field: { label: Item, name: item, widget: string } }
              - { label: CTA, name: cta, widget: string }
```

### 3.3 — Configurar OAuth no GitHub

O Decap CMS precisa de um OAuth App no GitHub para autenticar o login:

1. Acessar: `github.com → Settings → Developer settings → OAuth Apps → New OAuth App`
2. Preencher:
   - **Application name:** Wellington Site Admin
   - **Homepage URL:** `https://wellingtonmsantos.github.io`
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
3. Salvar o **Client ID** e **Client Secret**

4. Criar conta gratuita em `netlify.com` (apenas para usar o serviço de auth OAuth — o site continua no GitHub Pages)
5. No Netlify: `Sites → Add new site → Deploy manually` (fazer upload de qualquer HTML)
6. No Netlify: `Site settings → Identity → Enable Identity → Git Gateway → Enable Git Gateway`
7. Copiar o domínio Netlify gerado (ex: `meu-site-abc.netlify.app`)

8. Atualizar `admin/config.yml` se necessário com o domínio

> **Alternativa mais simples:** usar `netlify-identity-widget` em vez de OAuth direto. Claude Code pode configurar isso automaticamente.

### 3.4 — Testar o painel

```bash
# Após git push, aguardar deploy (GitHub Actions ~2 min)
# Abrir no browser:
https://wellingtonmsantos.github.io/admin

# Logar com conta GitHub
# Testar: criar aluno → salvar → verificar GitHub Actions → ver card no site
```

---

## Fase 4 — Conteúdo Real + Domínio

**Objetivo:** Popular o site com conteúdo real e conectar domínio próprio.

**Estimativa:** Contínuo

### 4.1 — Popular conteúdo via `/admin`

Após o painel funcionar, adicionar pelo formulário:

- [ ] 13 publicações científicas (via `_data/publicacoes.json`)
- [ ] Primeiros 3-5 cases de alunos com depoimento e resultado
- [ ] Projetos de data science com link pro GitHub/repositório
- [ ] Palestras com data, local e descrição
- [ ] Artigos de conteúdo (blog técnico sobre performance)

### 4.2 — Comprar e configurar domínio

**Opções recomendadas:**
- `wellingtonsantos.com.br` → Registro.br (~R$40/ano)
- `wellingtonsantos.com` → Namecheap (~US$15/ano)

**Como conectar ao GitHub Pages:**

```bash
# 1. No registrador de domínio, criar registros DNS:
# Tipo A → 185.199.108.153
# Tipo A → 185.199.109.153
# Tipo A → 185.199.110.153
# Tipo A → 185.199.111.153
# Tipo CNAME → www → wellingtonmsantos.github.io

# 2. No repositório GitHub:
# Settings → Pages → Custom domain → digitar o domínio → Save

# 3. Criar arquivo CNAME na raiz do projeto:
echo "wellingtonsantos.com.br" > CNAME

# 4. Push e aguardar propagação DNS (até 48h)
git add CNAME
git commit -m "add: custom domain"
git push
```

---

## Prompts Recomendados para Claude Code

Usar estes prompts no terminal dentro de `C:\Dev\well-site`:

```
# Fase 1
"Crie o arquivo _data/modalidades.json com os dados das 4 modalidades conforme o plano"
"Atualize a section #modalidades no index.njk para iterar o JSON de modalidades"
"Adicione Treino Híbrido e Musculação nos filtros de cases no index.njk"

# Fase 2
"Crie o arquivo _data/publicacoes.json com estrutura para 13 artigos científicos"
"Crie o partial _includes/partials/publication-card.njk conforme o plano"
"Adicione a section #publicacoes no index.njk após a section #sobre"
"Atualize o sections.config.json para incluir publicacoes: true"
"Adicione o link de Publicações no menu de navegação do index.njk"
"Adicione os estilos de pub-card no arquivo assets/css/style.css"
"Adicione o JavaScript de filtro de publicações no final de assets/js/scripts.js"

# Fase 3
"Crie a pasta admin com index.html e config.yml para o Decap CMS conforme o plano"
"Configure o backend do Decap CMS para usar o repositório wellingtonmsantos/wellingtonmsantos.github.io"

# Geral
"Rode npm run build e me mostre qualquer erro"
"Verifique se todos os filtros do .eleventy.js estão corretos para as novas collections"
```

---

## Checklist de Entrega

### Fase 1 — Modalidades
- [ ] `_data/modalidades.json` criado com 4 modalidades
- [ ] `index.njk` atualizado com iteração dinâmica
- [ ] Filtros de cases atualizados (Treino Híbrido, Musculação)
- [ ] `npm run build` sem erros
- [ ] Visual testado em `npm run dev`
- [ ] `git push` → deploy automático funcionando

### Fase 2 — Publicações
- [ ] `_data/publicacoes.json` criado (13 artigos preenchidos)
- [ ] `publication-card.njk` criado
- [ ] Section `#publicacoes` no `index.njk`
- [ ] Link no nav
- [ ] `sections.config.json` atualizado
- [ ] CSS de pub-card adicionado
- [ ] JS de filtro adicionado
- [ ] `git push` → deploy funcionando

### Fase 3 — Decap CMS
- [ ] `admin/index.html` criado
- [ ] `admin/config.yml` criado com todas as coleções
- [ ] OAuth configurado (GitHub + Netlify Identity)
- [ ] Login funcionando em `/admin`
- [ ] Teste: criar aluno → salvar → ver no site

### Fase 4 — Conteúdo + Domínio
- [ ] 13 publicações adicionadas pelo painel
- [ ] 3+ cases de alunos com depoimento
- [ ] Projetos e palestras adicionados
- [ ] Domínio comprado e DNS configurado
- [ ] CNAME no repositório
- [ ] HTTPS ativo no GitHub Pages

---

## Observações Importantes

**Sem banco de dados:** Todo o conteúdo fica em arquivos `.json` e `.md` no repositório. O Decap CMS edita esses arquivos pela interface visual e o GitHub Actions rebuild o site em ~2 minutos. Custo total de hospedagem: zero.

**Autenticação:** Apenas você tem acesso ao painel `/admin` porque o login usa sua conta GitHub. Nenhum visitante consegue editar.

**Deploy automático:** A cada edição salva no Decap CMS, ele faz um commit no GitHub → GitHub Actions roda `npm run build` → site atualizado em ~2 min.

**Domínio:** O domínio pode ser adicionado a qualquer momento, sem migrar nada. O GitHub Pages suporta domínio customizado nativamente e fornece HTTPS gratuito via Let's Encrypt.
