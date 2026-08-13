(function () {
  var THEME_MAP = {
    mathematik: "var(--primary)", math: "var(--primary)", matematicas: "var(--primary)",
    physik: "var(--accent-2)", physics: "var(--accent-2)", fisica: "var(--accent-2)",
    biologie: "var(--bio)", biology: "var(--bio)", biologia: "var(--bio)",
    chemie: "var(--chem)", chemistry: "var(--chem)", quimica: "var(--chem)",
    geschichte: "var(--history)", history: "var(--history)", historia: "var(--history)",
    sporttheorie: "var(--sport)", "sports-theory": "var(--sport)", "teoria-del-deporte": "var(--sport)"
  };
  var CATEGORY_CLASS = {
    mathematik: "math", math: "math", matematicas: "math",
    physik: "physics", physics: "physics", fisica: "physics",
    biologie: "bio", biology: "bio", biologia: "bio",
    chemie: "chem", chemistry: "chem", quimica: "chem",
    geschichte: "history", history: "history", historia: "history",
    sporttheorie: "sport", "sports-theory": "sport", "teoria-del-deporte": "sport"
  };

  var currentFilter = null;

  function applyTheme(id) {
    var themeVar = THEME_MAP[id];
    document.documentElement.style.setProperty("--theme", themeVar || "var(--primary)");
    var cat = CATEGORY_CLASS[id];
    document.querySelectorAll(".category-tabs a").forEach(function (a) {
      a.classList.remove("active-tab");
    });
    if (cat) {
      document.querySelectorAll(".category-tabs a." + cat).forEach(function (a) {
        a.classList.add("active-tab");
      });
    }
  }

  function showAllSections() {
    document.querySelectorAll("h2.section-title").forEach(function (h) {
      h.style.display = "";
      var grid = h.nextElementSibling;
      if (grid && grid.classList.contains("topic-grid")) {
        grid.style.display = "";
      }
    });
  }

  function filterSection(id) {
    var targetHeading = document.getElementById(id);
    if (!targetHeading) return;
    document.querySelectorAll("h2.section-title").forEach(function (h) {
      var show = h.id === id;
      h.style.display = show ? "" : "none";
      var grid = h.nextElementSibling;
      if (grid && grid.classList.contains("topic-grid")) {
        grid.style.display = show ? "" : "none";
      }
    });
  }

  function selectCategory(id) {
    if (currentFilter === id) {
      currentFilter = null;
      showAllSections();
      applyTheme(null);
      history.replaceState(null, "", location.pathname + location.search);
    } else {
      currentFilter = id;
      filterSection(id);
      applyTheme(id);
      history.replaceState(null, "", "#" + id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll('.category-tabs a[href^="#"], nav.site-nav a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      selectCategory(link.getAttribute("href").slice(1));
    });
  });

  var initialId = location.hash ? location.hash.slice(1) : null;
  if (initialId && THEME_MAP[initialId]) {
    currentFilter = initialId;
    filterSection(initialId);
    applyTheme(initialId);
  }
})();
