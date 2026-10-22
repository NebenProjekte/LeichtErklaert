/* Umrechnung zwischen Masse, Stoffmenge und Teilchenzahl.
   n = m / M und N = n * NA mit NA = 6,02214076e23 1/mol (SI, exakt seit 2019). */
(function () {
  var box = document.querySelector('[data-rechner="mol"]');
  if (!box) return;

  var NA = 6.02214076e23;
  var fm = box.querySelector('[name="masse"]');
  var fM = box.querySelector('[name="molmasse"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');
  var auswahl = box.querySelector('[name="stoff"]');

  function zahl(el) {
    var n = parseFloat(String(el.value).replace(',', '.'));
    return isFinite(n) ? n : NaN;
  }

  function f(x, stellen) {
    return x.toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function wissenschaftlich(x) {
    if (x === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(x)));
    var m = x / Math.pow(10, e);
    return f(m, 3) + ' &middot; 10<sup>' + e + '</sup>';
  }

  function rechne() {
    var m = zahl(fm), M = zahl(fM);
    if (!isFinite(m) || !isFinite(M) || m <= 0 || M <= 0) {
      urteil.textContent = 'Bitte Masse und molare Masse als Zahlen größer als null eintragen.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var n = m / M;
    var N = n * NA;
    urteil.innerHTML = 'Das sind <strong>' + f(n, 4) + ' mol</strong>, also etwa ' + wissenschaftlich(N) + ' Teilchen.';
    urteil.className = 'rechner-urteil';
    werte.innerHTML = [
      ['Rechenweg', 'n = m &divide; M = ' + f(m, 2) + ' g &divide; ' + f(M, 2) + ' g/mol'],
      ['Stoffmenge n', f(n, 4) + ' mol'],
      ['Teilchenzahl N', wissenschaftlich(N)],
      ['Masse eines Teilchens', wissenschaftlich(M / NA) + ' g'],
      ['Umgekehrt: Masse für 1 mol', f(M, 2) + ' g']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  if (auswahl) {
    auswahl.addEventListener('change', function () {
      if (auswahl.value) { fM.value = auswahl.value.replace('.', ','); rechne(); }
    });
  }
  fm.addEventListener('input', rechne);
  fM.addEventListener('input', rechne);
  rechne();
})();
