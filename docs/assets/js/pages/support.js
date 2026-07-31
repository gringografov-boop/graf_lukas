(function () {
  const { qs, createElement } = window.GrafLukasUtils;

  const faqItems = Array.isArray(window.GRAF_LUKAS_FAQ)
    ? window.GRAF_LUKAS_FAQ
    : [];

  const faqRoot = qs("[data-support-faq]");
  const form = qs("#supportForm");
  const successRoot = qs("#supportSuccess");

  const renderFaq = () => {
    if (!faqRoot) return;

    faqRoot.innerHTML = "";

    if (!faqItems.length) {
      faqRoot.appendChild(
        createElement(
          "div",
          "support-card__meta",
          "FAQ пока не заполнен. Контакты поддержки будут доступны здесь."
        )
      );
      return;
    }

    faqItems.forEach((item, index) => {
      const details = document.createElement("details");
      details.className = "support-faq-item";

      if (index === 0) {
        details.open = true;
      }

      const summary = createElement(
        "summary",
        "support-faq-question",
        item.question || "Вопрос"
      );

      const answer = createElement(
        "div",
        "support-faq-answer",
        item.answer || "Ответ скоро появится."
      );

      details.append(summary, answer);
      faqRoot.appendChild(details);
    });
  };

  const showUnavailableMessage = () => {
    if (!successRoot) return;

    successRoot.hidden = false;
    successRoot.innerHTML = "";

    successRoot.appendChild(
      createElement(
        "div",
        "support-success__text",
        "Отправка обращений через форму пока не подключена. Пожалуйста, используйте опубликованный канал поддержки, когда он будет добавлен."
      )
    );
  };

  const bindForm = () => {
    if (!form || form.dataset.bound === "true") return;

    form.dataset.bound = "true";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      showUnavailableMessage();
    });
  };

  const init = () => {
    renderFaq();
    bindForm();
  };

  init();
})();