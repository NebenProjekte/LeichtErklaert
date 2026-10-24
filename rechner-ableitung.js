/* Ableitung eines Polynoms, dazu Steigung und Tangente an einer Stelle.
   Gerechnet wird mit der Potenzregel: a*x^n wird zu a*n*x^(n-1). */
(function () {
  var box = document.querySelector('[data-rechner="ableitung"]');
  if (!box) return;

  var ff = box.querySelector('[name="funktion"]');
  var fx = box.querySelector('[name="stelle"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function f(x, stellen) {
    var g = Math.round(x * 1e6) / 1e6;
    /* Echtes Minuszeichen statt Bindestrich, passend zum Rest der Seite. */
    return g.toLocaleString('de-DE', { maximumFractionDigits: stellen }).replace('-', '\u2212');
  }

  /* Text zu einem Feld von Koeffizienten: Index ist der Exponent. */
  function lies(text) {
    var t = String(text)
      .replace(/\s+/g, '')
      .replace(/²/g, '^2').replace(/³/g, '^3')
      .replace(/⁴/g, '^4').replace(/⁵/g, '^5')
      .replace(/[−–—]/g, '-')
      .replace(/,/g, '.')
      .replace(/\*/g, '')
      .toLowerCase();
    if (!t) return null;
    var teile = t.match(/[+-]?[^+-]+/g);
    if (!teile) return null;
    var koef = [];
    for (var i = 0; i < teile.length; i++) {
      var m = teile[i].match(/^([+-]?)(\d*\.?\d*)(x(?:\^(\d+))?)?$/);
      if (!m) return null;
      if (!m[2] && !m[3]) return null;
      var vz = m[1] === '-' ? -1 : 1;
      var a = m[2] === '' ? 1 : parseFloat(m[2]);
      if (!isFinite(a)) return null;
      var n = m[3] ? (m[4] ? parseInt(m[4], 10) : 1) : 0;
      if (n > 12) return null;
      koef[n] = (koef[n] || 0) + vz * a;
    }
    for (var k = 0; k < koef.length; k++) if (!koef[k]) koef[k] = koef[k] || 0;
    return koef;
  }

  function ableiten(koef) {
    var neu = [];
    for (var n = 1; n < koef.length; n++) neu[n - 1] = koef[n] * n;
    if (!neu.length) neu = [0];
    for (var k = 0; k < neu.length; k++) neu[k] = neu[k] || 0;
    return neu;
  }

  function wert(koef, x) {
    var s = 0;
    for (var n = 0; n < koef.length; n++) s += (koef[n] || 0) * Math.pow(x, n);
    return s;
  }

  var hoch = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };

  function schreibe(koef) {
    var aus = '';
    for (var n = koef.length - 1; n >= 0; n--) {
      var a = koef[n] || 0;
      if (!a) continue;
      var vz = a < 0 ? ' − ' : ' + ';
      var b = Math.abs(a);
      var zahl = (b === 1 && n > 0) ? '' : f(b, 4);
      var teil = n === 0 ? zahl : (n === 1 ? zahl + 'x' : zahl + 'x' + (hoch[n] || '^' + n));
      aus += (aus === '' ? (a < 0 ? '−' : '') : vz) + teil;
    }
    return aus === '' ? '0' : aus;
  }

  function rechne() {
    var koef = lies(ff.value);
    var x0 = parseFloat(String(fx.value).replace(',', '.'));
    if (!koef) {
      urteil.textContent = 'Das kann ich nicht lesen. Erlaubt sind Polynome wie 3x^2 - 5x + 7 oder x³ - 6x² + 9x.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    if (!isFinite(x0)) {
      urteil.textContent = 'Bitte eine Zahl als Stelle eintragen.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var k1 = ableiten(koef), k2 = ableiten(k1);
    var m = wert(k1, x0), y0 = wert(koef, x0);
    var b = y0 - m * x0;

    var lage = m > 0 ? 'steigt dort' : (m < 0 ? 'fällt dort' : 'verläuft dort waagerecht');
    urteil.innerHTML = 'f′(x) = <strong>' + schreibe(k1) + '</strong> — an der Stelle x = ' +
      f(x0, 4) + ' ist die Steigung ' + f(m, 4) + ', der Graph ' + lage + '.';
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      ['Funktion', 'f(x) = ' + schreibe(koef)],
      ['Erste Ableitung', 'f′(x) = ' + schreibe(k1)],
      ['Zweite Ableitung', 'f″(x) = ' + schreibe(k2)],
      ['Punkt auf dem Graphen', 'f(' + f(x0, 4) + ') = ' + f(y0, 4)],
      ['Steigung dort', 'f′(' + f(x0, 4) + ') = ' + f(m, 4)],
      ['Tangente', 'y = ' + schreibe([b, m])]
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  ff.addEventListener('input', rechne);
  fx.addEventListener('input', rechne);
  rechne();
})();
