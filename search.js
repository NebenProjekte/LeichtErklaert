(function () {
  function getBasePrefix() {
    var p = window.location.pathname;
    if (p.indexOf("/mathematik/") !== -1 || p.indexOf("/physik/") !== -1) {
      return "../";
    }
    return "";
  }

  function init() {
    var input = document.getElementById("le-search-input");
    var results = document.getElementById("le-search-results");
    if (!input || !results || typeof LE_TOPICS === "undefined") return;
    var base = getBasePrefix();

    function render(query) {
      var q = query.trim().toLowerCase();
      if (!q) {
        results.classList.remove("open");
        results.innerHTML = "";
        return;
      }
      var matches = LE_TOPICS.filter(function (t) {
        return (
          t.title.toLowerCase().indexOf(q) !== -1 ||
          (t.keywords || "").toLowerCase().indexOf(q) !== -1
        );
      }).slice(0, 8);

      if (matches.length === 0) {
        results.innerHTML = '<div class="no-results">Keine Treffer - weitere Themen folgen bald.</div>';
      } else {
        results.innerHTML = matches
          .map(function (t) {
            return (
              '<a href="' + base + t.path + '">' +
              '<span class="cat">' + t.cat + "</span>" +
              t.title +
              "</a>"
            );
          })
          .join("");
      }
      results.classList.add("open");
    }

    input.addEventListener("input", function () {
      render(input.value);
    });
    input.addEventListener("focus", function () {
      if (input.value) render(input.value);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = results.querySelector("a");
        if (first) {
          window.location.href = first.getAttribute("href");
        }
      }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".site-search")) {
        results.classList.remove("open");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
