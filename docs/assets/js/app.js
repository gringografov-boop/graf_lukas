(function () {
  const body = document.body;

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const state = {
    searchOpen: false
  };

  const ui = {
    searchModal: null,
    searchInput: null,
    searchClose: null,
    searchBackdrop: null,
    searchOpeners: [],
    cartCounters: []
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
      syncCartCounters
    };
  };

  const init = () => {
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
