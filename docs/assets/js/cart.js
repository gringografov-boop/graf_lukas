window.GrafLukasCart = (function () {
  const STORAGE_KEY = "graf-lukas-cart";
  const products = window.GRAF_LUKAS_PRODUCTS || [];

  const readCart = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  };

  const writeCart = (cart) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      /* ignore */
    }
  };

  const getCart = () => readCart();

  const getCartCount = () => {
    return readCart().reduce((total, item) => total + item.quantity, 0);
  };

  const findProduct = (productId) => {
    return products.find((product) => product.id === productId) || null;
  };

  const add = (productId, quantity = 1) => {
    const product = findProduct(productId);
    if (!product) return;

    const cart = readCart();
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        numericPrice: product.numericPrice || 0,
        image: product.image,
        href: product.href,
        quantity
      });
    }

    writeCart(cart);
    notify();
  };

  const remove = (productId) => {
    const cart = readCart().filter((item) => item.id !== productId);
    writeCart(cart);
    notify();
  };

  const updateQuantity = (productId, quantity) => {
    const cart = readCart();
    const item = cart.find((entry) => entry.id === productId);

    if (!item) return;

    if (quantity <= 0) {
      remove(productId);
      return;
    }

    item.quantity = quantity;
    writeCart(cart);
    notify();
  };

  const clear = () => {
    writeCart([]);
    notify();
  };

  const getSubtotal = () => {
    return readCart().reduce((sum, item) => {
      return sum + (item.numericPrice || 0) * item.quantity;
    }, 0);
  };

  const notify = () => {
    window.dispatchEvent(
      new CustomEvent("graf-lukas-cart:change", {
        detail: {
          cart: readCart(),
          count: getCartCount(),
          subtotal: getSubtotal()
        }
      })
    );
  };

  const bindAddToCartButtons = (scope = document) => {
    const buttons = scope.querySelectorAll("[data-add-to-cart]");

    buttons.forEach((button) => {
      if (button.dataset.cartBound === "true") return;

      button.dataset.cartBound = "true";
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-add-to-cart");
        add(productId, 1);

        const originalText = button.textContent;
        button.textContent = "Добавлено";
        button.disabled = true;

        window.setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 900);
      });
    });
  };

  const bindCartCounter = (selector = "[data-cart-count]") => {
    const updateCounter = () => {
      const count = getCartCount();
      document.querySelectorAll(selector).forEach((node) => {
        node.textContent = count;
        node.hidden = count === 0;
      });
    };

    updateCounter();
    window.addEventListener("graf-lukas-cart:change", updateCounter);
  };

  return {
    getCart,
    getCartCount,
    add,
    remove,
    updateQuantity,
    clear,
    getSubtotal,
    bindAddToCartButtons,
    bindCartCounter,
    notify
  };
})();