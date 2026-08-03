(function () {
  const { qs } = window.GrafLukasUtils;

  const profileNameNode = qs("[data-account-name]");
  const profileMetaNode = qs("[data-account-meta]");
  const avatarNode = qs("[data-account-avatar]");

  const setText = (node, value) => {
    if (!node) return;

    node.textContent = value;
  };

  const renderGuestState = () => {
    setText(profileNameNode, "Вход не выполнен");
    setText(profileMetaNode, "Аккаунт не обязателен для покупки — это дополнительная функция.");
    setText(avatarNode, "?");
  };

  const init = () => {
    renderGuestState();
  };

  init();
})();