# Design Spec: Reestruturação Marketing-First — Site Wellington Santos
**Data:** 2026-04-02
**Status:** Revisado e aprovado para implementação (v2)

---

## Contexto

O site atual tem conteúdo técnico excelente mas segue uma lógica de portfólio, não de conversão. Visitantes que chegam pelo Instagram ou boca-a-boca precisam de uma jornada que responda: *"Isso é para mim? Consigo resultado? Posso confiar nessa pessoa?"* — nessa ordem.

**Problema central:** Social proof (casos) e oferta aparecem *depois* de seções de credencial acadêmica, invertendo o funil.

---

## Framework Aplicado: AIDA + Proof Loop

```
ATENÇÃO    → Hero com promessa clara e CTA de baixo atrito
INTERESSE  → Espelho da dor do visitante (#problema)
DESEJO     → Prova social concreta (#casos — antes das modalidades)
AÇÃO       → Oferta + CTA primário (#modalidades)
AUTORIDADE → Sobre + Publicações (para o visitante analítico)
QUEBRA OBJ → FAQ (antes do contato final)
RETENÇÃO   → Conteúdo (Artigos)
```

---

## Nova Estrutura de Seções

| Ordem | ID | Função de Marketing | Mudança |
|---|---|---|---|
| 1 | `#hero` | Promessa + CTA duplo | Reformular headline, remover hero__metrics, reformular CTAs |
| 2 | `#numeros` | Trust strip — métricas rápidas | **Nova seção** (substitui hero__metrics) |
| 3 | `#problema` | Espelho da dor do ICP | **Nova seção** |
| 4 | `#casos` | Prova social primária | Extrair do bloco #modalidades, mover para antes |
| 5 | `#modalidades` | Solução para a dor | Mantém conteúdo, reposicionado |
| 6 | `#sobre` | Credibilidade pessoal | Mover para depois dos casos |
| 7 | `#publicacoes` | Autoridade científica | Mantém posição relativa |
| 8 | `#faq` | Quebra de objeções | **Nova seção** |
| 9 | `#artigos` | Conteúdo / SEO / leads | Mantém |
| 10 | `#contato` | CTA final de baixo atrito | Reformular copy |

**#projetos:** removido da navegação principal (conteúdo mantido nas URLs /projetos/*, apenas sem link no nav).

---

## Seções Novas: Especificação

### #numeros (Trust Strip)
- Substitui o bloco `<dl class="hero__metrics">` que será removido do interior do hero
- Banner horizontal, glass-panel compacto, 4 métricas separadas por dividers:
  - `10+` anos de experiência
  - `50+` clientes atendidos
  - `13` publicações científicas
  - `4` modalidades de treino
- Estilo: sem título, uma linha, números em accent color, labels em muted

### #problema (Identificação com a Dor)
- Título: **"Você se identifica com algum desses cenários?"**
- 3 cards glassmorphism com ícone SVG + frase curta:
  1. *"Treino há meses mas não vejo progresso mensurável no desempenho"*
  2. *"Não sei se estou recuperando ou acumulando fadiga sem perceber"*
  3. *"Quero unir força e cardio mas não sei como sem sacrificar um pelo outro"*
- CTA ghost ao final: `"Se sim, você está no lugar certo — veja os resultados →"` (ancora em #casos)
- CTA secundário: `"Quero meu diagnóstico gratuito"` → WhatsApp com mensagem pré-definida

### #faq (Perguntas Frequentes — accordion)
Dados em `_data/faq.json`:

```json
[
  {
    "pergunta": "Você atende presencialmente ou online?",
    "resposta": "Atendo nos dois formatos. Presencial em Campinas/SP e online para qualquer lugar do Brasil. O método é o mesmo — periodização individualizada, dados fisiológicos e acompanhamento contínuo. A diferença é só o canal de comunicação."
  },
  {
    "pergunta": "Preciso ter experiência prévia para começar?",
    "resposta": "Não. Atendo desde iniciantes até atletas competitivos de CrossFit e HYROX. O que importa é o objetivo — adaptamos o protocolo ao seu nível atual e ao que você quer alcançar."
  },
  {
    "pergunta": "Como funciona o acompanhamento no dia a dia?",
    "resposta": "Você recebe planejamento semanal, relatórios mensais de progresso e acesso direto por WhatsApp para ajustes. Usamos dados (HRV, carga, sono) para tomar decisões — não achismo."
  },
  {
    "pergunta": "Qual a diferença entre você e um personal trainer comum?",
    "resposta": "Trabalho com dados fisiológicos reais, periodização baseada em evidência científica e 13 publicações peer-reviewed na área. Cada decisão de treino tem um motivo mensurável. O objetivo é resultado consistente, não motivação de curto prazo."
  },
  {
    "pergunta": "Como começo?",
    "resposta": "Simples: clique em 'Agendar diagnóstico gratuito', me mande uma mensagem no WhatsApp e conversamos por 15-20 minutos. Entendo sua situação atual, seus objetivos e te digo se faz sentido trabalharmos juntos."
  }
]
```

---

## Reformulação de Copy

### Hero Headline
- **Atual:** `"PERFORMANCE HUMANA: Da ciência ao resultado real"`
- **Novo h1:** `"Treino com dados. Resultado mensurável."`
- **Sub:** *"Especialista em Performance Humana & Data Science. Metodologia baseada em fisiologia, periodização científica e análise de dados — para quem quer evoluir de forma consistente, não por achismo."*
- Meta tags (`<title>`, `og:title`) e `<meta description>` também atualizados para manter alinhamento SEO

### CTAs
| Posição | Atual | Novo |
|---|---|---|
| Hero primário | "Ver Projetos" | `"Agendar diagnóstico gratuito"` → `wa.me/5519920034839?text=Olá, quero agendar meu diagnóstico gratuito` |
| Hero secundário | WhatsApp genérico | `"Ver resultados de clientes →"` (ancora em #casos) |
| Fim de #problema | inexistente | `"Quero meu diagnóstico gratuito"` (mesmo link WhatsApp) |
| Seção Modalidades | "Falar Especialista" | `"Quero começar agora"` |
| Contato | genérico | `"Agendar minha conversa gratuita"` |

### Navegação
Nova lista ordenada de itens do nav:
`Início · Serviços · Clientes · Sobre · FAQ · Conteúdo · Contato`
(#projetos removido do nav, URL /projetos/* mantida)

---

## Arquivos a Modificar

| Arquivo | Ação |
|---|---|
| `index.njk` | Reordenar seções; remover `hero__metrics`; extrair `#casos` do bloco `#modalidades`; adicionar `#numeros`, `#problema`, `#faq`; atualizar nav; reformular copy hero e CTAs |
| `_data/faq.json` | Criar com 5 itens conforme spec |
| `assets/css/style.css` | Estilos para trust strip, problema cards, accordion FAQ |
| `assets/js/scripts.js` | Accordion FAQ interativo (toggle) |

---

## Decisões Técnicas

- `#casos` deve receber seu próprio `{% if site.sections.casos | default(true) %}` wrapper independente (extraído do bloco modalidades)
- `hero__metrics` dl removido do hero e substituído por `#numeros` logo abaixo do hero
- FAQ usa `<details>/<summary>` HTML nativo com JS progressivo para animação
- `_data/faq.json` segue o mesmo padrão de `_data/modalidades.json`

---

## Critério de Sucesso

1. Prova social (casos) visível antes de seções técnicas
2. Trust strip aparece imediatamente abaixo do hero
3. CTAs usam verbos de benefício com destino específico
4. FAQ responde 5 objeções antes do formulário de contato
5. `npm run build` passa sem erros
6. Navegação reflete nova estrutura
