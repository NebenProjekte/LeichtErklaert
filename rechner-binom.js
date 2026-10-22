/* Binomische Formeln mit konkreten Zahlen durchrechnen.
   Zeigt alle drei Formeln Schritt für Schritt mit den eingegebenen a und b. */
(function () {
  var box = document.querySelector('[data-rechner="binom"]');
  if (!box) return;

  var fa = box.querySelector('[name="a"]');
  var fb = box.querySelector('[name="b"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function zahl(el) {
    var n = parseFloat(String(el.value).replace(',', '.'));
    return isFinite(n) ? n : NaN;
  }

  function f(x) {
    return x.toLocaleString('de-DE', { maximumFractionDigits: 4 });
  }

  function rechne() {
    var a = zahl(fa), b = zahl(fb);
    if (!isFinite(a) || !isFinite(b)) {
      urteil.textContent = 'Bitte für a und b je eine Zahl eintragen.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    urteil.textContent = 'Mit a = ' + f(a) + ' und b = ' + f(b) + ':';
    urteil.className = 'rechner-urteil';

    var zeilen = [
      ['1. Formel: (a + b)²',
       '(' + f(a) + ' + ' + f(b) + ')² = ' + f(a * a) + ' + 2 &middot; ' + f(a) + ' &middot; ' + f(b)
       + ' + ' + f(b * b) + ' = <strong>' + f((a + b) * (a + b)) + '</strong>'],
      ['2. Formel: (a &minus; b)²',
       '(' + f(a) + ' &minus; ' + f(b) + ')² = ' + f(a * a) + ' &minus; 2 &middot; ' + f(a) + ' &middot; ' + f(b)
       + ' + ' + f(b * b) + ' = <strong>' + f((a - b) * (a - b)) + '</strong>'],
      ['3. Formel: (a + b)(a &minus; b)',
       '(' + f(a) + ' + ' + f(b) + ')(' + f(a) + ' &minus; ' + f(b) + ') = ' + f(a * a) + ' &minus; ' + f(b * b)
       + ' = <strong>' + f(a * a - b * b) + '</strong>'],
      ['Mittleres Glied allein', '2 &middot; a &middot; b = ' + f(2 * a * b)],
      ['Kopfrechenprobe', f(a) + '² &minus; ' + f(b) + '² = ' + f(a * a - b * b)
       + ', das ist dasselbe wie (' + f(a) + '+' + f(b) + ') &middot; (' + f(a) + '&minus;' + f(b) + ')']
    ];
    werte.innerHTML = zeilen.map(function (z) {
      return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>';
    }).join('');
  }

  fa.addEventListener('input', rechne);
  fb.addEventListener('input', rechne);
  rechne();
})();
