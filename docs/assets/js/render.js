window.GrafLukasRender = (function () {
  const {
    createElement,
    createImage,
    clearElement
  } = window.GrafLukasUtils;

  const createCategoryCard = (category) => {
    const link = createElement("a", "category-card");
    link.href = category.href;
    link.setAttribute("data-category", category.slug);

    const icon = createElement("div", "category-card__icon");
    const image = createImage({
      src: category.image,
      alt: category.title,
      width: 44,
      height: 44,
      background: category.imageBg
    });

    const body = createElement("div", "category-card__body");
    const title = createElement("div", "category-card__title", category.title);
    const description = createElement("div", "category-card__text", category.description);

    icon.appendChild(image);
    body.append(title, description);
    link.append(icon, body);

    return link;
  };

  const createProductCard = (product) => {
    const card = createElement("article", "product-card");

    const top = createElement("div", "product-card__top");

    const icon = createElement("div", "product-card__icon");
    const image = createImage({
      src: product.image,
      alt: product.title,
      width: 52,
      height: 52,
      background: product.imageBg
    });
    icon.appendChild(image);

    const badge = createElement("span", "product-card__badge", product.badge || "");

    top.append(icon);
    if (product.badge) {
      top.append(badge);
    }

    const body = createElement("div", "product-card__body");
    const title = createElement("h3", "product-card__title", product.title);
    const text = createElement("p", "product-card__text", product.description);

    body.append(title, text);

    const meta = createElement("div", "product-card__meta");
    const price = createElement("div", "product-card__price", product.price);

    meta.appendChild(price);

    if (product.note) {
      const note = createElement("div", "product-card__note", product.note);
      meta.appendChild(note);
    }

    const actions = createElement("div", "product-card__actions");

    const openLink = createElement("a", "button button--primary", "Открыть");
    openLink.href = product.href;

    const cartButton = createElement("button", "button button--secondary", "В корзину");
    cartButton.type = "button";
    cartButton.setAttribute("data-add-to-cart", product.id);

    actions.append(openLink, cartButton);
    card.append(top, body, meta, actions);

    return card;
  };

  const createSearchResult = (product) => {
    const link = createElement("a", "search-result");
    link.href = product.href;

    const icon = createElement("div", "search-result__icon");
    const image = createImage({
      src: product.image,
      alt: product.title,
      width: 40,
      height: 40,
      background: product.imageBg
    });

    const body = createElement("div", "search-result__body");
    const title = createElement("div", "search-result__title", product.title);
    const text = createElement("div", "search-result__text", product.description);

    const price = createElement("div", "search-result__price", product.price);

    icon.appendChild(image);
    body.append(title, text);
    link.append(icon, body, price);

    return link;
  };

  const renderCategories = (target, categories = []) => {
    if (!target) return;

    clearElement(target);
    categories.forEach((category) => {
      target.appendChild(createCategoryCard(category));
    });
  };

  const renderProducts = (target, products = []) => {
    if (!target) return;

    clearElement(target);

    products.forEach((product) => {
      target.appendChild(createProductCard(product));
    });
  };

  const renderSearchResults = (target, products = []) => {
    if (!target) return;

    clearElement(target);

    if (!products.length) {
      const empty = createElement("div", "empty-state", "Ничего не найдено");
      target.appendChild(empty);
      return;
    }

    products.forEach((product) => {
      target.appendChild(createSearchResult(product));
    });
  };

  return {
    createCategoryCard,
    createProductCard,
    createSearchResult,
    renderCategories,
    renderProducts,
    renderSearchResults
  };
})();