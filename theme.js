(function () {
  var THEME_MAP = {
    mathematik: "var(--primary)", math: "var(--primary)", matematicas: "var(--primary)",
    physik: "var(--accent-2)", physics: "var(--accent-2)", fisica: "var(--accent-2)",
    biologie: "var(--bio)", biology: "var(--bio)", biologia: "var(--bio)"
  };
  var CATEGORY_CLASS = {
    mathematik: "math", math: "math", matematicas: "math",
    physik: "physics", physics: "physics", fisica: "physics",
    biologie: "bio", biology: "bio", biologia: "bio"
  };

  function applyTheme(id) {
    var themeVar = THEME_MAP[id];
    if (!themeVar) return;
    document.documentElement.style.setProperty("--theme", themeVar);
    var cat = CATEGORY_CLASS[id];
    document.querySelectorAll(".category-tabs a").forEach(function (a) {
      a.classList.remove("active-tab");
    });
    document.querySelectorAll(".category-tabs a." + cat).forEach(function (a) {
      a.classList.add("active-tab");
    });
  }

  document.querySelectorAll('.category-tabs a[href^="#"], nav.site-nav a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function () {
      applyTheme(link.getAttribute("href").slice(1));
    });
  });
})();
