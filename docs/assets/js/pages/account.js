(function () {
  const products = window.GRAF_LUKAS_PRODUCTS || [];

  const {
    qs,
    createElement,
    formatPrice
  } = window.GrafLukasUtils;

  const cart = window.GrafLukasCart;

  const profileNameNode = qs("[data-account-name]");
  const profileMetaNode = qs("[data-account-meta]");
  const avatarNode = qs("[data-account-avatar]");

  const kpiOrdersNode = qs("[data-account-kpi-orders]");
  const kpiSpentNode = qs("[data-account-kpi-spent]");
  const kpiActiveNode = qs("[data-account-kpi-active]");

  const ordersRoot = qs("[data-account-orders]");
  const emptyRoot = qs("[data-account-empty]");

  const mockProfile = {
    name: "Покупатель",
    email: "client@graflukas.store",
    telegram: "@graflukas_user",
    tier: "verified",
    region: "RU"
  };

  const buildMockOrders = () => {
    const source = products.slice(0, 4);

    return source.map((product, index) => {
      const statuses = ["done", "pending", "done", "problem"];
      const labels = {
        done: "Выдан",
        pending: "В обработке",
        problem: "Нужно действие"
      };

      const status = statuses[index] || "done";

      return {
        id: `GL-${String(1042 + index)}`,
        title: product.title,
        category: product.categoryLabel || product.category,
        price: product.numericPrice || 0,
        priceLabel: product.price,
        date: ["29.06.2026", "27.06.2026", "24.06.2026", "21.06.2026"][index] || "20.06.2026",
        status,
        statusLabel: labels[status],
        delivery: status === "done" ? "Доступно в кабинете" : status === "pending" ? "Ожидает выдачу" : "Требуется подтверждение",
        actionPrimary:
          status === "done"
            ? "Открыть данные"
            : status === "pending"
            ? "Проверить статус"
            : "Связаться с поддержкой"
      };
    });
  };

  const orders = buildMockOrders();

  const setText = (node, value) => {
    if (!node) return;
    node.textContent = value;
  };

  const renderProfile = () => {
    setText(profileNameNode, mockProfile.name);
    setText(profileMetaNode, `${mockProfile.email} · ${mockProfile.telegram}`);
    setText(avatarNode, mockProfile.name.slice(0, 1).toUpperCase());
  };

  const renderKpis = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.price || 0), 0);
    const activeOrders = orders.filter((order) => order.status === "pending" || order.status === "problem").length;

    setText(kpiOrdersNode, String(totalOrders));
    setText(kpiSpentNode, totalSpent > 0 ? formatPrice(totalSpent) : "0 ₽");
    setText(kpiActiveNode, String(activeOrders));
  };

  const createStatusBadge = (order) => {
    return createElement(
      "div",
      `account-order__status ${
        order.status === "done"
          ? "is-done"
          : order.status === "pending"
          ? "is-pending"
          : "is-problem"
      }`,
      order.statusLabel
    );
  };

  const createInfoCell = (label, value) => {
    const cell = createElement("div", "account-order__cell");
    const labelNode = createElement("div", "account-order__label", label);
    const valueNode = createElement("div", "account-order__value", value);

    cell.append(labelNode, valueNode);
    return cell;
  };

  const createOrderCard = (order) => {
    const article = createElement("article", "account-order");

    const top = createElement("div", "account-order__top");
    const topText = createElement("div", "");
    const title = createElement("div", "account-order__title", order.title);
    const meta = createElement(
      "div",
      "account-order__meta",
      `Заказ ${order.id} · ${order.date}`
    );

    topText.append(title, meta);
    top.append(topText, createStatusBadge(order));

    const grid = createElement("div", "account-order__grid");
    grid.append(
      createInfoCell("Категория", order.category),
      createInfoCell("Сумма", order.price > 0 ? formatPrice(order.price) : order.priceLabel),
      createInfoCell("Получение", order.delivery)
    );

    const actions = createElement("div", "account-order__actions");

    const primaryLink = createElement("a", "button button--primary", order.actionPrimary);
    primaryLink.href =
      order.status === "done"
        ? "../product/index.html"
        : order.status === "pending"
        ? "../checkout/index.html"
        : "../support/index.html";

    const secondaryLink = createElement("a", "button button--ghost", "Повторить покупку");
    secondaryLink.href = "../catalog/index.html";

    actions.append(primaryLink, secondaryLink);
    article.append(top, grid, actions);

    return article;
  };

  const renderOrders = () => {
    if (!ordersRoot || !emptyRoot) return;

    ordersRoot.innerHTML = "";

    if (!orders.length) {
      emptyRoot.hidden = false;
      ordersRoot.hidden = true;
      return;
    }

    emptyRoot.hidden = true;
    ordersRoot.hidden = false;

    orders.forEach((order) => {
      ordersRoot.appendChild(createOrderCard(order));
    });
  };

  const init = () => {
    renderProfile();
    renderKpis();
    renderOrders();
    cart.bindCartCounter();
  };

  init();
})();