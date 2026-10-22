/* Übung mit sofortiger Rückmeldung.
   Erwartet pro Frage: <li class="uebung-frage" data-loesung="<Index ab 0>">
   mit mehreren <button class="uebung-option"> und einer <p class="uebung-erklaerung">. */
(function () {
  function init(box) {
    var fragen = box.querySelectorAll('.uebung-frage');
    var stand = box.querySelector('.uebung-stand');
    var gesamt = fragen.length;
    var beantwortet = 0;
    var richtig = 0;

    var texte = {
      de: {
        marke: 'richtig',
        lauf: function (b, g, r) { return b + ' von ' + g + ' beantwortet, ' + r + ' richtig.'; },
        ende: function (g, r) {
          return 'Fertig: ' + r + ' von ' + g + ' richtig.'
            + (r === g ? ' Alles sitzt.' : ' Lies bei den rot markierten Antworten die Erklärung.');
        }
      },
      en: {
        marke: 'correct',
        lauf: function (b, g, r) { return b + ' of ' + g + ' answered, ' + r + ' correct.'; },
        ende: function (g, r) {
          return 'Done: ' + r + ' of ' + g + ' correct.'
            + (r === g ? ' All of them.' : ' Read the explanation under the answers marked in red.');
        }
      },
      es: {
        marke: 'correcta',
        lauf: function (b, g, r) { return b + ' de ' + g + ' respondidas, ' + r + ' correctas.'; },
        ende: function (g, r) {
          return 'Listo: ' + r + ' de ' + g + ' correctas.'
            + (r === g ? ' Todas bien.' : ' Lee la explicación en las respuestas marcadas en rojo.');
        }
      }
    };
    var t = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

    function melde() {
      if (!stand) return;
      stand.textContent = beantwortet < gesamt
        ? t.lauf(beantwortet, gesamt, richtig)
        : t.ende(gesamt, richtig);
    }

    Array.prototype.forEach.call(fragen, function (frage) {
      var loesung = parseInt(frage.getAttribute('data-loesung'), 10);
      var optionen = frage.querySelectorAll('.uebung-option');
      Array.prototype.forEach.call(optionen, function (option, i) {
        option.setAttribute('type', 'button');
        option.addEventListener('click', function () {
          if (frage.classList.contains('beantwortet')) return;
          frage.classList.add('beantwortet');
          beantwortet++;
          if (i === loesung) richtig++;
          Array.prototype.forEach.call(optionen, function (o, j) {
            o.disabled = true;
            if (j === loesung) {
              o.classList.add('richtig');
              o.insertAdjacentHTML('beforeend', '<span class="haken">' + t.marke + '</span>');
            } else if (j === i) {
              o.classList.add('falsch');
            }
          });
          melde();
        });
      });
    });

    melde();
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll('.uebung'), init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
