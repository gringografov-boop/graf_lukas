(function () {
  const root = document.documentElement;
  const body = document.body;

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const state = {
    searchOpen: false
  };

  const ui = {
    themeToggle: null,
    searchModal: null,
    searchInput: null,
    searchClose: null,
    searchBackdrop: null,
    searchOpeners: [],
    cartCounters: []
  };

  const icons = {
    moon: `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"></path>
      </svg>
    `,
    sun: `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="5"></circle>
        <path d="M12 1v2"></path>
        <path d="M12 21v2"></path>
        <path d="M4.22 4.22l1.42 1.42"></path>
        <path d="M18.36 18.36l1.42 1.42"></path>
        <path d="M1 12h2"></path>
        <path d="M21 12h2"></path>
        <path d="M4.22 19.78l1.42-1.42"></path>
        <path d="M18.36 5.64l1.42-1.42"></path>
      </svg>
    `
  };

  const getTheme = () => {
    return root.getAttribute("data-theme") || "light";
  };

  const updateThemeButton = () => {
    if (!ui.themeToggle) return;

    const theme = getTheme();
    const nextTheme = theme === "dark" ? "light" : "dark";

    ui.themeToggle.innerHTML = theme === "dark" ? icons.sun : icons.moon;
    ui.themeToggle.setAttribute("aria-label", `Переключить тему на ${nextTheme}`);
    ui.themeToggle.setAttribute("title", `Тема: ${theme}`);
  };

  const bindThemeToggle = () => {
    ui.themeToggle = qs("#themeToggleBtn");

    if (!ui.themeToggle) return;

    updateThemeButton();

    if (ui.themeToggle.dataset.bound === "true") return;
    ui.themeToggle.dataset.bound = "true";

    ui.themeToggle.addEventListener("click", () => {
      const current = getTheme();
      const next = current === "dark" ? "light" : "dark";

      root.setAttribute("data-theme", next);
      updateThemeButton();
    });
  };

  const lockScroll = () => {
    body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    body.style.overflow = "";
  };

  const openSearch = () => {
    if (!ui.searchModal) return;

    ui.searchModal.setAttribute("aria-hidden", "false");
    ui.searchModal.classList.add("is-open");
    state.searchOpen = true;
    lockScroll();

    if (ui.searchInput) {
      window.setTimeout(() => ui.searchInput.focus(), 20);
    }
  };

  const closeSearch = () => {
    if (!ui.searchModal) return;

    ui.searchModal.setAttribute("aria-hidden", "true");
    ui.searchModal.classList.remove("is-open");
    state.searchOpen = false;
    unlockScroll();
  };

  const bindSearchModal = () => {
    ui.searchModal = qs("#searchModal");
    ui.searchInput = qs("#searchInput");
    ui.searchClose = qs("#searchCloseBtn");
    ui.searchBackdrop = qs("[data-search-backdrop]");
    ui.searchOpeners = qsa("[data-open-search]");

    if (!ui.searchModal) return;

    ui.searchOpeners.forEach((button) => {
      if (button.dataset.bound === "true") return;
      button.dataset.bound = "true";

      button.addEventListener("click", openSearch);
    });

    if (ui.searchClose && ui.searchClose.dataset.bound !== "true") {
      ui.searchClose.dataset.bound = "true";
      ui.searchClose.addEventListener("click", closeSearch);
    }

    if (ui.searchBackdrop && ui.searchBackdrop.dataset.bound !== "true") {
      ui.searchBackdrop.dataset.bound = "true";
      ui.searchBackdrop.addEventListener("click", closeSearch);
    }

    if (ui.searchInput && ui.searchInput.dataset.bound !== "true") {
      ui.searchInput.dataset.bound = "true";
      ui.searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeSearch();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && !state.searchOpen) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        const isTyping = ["input", "textarea", "select"].includes(tag);

        if (!isTyping) {
          event.preventDefault();
          openSearch();
        }
      }

      if (event.key === "Escape" && state.searchOpen) {
        closeSearch();
      }
    });
  };

  const readCartCount = () => {
    const cartApi = window.GrafLukasCart;

    if (!cartApi || typeof cartApi.getCart !== "function") {
      return 0;
    }

    const items = cartApi.getCart() || [];
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const syncCartCounters = () => {
    ui.cartCounters = qsa("[data-cart-count]");

    const count = readCartCount();

    ui.cartCounters.forEach((node) => {
      node.textContent = String(count);
      node.hidden = count <= 0;
    });
  };

  const bindCartSync = () => {
    syncCartCounters();

    document.addEventListener("graf-lukas:cart-updated", syncCartCounters);
    window.addEventListener("pageshow", syncCartCounters);
  };

  const bindCurrentYear = () => {
    qsa("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  };

  const markCurrentNavLink = () => {
    const currentPath = window.location.pathname.replace(/\/+$/, "");
    const links = qsa(".nav a, .footer__nav a, .account-nav__link");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(href, window.location.href);
      const linkPath = url.pathname.replace(/\/+$/, "");

      if (linkPath === currentPath) {
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const exposeAppApi = () => {
    window.GrafLukasApp = {
      openSearch,
      closeSearch,
      syncCartCounters,
      updateThemeButton
    };
  };

  const init = () => {
    bindThemeToggle();
    bindSearchModal();
    bindCartSync();
    bindCurrentYear();
    markCurrentNavLink();
    exposeAppApi();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();