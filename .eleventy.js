const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItAttrs = require("markdown-it-attrs");

const normalizeFlag = (value) => (typeof value === "string" ? value.trim().toLowerCase() : value);
const isExplicitTrue = (value) => value === true || normalizeFlag(value) === "true";
const isExplicitFalse = (value) => value === false || ["false", "0", "no", "off", "hidden"].includes(normalizeFlag(value));
const isVisible = (item) => {
  if (!item || !item.data) {
    return false;
  }

  if (isExplicitTrue(item.data.draft)) {
    return false;
  }

  if (isExplicitFalse(item.data.visivel)) {
    return false;
  }

  return true;
};

module.exports = function(eleventyConfig) {
  // ==========================================
  // PLUGINS
  // ==========================================
  
  // Syntax highlighting para blocos de código
  eleventyConfig.addPlugin(syntaxHighlight);

  // ==========================================
  // COPIAR ARQUIVOS ESTÁTICOS
  // ==========================================
  
  // Copia assets (CSS, JS, imagens) sem processar
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon2.svg");

  // ==========================================
  // CONFIGURAÇÃO DO MARKDOWN
  // ==========================================
  
  const markdownLib = markdownIt({
    html: true,           // Permite HTML dentro do Markdown
    breaks: true,         // Converte \n em <br>
    linkify: true,        // Detecta URLs e transforma em links
    typographer: true     // Usa aspas tipográficas, etc
  })
    .use(markdownItFootnote)  // Suporte a notas de rodapé [^1]
    .use(markdownItAttrs);     // Suporte a atributos {.classe #id}

  eleventyConfig.setLibrary("md", markdownLib);

  // ==========================================
  // FILTROS PERSONALIZADOS
  // ==========================================
  
  // Filtro para formatar data em português
  eleventyConfig.addFilter("dataBR", (data) => {
    if (!data) return "";
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  });

  // Filtro para pegar apenas os primeiros N itens
  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  // Filtro para filtrar por categoria (suporta string ou array de categorias)
  eleventyConfig.addFilter("filterByCategory", (articles, category) => {
    if (!Array.isArray(articles)) {
      return [];
    }

    return articles.filter(article => {
      if (!isVisible(article)) {
        return false;
      }

      const categorias = article.data.categoria;
      // Se for array, verifica se a categoria está no array
      if (Array.isArray(categorias)) {
        return categorias.includes(category);
      }
      // Se for string, compara diretamente (compatibilidade retroativa)
      return categorias === category;
    });
  });

  // Filtro para buscar artigos/projetos por título
  eleventyConfig.addFilter("searchByTitle", (items, searchTerm) => {
    if (!Array.isArray(items)) {
      return [];
    }

    if (!searchTerm || searchTerm.trim() === "") {
      return items.filter(isVisible);
    }

    const lowerSearch = searchTerm.toLowerCase();
    return items
      .filter(isVisible)
      .filter(item =>
      item.data.title.toLowerCase().includes(lowerSearch) ||
      (item.data.resumo && item.data.resumo.toLowerCase().includes(lowerSearch))
    );
  });

  // Filtro para retornar apenas itens visíveis
  eleventyConfig.addFilter("visibleOnly", (items) => {
    if (!Array.isArray(items)) {
      return [];
    }
    return items.filter(isVisible);
  });

  // Filtro para verificar se um valor é um array
  eleventyConfig.addFilter("isArray", (value) => {
    return Array.isArray(value);
  });

  // ==========================================
  // COLLECTIONS (Coleções de conteúdo)
  // ==========================================
  
  // Coleção de todos os artigos (ordenados por data: mais novo primeiro)
  eleventyConfig.addCollection("artigos", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("artigos/**/*.md")
      .filter(isVisible)
      .sort((a, b) => {
        // Ordena DESC: mais recente primeiro
        return new Date(b.data.data) - new Date(a.data.data);
      });
  });

  // Coleção de todos os projetos (ordenados por data: mais novo primeiro)
  eleventyConfig.addCollection("projetos", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("projetos/**/*.md")
      .filter(isVisible)
      .sort((a, b) => {
        // Ordena DESC: mais recente primeiro
        return new Date(b.data.data) - new Date(a.data.data);
      });
  });

  // Coleção de artigos por categoria (cada categoria ordenada por data)
  eleventyConfig.addCollection("artigosPorCategoria", function(collectionApi) {
    const artigos = collectionApi
      .getFilteredByGlob("artigos/**/*.md")
      .filter(isVisible);
    const categorias = {};

    artigos.forEach(artigo => {
      const cat = artigo.data.categoria || "outros";
      if (!categorias[cat]) {
        categorias[cat] = [];
      }
      categorias[cat].push(artigo);
    });

    // Ordena cada categoria por data (mais recente primeiro)
    Object.keys(categorias).forEach(cat => {
      categorias[cat].sort((a, b) => {
        return new Date(b.data.data) - new Date(a.data.data);
      });
    });

    return categorias;
  });

  // Coleção de casos de sucesso (ordenados por data: mais novo primeiro)
  eleventyConfig.addCollection("casos", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("casos/**/*.md")
      .filter(isVisible)
      .sort((a, b) => {
        // Ordena DESC: mais recente primeiro
        return new Date(b.data.data) - new Date(a.data.data);
      });
  });

  // ==========================================
  // CONFIGURAÇÕES DO 11TY
  // ==========================================
  
  return {
    dir: {
      input: ".",          // Raiz do projeto
      output: "_site",     // Pasta de saída
      includes: "_includes", // Templates/layouts
      data: "_data"        // Dados globais
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
