// ============================================
// SCRIPTS.JS - Site Wellington Santos
// ============================================
// Este arquivo gerencia toda a interatividade do site:
// 1. Menu de navegação mobile (hambúrguer)
// 2. Animações de fade-in ao scrollar
// 3. Carrossel de artigos
// 4. Ano dinâmico no footer
// ============================================

// ============================================
// SEÇÃO 1: MENU DE NAVEGAÇÃO MOBILE
// ============================================
// O menu hambúrguer aparece apenas em mobile (< 768px)
// Quando clicado, abre/fecha o menu lateral

// Seleciona o botão hambúrguer (3 linhas)
const navToggle = document.querySelector(".site-header__toggle");

// Seleciona o menu de navegação completo
const navigation = document.querySelector(".site-header__nav");

// Seleciona todos os links DENTRO do menu (Sobre, Formações, etc)
// O "?" é optional chaining - só executa se navigation existir
const navLinks = navigation?.querySelectorAll("a");

// Seleciona todos os elementos que devem ter animação fade-in
const fadeTargets = document.querySelectorAll(".fade-in");

// -------- FUNÇÃO: Fechar o menu de navegação --------
// Esta função é chamada em 3 situações:
// 1. Quando o usuário clica em um link do menu
// 2. Quando o usuário clica fora do menu
// 3. Programaticamente quando necessário
const closeNavigation = () => {
  // Remove a classe "is-open" que torna o menu visível
  navigation?.classList.remove("is-open");
 
  // Atualiza o atributo ARIA para acessibilidade (leitores de tela)
  // aria-expanded="false" indica que o menu está fechado
  navToggle?.setAttribute("aria-expanded", "false");
};

// -------- EVENT LISTENER: Click no botão hambúrguer --------
// Quando o usuário clica no botão hambúrguer, abre/fecha o menu
navToggle?.addEventListener("click", (e) => {
  // Evita que o click no botão propague para o document (evita conflito com "click fora")
  e.stopPropagation();

  // toggle() adiciona a classe se não existir, remove se existir
  // Retorna true se adicionou, false se removeu
  const isOpen = navigation?.classList.toggle("is-open");

  // Atualiza o atributo ARIA para refletir o estado atual
  // String(Boolean(isOpen)) converte o valor para "true" ou "false"
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

// -------- EVENT LISTENER: Click em links do menu --------
// Quando o usuário clica em "Sobre", "Projetos", etc.
// O menu deve fechar automaticamente (UX melhor em mobile)
navLinks?.forEach((link) => {
  link.addEventListener("click", () => {
    closeNavigation();
  });
});

// -------- EVENT LISTENER: Click fora do menu --------
// Se o usuário clicar em qualquer lugar FORA do menu,
// o menu deve fechar (comportamento padrão de menus dropdown)
document.addEventListener("click", (event) => {
  // Se não existir menu ou botão, sai da função
  if (!navigation || !navToggle) {
    return;
  }

  // Verifica se o click foi em um elemento HTML válido
  if (event.target instanceof Element) {
    // contains() verifica se o click foi DENTRO do menu ou do botão
    const isClickInside = navigation.contains(event.target) || navToggle.contains(event.target);

    // Se o click foi FORA, fecha o menu
    if (!isClickInside) {
      closeNavigation();
    }
  }
});

// ============================================
// SEÇÃO 2: ANIMAÇÕES FADE-IN AO SCROLLAR
// ============================================
// Elementos com classe .fade-in começam invisíveis (opacity: 0)
// Quando o usuário scrolla e o elemento aparece na tela,
// a classe .is-visible é adicionada, ativando a animação CSS

// IntersectionObserver é uma API moderna que detecta quando
// um elemento entra/sai da viewport (área visível da tela)
// É MUITO mais eficiente que monitorar scroll manualmente
const observer = new IntersectionObserver(
  // Callback executada quando algum elemento muda de visibilidade
  (entries) => {
    // entries é um array com todos os elementos sendo observados
    entries.forEach((entry) => {
      // isIntersecting = true significa que o elemento está visível
      if (entry.isIntersecting) {
        // Adiciona a classe que ativa a animação CSS
        entry.target.classList.add("is-visible");

        // Para de observar este elemento (animação só acontece 1x)
        // Isso melhora performance pois reduz elementos monitorados
        observer.unobserve(entry.target);
      }
    });
  },
  // Configurações do observer
  {
    // threshold: 0.2 = elemento precisa estar 20% visível para disparar
    // Valores de 0 (qualquer pixel) a 1 (100% visível)
    threshold: 0.2,

    // rootMargin: expande a área de detecção em 24px
    // Positivo = dispara antes do elemento aparecer
    // Negativo = dispara depois do elemento aparecer
    rootMargin: "24px"
  }
);

// Registra todos os elementos .fade-in para serem observados
// Agora o observer vai monitorar automaticamente quando entrarem na tela
fadeTargets.forEach((target) => observer.observe(target));

// ============================================
// SEÇÃO 3: ANO DINÂMICO NO FOOTER
// ============================================
// Atualiza automaticamente o ano no copyright
// Ex: "© 2025 Wellington Santos" sem precisar editar manualmente

// Busca o elemento com id="current-year"
const currentYear = document.getElementById("current-year");

// Se o elemento existir, atualiza com o ano atual
if (currentYear) {
  // new Date().getFullYear() retorna o ano atual (2025, 2026, etc)
  currentYear.textContent = new Date().getFullYear();
}

// ============================================
// SEÇÃO 4: TABS NAVIGATION
// ============================================
// Sistema de tabs horizontais para navegação entre categorias
// Cada conjunto (projetos, conteúdos etc.) controla o próprio estado

const tabLists = Array.from(document.querySelectorAll(".articles-tabs"));

const initTabSystem = (tabList) => {
  const tabs = Array.from(tabList.querySelectorAll(".articles-tabs__tab"));

  if (!tabs.length) {
    return null;
  }

  const panelIds = tabs
    .map((tab) => tab.getAttribute("aria-controls"))
    .filter((id) => typeof id === "string");

  const panels = panelIds
    .map((panelId) => document.getElementById(panelId))
    .filter((panel) => panel instanceof HTMLElement);

  const dropdown = tabList.parentElement?.querySelector(".articles-tabs-dropdown");
  const dropdownButton = dropdown?.querySelector(".articles-tabs-dropdown__button");
  const dropdownButtonText = dropdown?.querySelector(".articles-tabs-dropdown__button-text");
  const dropdownMenu = dropdown?.querySelector(".articles-tabs-dropdown__menu");
  const dropdownOptions = dropdown
    ? Array.from(dropdown.querySelectorAll(".articles-tabs-dropdown__option")).filter((option) => {
        const panelId = option.getAttribute("data-panel");
        return panelId !== null && panelIds.includes(panelId);
      })
    : [];

  const syncDropdown = (panelId) => {
    if (!dropdown) {
      return;
    }

    dropdownOptions.forEach((option) => {
      const isActive = option.getAttribute("data-panel") === panelId;
      option.classList.toggle("is-active", isActive);

      if (isActive && dropdownButtonText) {
        const rawText = option.textContent ?? "";
        dropdownButtonText.textContent = rawText.replace("✓", "").trim();
      }
    });
  };

  const closeDropdown = () => {
    if (!dropdownButton || !dropdownMenu) {
      return;
    }

    dropdownButton.setAttribute("aria-expanded", "false");
    dropdownMenu.setAttribute("aria-hidden", "true");
  };

  const openDropdown = () => {
    if (!dropdownButton || !dropdownMenu) {
      return;
    }

    dropdownButton.setAttribute("aria-expanded", "true");
    dropdownMenu.setAttribute("aria-hidden", "false");
  };

  const activateTab = (targetTab) => {
    if (!targetTab) {
      return;
    }

    const targetPanelId = targetTab.getAttribute("aria-controls");
    if (!targetPanelId) {
      return;
    }

    tabs.forEach((tab) => {
      const isActive = tab === targetTab;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.id === targetPanelId;
      if (isActive) {
        panel.removeAttribute("hidden");
        panel.classList.add("is-active");
      } else {
        panel.setAttribute("hidden", "true");
        panel.classList.remove("is-active");
      }
    });

    syncDropdown(targetPanelId);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });

    tab.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(tab);
      let newIndex;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = tabs.length - 1;
        }
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        newIndex = currentIndex + 1;
        if (newIndex >= tabs.length) {
          newIndex = 0;
        }
      }

      if (newIndex !== undefined) {
        tabs[newIndex].focus();
        activateTab(tabs[newIndex]);
      }
    });
  });

  if (dropdownButton && dropdownMenu) {
    dropdownButton.addEventListener("click", () => {
      const isExpanded = dropdownButton.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });
  }

  dropdownOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const panelId = option.getAttribute("data-panel");
      if (!panelId) {
        return;
      }

      const correspondingTab = tabs.find((tab) => tab.getAttribute("aria-controls") === panelId);
      if (correspondingTab) {
        activateTab(correspondingTab);
      }

      closeDropdown();
    });
  });

  if (dropdown) {
    document.addEventListener("click", (event) => {
      if (event.target instanceof Element && !dropdown.contains(event.target)) {
        closeDropdown();
      }
    });
  }

  const initialTab =
    tabs.find((tab) => tab.classList.contains("is-active")) ??
    tabs.find((tab) => tab.getAttribute("aria-selected") === "true") ??
    tabs[0];

  if (initialTab) {
    activateTab(initialTab);
  }

  return { activateTab };
};

tabLists.forEach((tabList) => {
  initTabSystem(tabList);
});

// ============================================
// SEÇÃO 5: LOAD MORE FUNCTIONALITY
// ============================================
// Implementa paginação com "Load More" para categorias com muitos artigos/casos
// Inicialmente mostra 6 cards, depois carrega 3 de cada vez

const INITIAL_VISIBLE = 6;
const LOAD_MORE_COUNT = 3;

const loadMoreButtons = Array.from(document.querySelectorAll(".articles__load-more-btn"));

loadMoreButtons.forEach((button) => {
  const category = button.getAttribute("data-category");

  // Suporta tanto articles__grid quanto cases__grid
  let grid = document.querySelector(`.articles__grid[data-category="${category}"]`);
  if (!grid) {
    grid = document.querySelector(`.cases__grid[data-category="${category}"]`);
  }

  if (!grid) {
    return;
  }

  // Suporta tanto articles__card quanto case-card
  let cards = Array.from(grid.querySelectorAll(".articles__card"));
  if (cards.length === 0) {
    cards = Array.from(grid.querySelectorAll(".case-card"));
  }

  let visibleCount = INITIAL_VISIBLE;

  // Esconde cards além dos primeiros 6
  const updateVisibility = () => {
    cards.forEach((card, index) => {
      if (index < visibleCount) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });

    // Esconde o botão se todos os cards estão visíveis
    if (visibleCount >= cards.length) {
      button.parentElement.style.display = "none";
    }
  };

  // Inicializa a visibilidade
  updateVisibility();

  // Event listener para o botão Load More
  button.addEventListener("click", () => {
    visibleCount += LOAD_MORE_COUNT;
    updateVisibility();
  });
});

// ============================================
// SEÇÃO 6: CASE CARD MODAL
// ============================================
// Sistema de modal para exibir casos de sucesso em pop-up
// Abre ao clicar no card e fecha ao clicar fora

// Cria o elemento do modal uma vez
const createModal = () => {
  const modal = document.createElement('div');
  modal.className = 'case-modal';
  modal.innerHTML = `
    <div class="case-modal__content" role="dialog" aria-modal="true" aria-label="História completa do caso">
      <button type="button" class="case-modal__close-button">
        <span class="case-modal__close-icon" aria-hidden="true">←</span>
        Voltar
      </button>
      <div class="case-modal__body"></div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
};

// Inicializa o modal
const modal = createModal();
const modalContent = modal.querySelector('.case-modal__content');
const modalBody = modal.querySelector('.case-modal__body');
const modalCloseButton = modal.querySelector('.case-modal__close-button');
modal.setAttribute('aria-hidden', 'true');
let lastFocusedElement = null;

// Função para abrir o modal com o conteúdo do card
const openCaseModal = (card) => {
  if (!modalBody || !modalCloseButton) {
    return;
  }

  // Guarda o elemento focado para restaurar depois
  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  // Clona o card e insere no modal
  const cardClone = card.cloneNode(true);
  modalBody.innerHTML = '';
  modalBody.appendChild(cardClone);

  // Remove o cursor pointer e previne cliques no card clonado
  cardClone.style.cursor = 'default';
  cardClone.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Adiciona a classe para abrir o modal
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');

  // Previne scroll do body quando modal está aberto
  document.body.style.overflow = 'hidden';

  // Move o foco para o botão de fechar para acessibilidade
  modalCloseButton.focus();
};

// Função para fechar o modal
const closeCaseModal = () => {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  modal.setAttribute('aria-hidden', 'true');

  if (modalBody) {
    modalBody.innerHTML = '';
  }

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }

  lastFocusedElement = null;
};

// Event listener: clique nos cards
const caseCards = document.querySelectorAll('.case-card');
caseCards.forEach((card) => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    openCaseModal(card);
  });
});

// Event listener: botão de fechar
modalCloseButton?.addEventListener('click', (e) => {
  e.preventDefault();
  closeCaseModal();
});

// Event listener: fechar ao clicar fora do card
modal.addEventListener('click', (e) => {
  // Se o clique foi no overlay (não no conteúdo do card)
  if (e.target === modal) {
    closeCaseModal();
  }
});

// Event listener: fechar com a tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeCaseModal();
  }
});

// ============================================
// SEÇÃO 7: ACTIVE NAVIGATION LINK ON SCROLL
// ============================================
// Destaca o link do menu correspondente à seção visível
// Adiciona classe 'is-active' ao link quando a seção está na viewport

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.site-header__nav a');

// Função para atualizar o link ativo baseado no scroll
const updateActiveNavLink = () => {
  const scrollPosition = window.scrollY + 100; // Offset para ativar um pouco antes

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    // Verifica se a seção está visível
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // Remove classe 'is-active' de todos os links
      navItems.forEach((item) => {
        item.classList.remove('is-active');
      });

      // Adiciona classe 'is-active' ao link correspondente
      const activeLink = document.querySelector(`.site-header__nav a[href="#${sectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('is-active');
      }
    }
  });
};

// Atualiza ao carregar a página
updateActiveNavLink();

// Atualiza ao fazer scroll (com debounce para performance)
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    updateActiveNavLink();
  });
});

// ============================================
// SEÇÃO 8: CASE FILTERS — PILLS
// ============================================

(function () {
  const allCaseCards = document.querySelectorAll('.case-card');
  const pillGroups = document.querySelectorAll('.case-pills');
  if (!pillGroups.length) return;

  // Estado atual de cada grupo de filtro
  const activeFilters = {};
  pillGroups.forEach(function (group) {
    activeFilters[group.dataset.filter] = '';
  });

  function applyFilters() {
    allCaseCards.forEach(function (card) {
      var visible = true;
      pillGroups.forEach(function (group) {
        var filterKey = group.dataset.filter;
        var activeValue = activeFilters[filterKey];
        if (!activeValue) return; // "Todos" — não filtra
        var cardValue = card.getAttribute('data-' + filterKey) || '';
        if (!cardValue.includes(activeValue)) visible = false;
      });
      card.classList.toggle('is-hidden', !visible);
    });
  }

  pillGroups.forEach(function (group) {
    group.addEventListener('click', function (e) {
      var pill = e.target.closest('.case-pill');
      if (!pill) return;

      // Desativa todos no grupo, ativa o clicado
      group.querySelectorAll('.case-pill').forEach(function (p) {
        p.classList.remove('is-active');
      });
      pill.classList.add('is-active');

      activeFilters[group.dataset.filter] = pill.dataset.value;
      applyFilters();
    });
  });
}());

// ============================================
// HERO CAROUSEL
// ============================================
(function () {
  var imgs = document.querySelectorAll('.hero__carousel-img');
  if (!imgs.length) return;
  var current = 0;
  setInterval(function () {
    imgs[current].classList.remove('is-active');
    current = (current + 1) % imgs.length;
    imgs[current].classList.add('is-active');
  }, 3500);
}());

// ============================================
// FIM DO ARQUIVO
// ============================================
// O código acima gerencia toda a interatividade do site de forma
// modular, performática e acessível (WCAG 2.1 Level AA)

// ===================== FILTRO DE PUBLICAÇÕES =====================
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var filters = document.querySelectorAll('.pub-filter');
    if (!filters.length) return;
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var area = btn.dataset.area;
        document.querySelectorAll('.pub-card').forEach(function (card) {
          card.style.display = (area === 'todos' || card.dataset.area === area) ? '' : 'none';
        });
      });
    });
  });
}());


// ===================== CARROSSEL PAGINADO =====================
(function () {
  document.addEventListener('DOMContentLoaded', function () {

    function initPagedCarousel(grid) {
      if (!grid || grid.dataset.carouselDone) return;
      var items = Array.from(grid.children);
      if (items.length < 2) return;
      grid.dataset.carouselDone = '1';

      var ROWS = 2;
      var GAP  = 16;

      // Cria a track
      var track = document.createElement('div');
      track.className = 'paged-carousel__track';
      items.forEach(function (item) { track.appendChild(item); });

      grid.classList.add('paged-carousel');
      grid.innerHTML = '';
      grid.appendChild(track);

      var currentPage = 0;

      function getCols() {
        var w = grid.clientWidth;
        if (w >= 1024) return 4;
        if (w >= 600)  return 2;
        return 1;
      }

      function getCardWidth() {
        var cols = getCols();
        return (grid.clientWidth - (cols - 1) * GAP) / cols;
      }

      function applyCardWidths() {
        var w = getCardWidth();
        Array.from(track.children).forEach(function (c) {
          c.style.width = w + 'px';
        });
      }

      function totalPages() {
        return Math.ceil(items.length / (getCols() * ROWS));
      }

      function goTo(page) {
        var cols = getCols();
        currentPage = ((page % totalPages()) + totalPages()) % totalPages();
        var offset = currentPage * cols * (getCardWidth() + GAP);
        track.style.transform = 'translateX(-' + offset + 'px)';
      }

      applyCardWidths();
      window.addEventListener('resize', function () {
        applyCardWidths();
        goTo(currentPage);
      });

      // Auto-avança a cada 5s
      var timer = setInterval(function () { goTo(currentPage + 1); }, 5000);

      grid.addEventListener('mouseenter', function () { clearInterval(timer); });
      grid.addEventListener('mouseleave', function () {
        timer = setInterval(function () { goTo(currentPage + 1); }, 5000);
      });

      grid.addEventListener('carousel-reset', function () {
        currentPage = 0;
        track.style.transform = 'translateX(0)';
      });
    }

    // Clientes
    var casosGrid = document.querySelector('.cases__grid');
    initPagedCarousel(casosGrid);

    // Quando clicar em "Ver mais casos", sai do carrossel e mostra tudo em grid
    var verMaisBtn = document.querySelector('.articles__load-more-btn[data-category="casos"]');
    if (verMaisBtn && casosGrid) {
      verMaisBtn.addEventListener('click', function () {
        var track = casosGrid.querySelector('.paged-carousel__track');
        if (!track) return;

        // Para o carrossel e converte para grid normal
        casosGrid.classList.remove('paged-carousel');
        casosGrid.style.display = '';
        track.style.transform = '';
        track.style.transition = 'none';

        // Move os cards de volta para o grid
        var cards = Array.from(track.children);
        casosGrid.innerHTML = '';
        cards.forEach(function (card) { casosGrid.appendChild(card); });

        // Esconde o botão
        verMaisBtn.closest('.articles__load-more').style.display = 'none';
      }, { once: true });
    }

    // Conteúdo — todos os painéis
    document.querySelectorAll('.articles__grid').forEach(initPagedCarousel);
  });
}());
