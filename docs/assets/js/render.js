window.GrafLukasRender = (function () {
  const { createElement, createImage, clearElement } = window.GrafLukasUtils;

  const PRODUCT_THEMES = {
    steam: {
      accent: "#1b6fff",
      accentSoft: "#cfe2ff",
      bgStart: "#07111f",
      bgMid: "#12345f",
      bgEnd: "#1b2838",
      title: "#dfefff",
      text: "#8fb5df",
      label: "Игры · Steam"
    },
    spotify: {
      accent: "#1DB954",
      accentSoft: "#c8f7d8",
      bgStart: "#06160d",
      bgMid: "#0d3e22",
      bgEnd: "#0f6b36",
      title: "#eafff1",
      text: "#a6e0b8",
      label: "Музыка · Spotify"
    },
    netflix: {
      accent: "#E50914",
      accentSoft: "#ffd6d9",
      bgStart: "#140507",
      bgMid: "#3b0a10",
      bgEnd: "#7a111a",
      title: "#fff0f1",
      text: "#f0b6ba",
      label: "Видео · Netflix"
    },
    telegram: {
      accent: "#2CA5E0",
      accentSoft: "#d7f2ff",
      bgStart: "#05131b",
      bgMid: "#0e4060",
      bgEnd: "#136b99",
      title: "#eefaff",
      text: "#b1def3",
      label: "Мессенджеры · Telegram"
    },
    roblox: {
      accent: "#E2231A",
      accentSoft: "#ffd9d5",
      bgStart: "#170505",
      bgMid: "#4a0f0c",
      bgEnd: "#8b1915",
      title: "#fff2f1",
      text: "#efb8b3",
      label: "Игры · Roblox"
    },
    playstation: {
      accent: "#003791",
      accentSoft: "#d7e5ff",
      bgStart: "#030817",
      bgMid: "#06245d",
      bgEnd: "#0a3f9e",
      title: "#eef4ff",
      text: "#b7caef",
      label: "Игры · PlayStation"
    },
    xbox: {
      accent: "#107C10",
      accentSoft: "#d9f4d8",
      bgStart: "#071507",
      bgMid: "#174d17",
      bgEnd: "#1b7d1b",
      title: "#eeffef",
      text: "#b6dfb7",
      label: "Игры · Xbox"
    },
    nintendo: {
      accent: "#E60012",
      accentSoft: "#ffd9de",
      bgStart: "#190406",
      bgMid: "#5f0b13",
      bgEnd: "#b30f1d",
      title: "#fff1f3",
      text: "#f1b8bf",
      label: "Игры · Nintendo"
    },
    apple: {
      accent: "#7c8ba1",
      accentSoft: "#e8edf4",
      bgStart: "#111317",
      bgMid: "#2b313d",
      bgEnd: "#515d71",
      title: "#f6f8fb",
      text: "#c7cfdd",
      label: "Приложения · Apple"
    },
    googleplay: {
      accent: "#34A853",
      accentSoft: "#daf3e0",
      bgStart: "#08140d",
      bgMid: "#154d2a",
      bgEnd: "#2b8a4e",
      title: "#effdf3",
      text: "#b8e2c4",
      label: "Приложения · Google Play"
    },
    battlenet: {
      accent: "#148EFF",
      accentSoft: "#d8ecff",
      bgStart: "#04111f",
      bgMid: "#083863",
      bgEnd: "#0c61aa",
      title: "#eef7ff",
      text: "#b3d7fb",
      label: "Игры · Battle.net"
    },
    valorant: {
      accent: "#FF4655",
      accentSoft: "#ffd8dc",
      bgStart: "#17080b",
      bgMid: "#5c1820",
      bgEnd: "#a92834",
      title: "#fff1f3",
      text: "#f3bdc3",
      label: "Игры · Valorant"
    },
    default: {
      accent: "#7c3aed",
      accentSoft: "#eadcff",
      bgStart: "#0e1021",
      bgMid: "#30205f",
      bgEnd: "#4c1d95",
      title: "#f3ecff",
      text: "#d2c3f8",
      label: "Цифровой товар"
    }
  };

  const getProductTheme = (product) => {
    const id = `${product.id || ""} ${product.slug || ""} ${product.title || ""}`.toLowerCase();

    if (id.includes("steam")) return PRODUCT_THEMES.steam;
    if (id.includes("spotify")) return PRODUCT_THEMES.spotify;
    if (id.includes("netflix")) return PRODUCT_THEMES.netflix;
    if (id.includes("telegram")) return PRODUCT_THEMES.telegram;
    if (id.includes("roblox")) return PRODUCT_THEMES.roblox;
    if (id.includes("playstation") || id.includes("psn")) return PRODUCT_THEMES.playstation;
    if (id.includes("xbox")) return PRODUCT_THEMES.xbox;
    if (id.includes("nintendo")) return PRODUCT_THEMES.nintendo;
    if (id.includes("apple") || id.includes("itunes")) return PRODUCT_THEMES.apple;
    if (id.includes("google play") || id.includes("google-play")) return PRODUCT_THEMES.googleplay;
    if (id.includes("battle.net") || id.includes("battlenet")) return PRODUCT_THEMES.battlenet;
    if (id.includes("valorant")) return PRODUCT_THEMES.valorant;

    return PRODUCT_THEMES.default;
  };

  const setThemeVars = (node, theme) => {
    node.style.setProperty("--card-accent", theme.accent);
    node.style.setProperty("--card-accent-soft", theme.accentSoft);
    node.style.setProperty("--card-bg-start", theme.bgStart);
    node.style.setProperty("--card-bg-mid", theme.bgMid);
    node.style.setProperty("--card-bg-end", theme.bgEnd);
    node.style.setProperty("--card-title", theme.title);
    node.style.setProperty("--card-text", theme.text);
    node.style.setProperty("--card-surface", `color-mix(in srgb, ${theme.accent} 16%, white)`);
    node.style.setProperty("--card-surface-deep", `color-mix(in srgb, ${theme.accent} 12%, var(--color-surface-2))`);
    node.style.setProperty("--card-accent-deep", `color-mix(in srgb, ${theme.accent} 72%, black)`);
  };

  const createCategoryCard = (category) => {
    const link = createElement("a", "category-card");
    link.href = category.href;
    link.setAttribute("data-category", category.slug);

    const icon = createElement("div", "category-card__icon");
    const image = createImage({ src: category.image, alt: category.title, width: 44, height: 44, background: category.imageBg });

    const body = createElement("div", "category-card__body");
    const title = createElement("div", "category-card__title", category.title);
    const description = createElement("div", "category-card__text", category.description);

    icon.appendChild(image);
    body.append(title, description);
    link.append(icon, body);

    return link;
  };

  const createPillIcon = (mode, product) => {
    const btn = createElement("button", "product-card__pill");
    btn.type = "button";

    if (mode === "open") {
      btn.setAttribute("aria-label", `Открыть ${product.title}`);
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"></path><path d="M9 7h8v8"></path></svg>';
      btn.addEventListener("click", () => {
        window.location.href = product.href;
      });
    }

    if (mode === "cart") {
      btn.setAttribute("aria-label", `Добавить ${product.title} в корзину`);
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 7H7"></path></svg>';
      btn.setAttribute("data-add-to-cart", product.id);
    }

    if (mode === "logo") {
      btn.setAttribute("aria-label", `${product.title}`);
      const img = createImage({ src: product.image, alt: product.title, width: 14, height: 14, background: "transparent" });
      btn.appendChild(img);
      btn.addEventListener("click", () => {
        window.location.href = product.href;
      });
    }

    return btn;
  };

  const createProductCard = (product) => {
    const theme = getProductTheme(product);
    const card = createElement("article", "product-card product-card--3d");
    setThemeVars(card, theme);
    card.dataset.product = product.slug || product.id || "product";

    const top = createElement("div", "product-card__top");
    const badge = createElement("span", "product-card__badge", product.badge || theme.label);
    top.append(badge);

    const scene = createElement("div", "product-card__scene");
    const stage = createElement("div", "product-card__3d");
    const glass = createElement("div", "product-card__glass");
    const orbits = createElement("div", "product-card__orbits");
    orbits.append(
      createElement("span", "product-card__orbit product-card__orbit--1"),
      createElement("span", "product-card__orbit product-card__orbit--2"),
      createElement("span", "product-card__orbit product-card__orbit--3")
    );
    const orbitLogo = createElement("span", "product-card__orbit product-card__orbit--4");
    orbitLogo.appendChild(createImage({ src: product.image, alt: product.title, width: 19, height: 19, background: "transparent" }));
    orbits.appendChild(orbitLogo);

    const content3d = createElement("div", "product-card__content3d");
    const label = createElement("div", "product-card__label", theme.label);
    const textWrap = createElement("div", "product-card__textwrap");
    const headline = createElement("div", "product-card__headline", product.title);
    const subline = createElement("div", "product-card__subline", product.description);
    textWrap.append(headline, subline);

    const tools = createElement("div", "product-card__tools");
    const pills = createElement("div", "product-card__pills");
    pills.append(
      createPillIcon("logo", product),
      createPillIcon("cart", product),
      createPillIcon("open", product)
    );

    const cta3d = createElement("button", "product-card__cta3d", "OPEN");
    cta3d.type = "button";
    cta3d.setAttribute("aria-label", `Открыть ${product.title}`);
    cta3d.innerHTML = 'OPEN <svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>';
    cta3d.addEventListener("click", () => {
      window.location.href = product.href;
    });

    tools.append(pills, cta3d);
    content3d.append(label, textWrap, tools);
    stage.append(glass, orbits, content3d);
    scene.append(stage);

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
    const openLink = createElement("a", "product-card__action product-card__action--open", "Открыть");
    openLink.href = product.href;

    const cartButton = createElement("button", "product-card__action product-card__action--cart", "В корзину");
    cartButton.type = "button";
    cartButton.setAttribute("data-add-to-cart", product.id);

    actions.append(openLink, cartButton);
    card.append(top, scene, body, meta, actions);

    return card;
  };

  const createSearchResult = (product) => {
    const link = createElement("a", "search-result");
    link.href = product.href;

    const icon = createElement("div", "search-result__icon");
    const image = createImage({ src: product.image, alt: product.title, width: 40, height: 40, background: product.imageBg });

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
    categories.forEach((category) => target.appendChild(createCategoryCard(category)));
  };

  const renderProducts = (target, products = []) => {
    if (!target) return;
    clearElement(target);
    products.forEach((product) => target.appendChild(createProductCard(product)));
  };

  const renderSearchResults = (target, products = []) => {
    if (!target) return;
    clearElement(target);

    if (!products.length) {
      const empty = createElement("div", "empty-state", "Ничего не найдено");
      target.appendChild(empty);
      return;
    }

    products.forEach((product) => target.appendChild(createSearchResult(product)));
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
