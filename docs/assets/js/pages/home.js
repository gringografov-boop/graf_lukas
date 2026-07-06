(function () {
  const categories = window.GRAF_LUKAS_CATEGORIES || [];
  const products = window.GRAF_LUKAS_PRODUCTS || [];

  const { qs, getFeaturedProducts } = window.GrafLukasUtils;
  const { renderCategories, renderProducts } = window.GrafLukasRender;
  const cart = window.GrafLukasCart;

  const categoriesRoot = qs("#categoriesGrid");
  const featuredRoot = qs("#featuredProducts");
  const featuredCountNode = qs("[data-featured-count]");

  const renderHomeCategories = () => {
    if (!categoriesRoot) return;
    renderCategories(categoriesRoot, categories);
  };

  const renderFeaturedProducts = () => {
    if (!featuredRoot) return;

    const featuredProducts = getFeaturedProducts(products).slice(0, 6);
    renderProducts(featuredRoot, featuredProducts);

    if (featuredCountNode) {
      featuredCountNode.textContent = String(featuredProducts.length);
    }

    cart.bindAddToCartButtons(featuredRoot);
  };

  const bindHeroButtons = () => {
    const openCatalogButtons = document.querySelectorAll("[data-open-catalog]");

    openCatalogButtons.forEach((button) => {
      button.addEventListener("click", () => {
        window.location.href = "./pages/catalog/index.html";
      });
    });
  };

  const init = () => {
    renderHomeCategories();
    renderFeaturedProducts();
    bindHeroButtons();
    cart.bindCartCounter();
  };

  init();
})();