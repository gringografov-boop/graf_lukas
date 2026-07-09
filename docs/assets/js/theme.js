window.GrafLukasTheme = (function () {
  const STORAGE_KEY = "graf-lukas-theme";
  const root = document.documentElement;
  const toggleButton = document.getElementById("themeToggleBtn");

  const darkIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;

  const lightIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
    </svg>
  `;

  const getSavedTheme = () => {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  const saveTheme = (theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* ignore */
    }
  };

  const updateToggleUi = (theme) => {
    if (!toggleButton) return;

    toggleButton.innerHTML = theme === "dark" ? lightIcon : darkIcon;
    toggleButton.setAttribute(
      "aria-label",
      theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"
    );
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    updateToggleUi(theme);
  };

  const getPreferredTheme = () => {
    const savedTheme = getSavedTheme();

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return "dark";
  };

  const toggleTheme = () => {
    const currentTheme = root.getAttribute("data-theme") || getPreferredTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    saveTheme(nextTheme);
  };

  const init = () => {
    applyTheme(getPreferredTheme());

    if (toggleButton) {
      toggleButton.addEventListener("click", toggleTheme);
    }
  };

  return {
    init,
    applyTheme,
    toggleTheme,
    getPreferredTheme
  };
})();

window.GrafLukasTheme.init();
