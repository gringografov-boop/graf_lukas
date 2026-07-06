window.GrafLukasUtils = (function () {
  // DOM helpers
  const qs = (selector, scope) => (scope || document).querySelector(selector);
  const qsa = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  // Create element with optional className and text
  const createElement = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  };

  // Create img element
  const createImage = ({ src, alt, width, height, background }) => {
    const img = document.createElement("img");
    img.src = src || "";
    img.alt = alt || "";
    if (width) img.width = width;
    if (height) img.height = height;
    img.loading = "lazy";
    img.decoding = "async";
    if (background) {
      img.style.background = background;
    }
    img.onerror = function () {
      this.style.display = "none";
    };
    return img;
  };

  // Clear all children of an element
  const clearElement = (el) => {
    if (!el) return;
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  };

  // Debounce
  const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  // Format price in rubles
  const formatPrice = (value) => {
    if (typeof value !== "number") return String(value);
    return value.toLocaleString("ru-RU") + " ₽";
  };

  // Get featured products
  const getFeaturedProducts = (products) => {
    if (!Array.isArray(products)) return [];
    return products.filter((p) => p.featured && p.inStock !== false);
  };

  // Search products by query
  const searchProducts = (products, query) => {
    if (!Array.isArray(products) || !query) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      return (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    });
  };

  // Get products by category slug
  const getProductsByCategory = (products, categorySlug) => {
    if (!Array.isArray(products)) return [];
    if (!categorySlug) return products;
    return products.filter((p) => p.category === categorySlug);
  };

  // Get product by id or slug
  const getProductById = (products, id) => {
    if (!Array.isArray(products)) return null;
    return products.find((p) => p.id === id || p.slug === id) || null;
  };

  // Get URL param
  const getParam = (name) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  };

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
    getParam
  };
})();
