/* Calculator for Ohm's law and electrical power.
   Enter any two of voltage, current and resistance; the rest follows. */
(function () {
  var box = document.querySelector('[data-rechner="ohm"]');
  if (!box) return;

  var feld = {
    u: box.querySelector('[name="spannung"]'),
    i: box.querySelector('[name="strom"]'),
    r: box.querySelector('[name="widerstand"]')
  };
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function zahl(el) {
    var v = String(el.value).trim().replace(',', '.');
    if (v === '') return null;
    var n = parseFloat(v);
    return isFinite(n) ? n : NaN;
  }

  function fmt(x) {
    if (!isFinite(x)) return '—';
    var stellen = Math.abs(x) >= 100 ? 0 : (Math.abs(x) >= 1 ? 2 : 3);
    return x.toLocaleString('en-GB', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var u = zahl(feld.u), i = zahl(feld.i), r = zahl(feld.r);
    var gesetzt = [u, i, r].filter(function (x) { return x !== null; });
    if (gesetzt.some(function (x) { return isNaN(x) || x <= 0; })) {
      urteil.textContent = 'Please use positive numbers only.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    if (gesetzt.length < 2) {
      urteil.textContent = 'Fill in any two fields — the third one follows.';
      urteil.className = 'rechner-urteil';
      werte.innerHTML = '';
      return;
    }

    var quelle;
    if (u !== null && i !== null) { r = u / i; quelle = 'resistance'; }
    else if (u !== null && r !== null) { i = u / r; quelle = 'current'; }
    else { u = i * r; quelle = 'voltage'; }

    var p = u * i;
    urteil.textContent = 'Calculated ' + quelle + ' and power.';
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      ['Voltage U', fmt(u) + ' V'],
      ['Current I', fmt(i) + ' A'],
      ['Resistance R', fmt(r) + ' &#8486;'],
      ['Power P', fmt(p) + ' W'],
      ['Energy for 1 hour', fmt(p / 1000) + ' kWh']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  Object.keys(feld).forEach(function (k) {
    feld[k].addEventListener('input', rechne);
  });
  rechne();
})();
