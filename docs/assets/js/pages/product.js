(function () {
  const products = window.GRAF_LUKAS_PRODUCTS || [];

  const {
    qs,
    getQueryParam,
    getProductBySlug,
    createImage,
    createElement
  } = window.GrafLukasUtils;

  const { renderProducts } = window.GrafLukasRender;
  const cart = window.GrafLukasCart;

  const titleNode = qs("[data-product-title]");
  const descriptionNode = qs("[data-product-description]");
  const categoryNode = qs("[data-product-category]");
  const badgeNode = qs("[data-product-badge]");
  const noteNode = qs("[data-product-note]");
  const priceNode = qs("[data-product-price]");
  const imageRoot = qs("[data-product-image]");
  const addToCartButton = qs("[data-product-add]");
  const buyNowButton = qs("[data-product-buy]");
  const breadcrumbsCurrent = qs("[data-product-breadcrumb-current]");
  const detailsRoot = qs("[data-product-details]");
  const similarRoot = qs("[data-similar-products]");
  const pageTitleNode = qs("[data-product-page-title]");
  const pageTextNode = qs("[data-product-page-text]");
  const metaTitle = document.querySelector("title");

  const productParam = getQueryParam("product") || getQueryParam("slug");
  const currentProduct = getProductBySlug(products, productParam) || products[0] || null;

  const getSimilarProducts = (product) => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id && item.category === product.category)
      .slice(0, 4);
  };

  const setText = (node, value = "") => {
    if (!node) return;
    node.textContent = value;
  };

  const renderImage = (product) => {
    if (!imageRoot || !product) return;

    imageRoot.innerHTML = "";

    const imageWrap = createElement("div", "product-media__image-wrap");
    const image = createImage({
      src: product.image,
      alt: product.title,
      width: 220,
      height: 220,
      background: product.imageBg || ""
    });

    imageWrap.appendChild(image);
    imageRoot.appendChild(imageWrap);
  };

  const renderDetails = (product) => {
    if (!detailsRoot || !product) return;

    detailsRoot.innerHTML = "";

    const content = createElement("div", "product-details__content");

    const paragraph1 = createElement(
      "p",
      "",
      `${product.title} — цифровой товар из категории «${product.categoryLabel}». ${product.description}.`
    );

    const paragraph2 = createElement(
      "p",
      "",
      "После оплаты товар появляется в личном кабинете, а инструкция по активации доступна сразу после оформления."
    );

    const list = document.createElement("ul");
    [
      `Тип товара: ${product.categoryLabel}`,
      `Формат покупки: цифровая выдача`,
      `Статус: ${product.inStock ? "в наличии" : "нет в наличии"}`,
      `Особенность: ${product.note || "быстрая обработка заказа"}`
    ].forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    content.append(paragraph1, paragraph2, list);
    detailsRoot.appendChild(content);
  };

  const renderMainInfo = (product) => {
    if (!product) return;

    setText(titleNode, product.title);
    setText(descriptionNode, product.description);
    setText(categoryNode, product.categoryLabel || product.category);
    setText(badgeNode, product.badge || "Товар");
    setText(noteNode, product.note || "Быстрая выдача");
    setText(priceNode, product.price);
    setText(breadcrumbsCurrent, product.title);
    setText(pageTitleNode, product.title);
    setText(
      pageTextNode,
      `${product.description}. Цифровая покупка с быстрой выдачей и понятной активацией.`
    );

    document.title = `${product.title} — Graf Lukas`;

    if (metaTitle) {
      metaTitle.textContent = `${product.title} — Graf Lukas`;
    }

    if (addToCartButton) {
      addToCartButton.setAttribute("data-add-to-cart", product.id);
    }

    if (buyNowButton) {
      buyNowButton.href = `../checkout/index.html?product=${encodeURIComponent(product.id)}`;
    }

    renderImage(product);
    renderDetails(product);
  };

  const renderSimilar = (product) => {
    if (!similarRoot || !product) return;

    const similarProducts = getSimilarProducts(product);
    renderProducts(similarRoot, similarProducts);
    cart.bindAddToCartButtons(similarRoot);
  };

  const bindMainActions = () => {
    if (!addToCartButton) return;

    cart.bindAddToCartButtons(document);

    addToCartButton.addEventListener("click", () => {
      const originalText = addToCartButton.textContent;
      addToCartButton.textContent = "Добавлено";
      addToCartButton.disabled = true;

      window.setTimeout(() => {
        addToCartButton.textContent = originalText;
        addToCartButton.disabled = false;
      }, 900);
    });
  };

  const init = () => {
    if (!currentProduct) return;

    renderMainInfo(currentProduct);
    renderSimilar(currentProduct);
    bindMainActions();
    cart.bindCartCounter();
  };

  init();
})();