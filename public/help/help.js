function changeLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (helpDict[lang] && helpDict[lang][key]) {
      el.innerHTML = helpDict[lang][key];
    }
  });
}

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userLang = urlParams.get("lang") || "en";
  const select = document.getElementById("langSwitcher");

  if (helpDict[userLang]) {
    select.value = userLang;
    changeLanguage(userLang);
  } else {
    changeLanguage("en");
  }
};
