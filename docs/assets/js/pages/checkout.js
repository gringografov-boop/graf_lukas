(function () {
  const products = window.GRAF_LUKAS_PRODUCTS || [];

  const {
    qs,
    getQueryParam,
    getProductBySlug,
    createElement,
    createImage,
    formatPrice
  } = window.GrafLukasUtils;

  const cart = window.GrafLukasCart;

  const cartRoot = qs("#checkoutCart");
  const emptyRoot = qs("#checkoutEmpty");
  const layoutRoot = qs("#checkoutLayout");
  const form = qs("#checkoutForm");
  const successBox = qs("#checkoutSuccess");
  const countNode = qs("[data-checkout-count]");
  const subtotalNode = qs("[data-checkout-subtotal]");
  const totalNode = qs("[data-checkout-total]");
  const directBadgeNode = qs("[data-checkout-mode]");

  const directProductParam = getQueryParam("product");

  const getDirectProduct = () => {
    if (!directProductParam) return null;
    return getProductBySlug(products, directProductParam);
  };

  const getCheckoutItems = () => {
    const directProduct = getDirectProduct();

    if (directProduct) {
      return [
        {
          id: directProduct.id,
          title: directProduct.title,
          price: directProduct.price,
          numericPrice: directProduct.numericPrice || 0,
          image: directProduct.image,
          imageBg: directProduct.imageBg || "",
          quantity: 1
        }
      ];
    }

    return cart.getCart();
  };

  const getSubtotal = (items) => {
    return items.reduce((sum, item) => {
      return sum + (item.numericPrice || 0) * (item.quantity || 1);
    }, 0);
  };

  const createCartItem = (item) => {
    const article = createElement("article", "checkout-cart__item");

    const thumb = createElement("div", "checkout-cart__thumb");
    const img = createImage({
      src: item.image,
      alt: item.title,
      width: 48,
      height: 48,
      background: item.imageBg || ""
    });

    const body = createElement("div", "checkout-cart__body");
    const title = createElement("div", "checkout-cart__title", item.title);
    const meta = createElement(
      "div",
      "checkout-cart__meta",
      `Количество: ${item.quantity || 1}`
    );

    const priceValue =
      typeof item.numericPrice === "number" && item.numericPrice > 0
        ? formatPrice((item.numericPrice || 0) * (item.quantity || 1))
        : item.price;

    const price = createElement("div", "checkout-cart__price", priceValue);

    thumb.appendChild(img);
    body.append(title, meta);
    article.append(thumb, body, price);

    return article;
  };

  const renderCart = (items) => {
    if (!cartRoot) return;

    cartRoot.innerHTML = "";
    items.forEach((item) => {
      cartRoot.appendChild(createCartItem(item));
    });
  };

  const renderTotals = (items) => {
    const subtotal = getSubtotal(items);
    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    if (countNode) {
      countNode.textContent = String(count);
    }

    if (subtotalNode) {
      subtotalNode.textContent = subtotal > 0 ? formatPrice(subtotal) : "По тарифу";
    }

    if (totalNode) {
      totalNode.textContent = subtotal > 0 ? formatPrice(subtotal) : "По тарифу";
    }

    if (directBadgeNode) {
      directBadgeNode.textContent = getDirectProduct() ? "Быстрая покупка" : "Корзина";
    }
  };

  const toggleState = (items) => {
    const hasItems = items.length > 0;

    if (layoutRoot) {
      layoutRoot.hidden = !hasItems;
    }

    if (emptyRoot) {
      emptyRoot.hidden = hasItems;
    }

    if (successBox) {
      successBox.hidden = true;
    }
  };

  const showSuccess = (items) => {
    if (successBox) {
      successBox.hidden = false;
      successBox.innerHTML = "";
      successBox.appendChild(
        createElement(
          "div",
          "checkout-note",
          "Заказ оформлен. Данные для получения товара появятся в личном кабинете."
        )
      );
    }

    if (!getDirectProduct()) {
      cart.clear();
    }

    renderPage(items.length ? [] : getCheckoutItems());
  };

  const bindForm = (items) => {
    if (!form) return;

    if (form.dataset.bound === "true") return;
    form.dataset.bound = "true";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!items.length) return;

      const requiredFields = form.querySelectorAll("[required]");
      const isValid = Array.from(requiredFields).every((field) => {
        return String(field.value || "").trim().length > 0;
      });

      if (!isValid) {
        form.reportValidity();
        return;
      }

      showSuccess(items);
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const renderPage = (forcedItems) => {
    const items = Array.isArray(forcedItems) ? forcedItems : getCheckoutItems();

    toggleState(items);

    if (!items.length) return;

    renderCart(items);
    renderTotals(items);
    bindForm(items);
  };

  const init = () => {
    renderPage();
    cart.bindCartCounter();
  };

  init();
})();