(function () {
  const products = window.GRAF_LUKAS_PRODUCTS || [];
  const categories = window.GRAF_LUKAS_CATEGORIES || [];

  const {
    qs,
    createElement,
    getQueryParam,
    getProductsByCategory
  } = window.GrafLukasUtils;

  const { renderProducts } = window.GrafLukasRender;
  const cart = window.GrafLukasCart;

  const filtersRoot = qs("#catalogFilters");
  const productsRoot = qs("#catalogProducts");
  const countNode = qs("[data-catalog-count]");
  const currentNode = qs("[data-catalog-current]");
  const titleNode = qs("[data-catalog-title]");
  const textNode = qs("[data-catalog-text]");
  const emptyNode = qs("#catalogEmpty");

  const defaultTitle = "Каталог подписок";
  const defaultText = "Выбирай игры, пополнения и цифровые сервисы по категориям.";

  const getCurrentCategory = () => {
    const value = getQueryParam("category");
    return value || "all";
  };

  const getCategoryMeta = (slug) => {
    if (slug === "all") {
      return {
        slug: "all",
        title: "Все товары",
        description: defaultText
      };
    }

    const category = categories.find((item) => item.slug === slug);
    if (!category) {
      return {
        slug: "all",
        title: "Все товары",
        description: defaultText
      };
    }

    return {
      slug: category.slug,
      title: category.title,
      description: category.description
    };
  };

  const getVisibleProducts = (slug) => {
    if (slug === "all") return products;
    return getProductsByCategory(products, slug);
  };

  const updateMeta = (meta, count) => {
    if (titleNode) {
      titleNode.textContent = meta.slug === "all" ? defaultTitle : meta.title;
    }

    if (textNode) {
      textNode.textContent = meta.description || defaultText;
    }

    if (countNode) {
      countNode.textContent = String(count);
    }

    if (currentNode) {
      currentNode.textContent =
        meta.slug === "all" ? "Показаны все категории" : `Категория: ${meta.title}`;
    }

    document.title =
      meta.slug === "all"
        ? "Каталог — Graf Lukas"
        : `${meta.title} — Каталог Graf Lukas`;
  };

  const updateEmptyState = (count) => {
    if (!emptyNode || !productsRoot) return;

    if (count > 0) {
      emptyNode.hidden = true;
      productsRoot.hidden = false;
      return;
    }

    emptyNode.hidden = false;
    productsRoot.hidden = true;
  };

  const buildFilterChip = (item, isActive) => {
    const link = createElement(
      "a",
      `catalog-chip${isActive ? " is-active" : ""}`,
      item.title
    );

    link.href =
      item.slug === "all"
        ? "./index.html"
        : `./index.html?category=${encodeURIComponent(item.slug)}`;

    link.setAttribute("data-category-chip", item.slug);

    return link;
  };

  const renderFilters = (activeSlug) => {
    if (!filtersRoot) return;

    filtersRoot.innerHTML = "";

    const allChip = buildFilterChip(
      { slug: "all", title: "Все" },
      activeSlug === "all"
    );
    filtersRoot.appendChild(allChip);

    categories.forEach((category) => {
      const chip = buildFilterChip(category, activeSlug === category.slug);
      filtersRoot.appendChild(chip);
    });
  };

  const renderCatalog = () => {
    const activeSlug = getCurrentCategory();
    const meta = getCategoryMeta(activeSlug);
    const visibleProducts = getVisibleProducts(meta.slug);

    renderFilters(meta.slug);
    updateMeta(meta, visibleProducts.length);
    updateEmptyState(visibleProducts.length);

    if (productsRoot) {
      renderProducts(productsRoot, visibleProducts);
      cart.bindAddToCartButtons(productsRoot);
    }
  };

  const init = () => {
    renderCatalog();
    cart.bindCartCounter();
  };

  init();
})();