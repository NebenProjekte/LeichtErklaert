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

    function melde() {
      if (!stand) return;
      if (beantwortet < gesamt) {
        stand.textContent = beantwortet + ' von ' + gesamt + ' beantwortet, ' + richtig + ' richtig.';
      } else {
        stand.textContent = 'Fertig: ' + richtig + ' von ' + gesamt + ' richtig.'
          + (richtig === gesamt ? ' Alles sitzt.' : ' Lies bei den rot markierten Antworten die Erklärung.');
      }
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
              o.insertAdjacentHTML('beforeend', '<span class="haken">richtig</span>');
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
