window.GrafLukasSearch = (function () {
  const {
    qs,
    debounce,
    searchProducts
  } = window.GrafLukasUtils;

  const { renderSearchResults } = window.GrafLukasRender;

  const products = window.GRAF_LUKAS_PRODUCTS || [];

  const modal = qs("#searchModal");
  const openButtons = document.querySelectorAll("[data-open-search]");
  const closeButton = qs("#searchCloseBtn");
  const backdrop = qs("[data-search-backdrop]");
  const input = qs("#searchInput");
  const results = qs("#searchResults");

  const open = () => {
    if (!modal) return;
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      if (input) input.focus();
    }, 30);

    if (results && !results.children.length) {
      renderSearchResults(results, products.slice(0, 6));
    }
  };

  const close = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    if (input) {
      input.value = "";
    }

    if (results) {
      renderSearchResults(results, products.slice(0, 6));
    }
  };

  const runSearch = debounce((value) => {
    if (!results) return;

    const trimmed = value.trim();

    if (!trimmed) {
      renderSearchResults(results, products.slice(0, 6));
      return;
    }

    const found = searchProducts(products, trimmed).slice(0, 8);
    renderSearchResults(results, found);
  }, 180);

  const bindOpen = () => {
    openButtons.forEach((button) => {
      button.addEventListener("click", open);
    });
  };

  const bindClose = () => {
    if (closeButton) {
      closeButton.addEventListener("click", close);
    }

    if (backdrop) {
      backdrop.addEventListener("click", close);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal?.classList.contains("is-open")) {
        close();
      }
    });
  };

  const bindInput = () => {
    if (!input) return;

    input.addEventListener("input", (event) => {
      runSearch(event.target.value);
    });
  };

  const init = () => {
    if (!modal || !input || !results) return;
    bindOpen();
    bindClose();
    bindInput();
    renderSearchResults(results, products.slice(0, 6));
  };

  return {
    init,
    open,
    close
  };
})();

window.GrafLukasSearch.init();