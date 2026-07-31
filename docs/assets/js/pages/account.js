(function () {
  const { qs, createElement } = window.GrafLukasUtils;

  const profileNameNode = qs("[data-account-name]");
  const profileMetaNode = qs("[data-account-meta]");
  const avatarNode = qs("[data-account-avatar]");

  const kpiOrdersNode = qs("[data-account-kpi-orders]");
  const kpiSpentNode = qs("[data-account-kpi-spent]");
  const kpiActiveNode = qs("[data-account-kpi-active]");

  const ordersRoot = qs("[data-account-orders]");
  const emptyRoot = qs("[data-account-empty]");

  const setText = (node, value) => {
    if (!node) return;

    node.textContent = value;
  };

  const renderGuestState = () => {
    setText(profileNameNode, "Гость");
    setText(profileMetaNode, "Войдите, когда вход по телефону и VK ID будет подключён.");
    setText(avatarNode, "Г");

    setText(kpiOrdersNode, "—");
    setText(kpiSpentNode, "—");
    setText(kpiActiveNode, "—");
  };

  const renderOrdersPlaceholder = () => {
    if (!ordersRoot || !emptyRoot) return;

    ordersRoot.innerHTML = "";
    ordersRoot.hidden = true;
    emptyRoot.hidden = false;

    emptyRoot.innerHTML = "";
    emptyRoot.appendChild(
      createElement(
        "p",
        "account-empty__text",
        "История заказов станет доступна после безопасного подключения входа и подтверждения владельца контакта."
      )
    );
  };

  const init = () => {
    renderGuestState();
    renderOrdersPlaceholder();
  };

  init();
})();