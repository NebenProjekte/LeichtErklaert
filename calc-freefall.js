/* Free-fall calculator. Ignores air resistance, which the page states explicitly.
   h = 0.5 * g * t^2, v = sqrt(2 * g * h). */
(function () {
  var box = document.querySelector('[data-rechner="freefall"]');
  if (!box) return;

  var G = 9.81;
  var hoehe = box.querySelector('[name="hoehe"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function fmt(x, stellen) {
    return x.toLocaleString('en-GB', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var h = parseFloat(String(hoehe.value).replace(',', '.'));
    if (!isFinite(h) || h <= 0) {
      urteil.textContent = 'Enter a drop height greater than zero.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var t = Math.sqrt(2 * h / G);
    var v = Math.sqrt(2 * G * h);
    urteil.textContent = 'Falling from ' + fmt(h, h >= 10 ? 0 : 1) + ' m takes '
      + fmt(t, 2) + ' s and ends at ' + fmt(v * 3.6, 0) + ' km/h.';
    urteil.className = 'rechner-urteil';
    werte.innerHTML = [
      ['Fall time', fmt(t, 2) + ' s'],
      ['Impact speed', fmt(v, 1) + ' m/s'],
      ['Impact speed', fmt(v * 3.6, 1) + ' km/h'],
      ['Distance in the first second', fmt(0.5 * G * 1 * 1, 1) + ' m'],
      ['Distance in the last second', fmt(h - 0.5 * G * Math.pow(Math.max(t - 1, 0), 2), 1) + ' m']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  hoehe.addEventListener('input', rechne);
  rechne();
})();
