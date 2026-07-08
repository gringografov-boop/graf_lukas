window.GrafLukasUtils = (function () {
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const createElement = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  };

  const createImage = ({ src, alt, width, height, background }) => {
    const img = document.createElement("img");
    img.src = src || "";
    img.alt = alt || "";
    if (width) img.width = width;
    if (height) img.height = height;
    img.loading = "lazy";
    img.decoding = "async";
    if (background) img.style.background = background;

    img.onerror = function () {
      this.style.display = "none";
    };

    return img;
  };

  const clearElement = (el) => {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  };

  const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const formatPrice = (value) => {
    if (typeof value !== "number") return String(value);
    return value.toLocaleString("ru-RU") + " ₽";
  };

  const getFeaturedProducts = (products) => {
    if (!Array.isArray(products)) return [];
    return products.filter((p) => p.featured && p.inStock !== false);
  };

  const searchProducts = (products, query) => {
    if (!Array.isArray(products) || !query) return [];
    const q = query.toLowerCase().trim();

    return products.filter((p) => (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    ));
  };

  const getProductsByCategory = (products, categorySlug) => {
    if (!Array.isArray(products)) return [];
    if (!categorySlug) return products;
    return products.filter((p) => p.category === categorySlug);
  };

  const getProductById = (products, id) => {
    if (!Array.isArray(products)) return null;
    return products.find((p) => p.id === id || p.slug === id) || null;
  };

  const getProductBySlug = (products, slug) => {
    if (!Array.isArray(products)) return null;
    return products.find((p) => p.slug === slug || p.id === slug) || null;
  };

  const getParam = (name) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  };

  const getQueryParam = (name) => getParam(name);

  return {
    qs,
    qsa,
    createElement,
    createImage,
    clearElement,
    debounce,
    formatPrice,
    getFeaturedProducts,
    searchProducts,
    getProductsByCategory,
    getProductById,
    getProductBySlug,
    getParam,
    getQueryParam
  };
})();
