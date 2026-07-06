(function () {
  const {
    qs,
    createElement
  } = window.GrafLukasUtils;

  const cart = window.GrafLukasCart;
  const faqItems = Array.isArray(window.GRAF_LUKAS_FAQ) ? window.GRAF_LUKAS_FAQ : [];

  const faqRoot = qs("[data-support-faq]");
  const form = qs("#supportForm");
  const successRoot = qs("#supportSuccess");
  const topicSelect = qs("#supportTopic");
  const emailInput = qs("#supportEmail");
  const messageInput = qs("#supportMessage");

  const renderFaq = () => {
    if (!faqRoot) return;

    faqRoot.innerHTML = "";

    if (!faqItems.length) {
      const empty = createElement(
        "div",
        "support-card__meta",
        "FAQ пока не заполнен. Попробуй написать в поддержку через форму ниже."
      );
      faqRoot.appendChild(empty);
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

  const showSuccess = (topicValue, emailValue) => {
    if (!successRoot) return;

    successRoot.hidden = false;
    successRoot.innerHTML = "";

    const title = createElement(
      "div",
      "support-success__title",
      "Обращение отправлено"
    );

    const text = createElement(
      "div",
      "support-success__text",
      `Мы получили заявку по теме «${topicValue}». Ответ отправим на ${emailValue} или свяжемся через указанный контакт.`
    );

    successRoot.append(title, text);
  };

  const bindForm = () => {
    if (!form) return;
    if (form.dataset.bound === "true") return;

    form.dataset.bound = "true";

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const topicValue =
        topicSelect?.options?.[topicSelect.selectedIndex]?.textContent?.trim() || "Поддержка";

      const emailValue = String(emailInput?.value || "").trim();
      const messageValue = String(messageInput?.value || "").trim();

      if (!emailValue || !messageValue) {
        form.reportValidity();
        return;
      }

      showSuccess(topicValue, emailValue);
      form.reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const init = () => {
    renderFaq();
    bindForm();
    cart.bindCartCounter();
  };

  init();
})();