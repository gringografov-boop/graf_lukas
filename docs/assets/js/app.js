(function () {
  const qsa = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const readCartCount = () => {
    const cartApi = window.GrafLukasCart;

    if (!cartApi || typeof cartApi.getCart !== "function") {
      return 0;
    }

    return (cartApi.getCart() || []).reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
  };

  const syncCartCounters = () => {
    const count = readCartCount();

    qsa("[data-cart-count]").forEach((node) => {
      node.textContent = String(count);
      node.hidden = count <= 0;
    });
  };

  const bindCartSync = () => {
    syncCartCounters();
    window.addEventListener("graf-lukas-cart:change", syncCartCounters);
    window.addEventListener("pageshow", syncCartCounters);
  };

  const bindCurrentYear = () => {
    qsa("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  };

  const markCurrentNavLink = () => {
    const currentPath = window.location.pathname.replace(/\/+$/, "");

    qsa(".nav a, .footer__nav a, .account-nav__link").forEach((link) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) return;

      const linkPath = new URL(href, window.location.href)
        .pathname
        .replace(/\/+$/, "");

      if (linkPath === currentPath) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const exposeAppApi = () => {
    window.GrafLukasApp = {
      openSearch: () => window.GrafLukasSearch?.open(),
      closeSearch: () => window.GrafLukasSearch?.close(),
      syncCartCounters
    };
  };

  const rgbToHex = (r, g, b) =>
    "#" + [r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("");

  const getAverageColor = (image) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const size = 32;

    canvas.width = size;
    canvas.height = size;
    context.drawImage(image, 0, 0, size, size);

    const { data } = context.getImageData(0, 0, size, size);
    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3];
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];

      if (alpha < 120 || Math.max(r, g, b) - Math.min(r, g, b) < 14) {
        continue;
      }

      red += r;
      green += g;
      blue += b;
      count += 1;
    }

    if (!count) return "#16c47f";

    return rgbToHex(
      Math.round(red / count),
      Math.round(green / count),
      Math.round(blue / count)
    );
  };

  const applyIconDrivenCardColors = (scope = document) => {
    qsa(".product-card, .category-card", scope).forEach((card) => {
      const image = card.querySelector(
        ".product-card__icon img, .category-card__icon img"
      );

      if (!image || image.dataset.cardAccentBound === "true") return;

      image.dataset.cardAccentBound = "true";

      const applyAccent = () => {
        try {
          card.style.setProperty("--card-accent", getAverageColor(image));
        } catch {
          card.style.setProperty("--card-accent", "#16c47f");
        }
      };

      if (image.complete && image.naturalWidth) {
        applyAccent();
      } else {
        image.addEventListener("load", applyAccent, { once: true });
        image.addEventListener(
          "error",
          () => card.style.setProperty("--card-accent", "#16c47f"),
          { once: true }
        );
      }
    });
  };

  const init = () => {
    bindCartSync();
    bindCurrentYear();
    markCurrentNavLink();
    exposeAppApi();
    applyIconDrivenCardColors();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("load", () => {
    window.requestAnimationFrame(() => applyIconDrivenCardColors());
  });

  window.addEventListener("graf-lukas:cards-rendered", (event) => {
    applyIconDrivenCardColors(event.detail?.scope || document);
  });
})();