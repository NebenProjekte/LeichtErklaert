/* Rechner zum ohmschen Gesetz und zur elektrischen Leistung.
   Zwei von Spannung, Stromstärke und Widerstand eintragen, der Rest folgt. */
(function () {
  var box = document.querySelector('[data-rechner="ohm"]');
  if (!box) return;

  var texte = {
    de: {
      locale: 'de-DE',
      fehler: 'Bitte nur positive Zahlen eintragen.',
      zuwenig: 'Zwei Felder ausfüllen — das dritte ergibt sich.',
      fertig: function (q) { return 'Berechnet: ' + q + ' und Leistung.'; },
      quelle: { r: 'Widerstand', i: 'Stromstärke', u: 'Spannung' },
      zeilen: ['Spannung U', 'Stromstärke I', 'Widerstand R', 'Leistung P', 'Energie in 1 Stunde']
    },
    en: {
      locale: 'en-GB',
      fehler: 'Please use positive numbers only.',
      zuwenig: 'Fill in any two fields — the third one follows.',
      fertig: function (q) { return 'Calculated ' + q + ' and power.'; },
      quelle: { r: 'resistance', i: 'current', u: 'voltage' },
      zeilen: ['Voltage U', 'Current I', 'Resistance R', 'Power P', 'Energy for 1 hour']
    },
    es: {
      locale: 'es-ES',
      fehler: 'Introduce solo números positivos.',
      zuwenig: 'Rellena dos campos — el tercero se calcula solo.',
      fertig: function (q) { return 'Calculado: ' + q + ' y potencia.'; },
      quelle: { r: 'la resistencia', i: 'la intensidad', u: 'la tensión' },
      zeilen: ['Tensión U', 'Intensidad I', 'Resistencia R', 'Potencia P', 'Energía en 1 hora']
    }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

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
    return x.toLocaleString(t_.locale, { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var u = zahl(feld.u), i = zahl(feld.i), r = zahl(feld.r);
    var gesetzt = [u, i, r].filter(function (x) { return x !== null; });
    if (gesetzt.some(function (x) { return isNaN(x) || x <= 0; })) {
      urteil.textContent = t_.fehler;
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    if (gesetzt.length < 2) {
      urteil.textContent = t_.zuwenig;
      urteil.className = 'rechner-urteil';
      werte.innerHTML = '';
      return;
    }

    var quelle;
    if (u !== null && i !== null) { r = u / i; quelle = t_.quelle.r; }
    else if (u !== null && r !== null) { i = u / r; quelle = t_.quelle.i; }
    else { u = i * r; quelle = t_.quelle.u; }

    var p = u * i;
    urteil.textContent = t_.fertig(quelle);
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0], fmt(u) + ' V'],
      [t_.zeilen[1], fmt(i) + ' A'],
      [t_.zeilen[2], fmt(r) + ' &#8486;'],
      [t_.zeilen[3], fmt(p) + ' W'],
      [t_.zeilen[4], fmt(p / 1000) + ' kWh']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  Object.keys(feld).forEach(function (k) {
    feld[k].addEventListener('input', rechne);
  });
  rechne();
})();
