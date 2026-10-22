/* Strahlensatz: drei Strecken eintragen, die vierte wird ergänzt.
   Grundlage ist die Verhältnisgleichung ZA : ZB = ZC : ZD. */
(function () {
  var box = document.querySelector('[data-rechner="strahlensatz"]');
  if (!box) return;

  var namen = ['za', 'zb', 'zc', 'zd'];
  var feld = {};
  namen.forEach(function (n) { feld[n] = box.querySelector('[name="' + n + '"]'); });
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function zahl(el) {
    var v = String(el.value).trim().replace(',', '.');
    if (v === '') return null;
    var n = parseFloat(v);
    return isFinite(n) ? n : NaN;
  }

  function f(x) {
    return x.toLocaleString('de-DE', { maximumFractionDigits: 3 });
  }

  function rechne() {
    var w = {};
    namen.forEach(function (n) { w[n] = zahl(feld[n]); });
    var gesetzt = namen.filter(function (n) { return w[n] !== null; });

    if (gesetzt.some(function (n) { return isNaN(w[n]) || w[n] <= 0; })) {
      urteil.textContent = 'Bitte nur positive Zahlen eintragen.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    if (gesetzt.length !== 3) {
      urteil.textContent = 'Genau drei Strecken eintragen — die vierte rechne ich aus.';
      urteil.className = 'rechner-urteil';
      werte.innerHTML = '';
      return;
    }

    var fehlt = namen.filter(function (n) { return w[n] === null; })[0];
    // ZA : ZB = ZC : ZD  ->  ZA * ZD = ZB * ZC
    if (fehlt === 'za') w.za = w.zb * w.zc / w.zd;
    else if (fehlt === 'zb') w.zb = w.za * w.zd / w.zc;
    else if (fehlt === 'zc') w.zc = w.za * w.zd / w.zb;
    else w.zd = w.zb * w.zc / w.za;

    var k = w.zb / w.za;
    var label = { za: 'ZA', zb: 'ZB', zc: 'ZC', zd: 'ZD' }[fehlt];
    urteil.textContent = label + ' = ' + f(w[fehlt]);
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      ['Verhältnisgleichung', 'ZA : ZB = ZC : ZD'],
      ['Eingesetzt', f(w.za) + ' : ' + f(w.zb) + ' = ' + f(w.zc) + ' : ' + f(w.zd)],
      ['Streckfaktor ZB &divide; ZA', f(k)],
      ['Probe über das Kreuzprodukt', f(w.za * w.zd) + ' = ' + f(w.zb * w.zc)]
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  namen.forEach(function (n) { feld[n].addEventListener('input', rechne); });
  rechne();
})();
