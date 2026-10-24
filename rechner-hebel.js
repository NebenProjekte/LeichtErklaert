/* Hebelgesetz: F1 * l1 = F2 * l2.
   Gerechnet wird aus der Masse der Last ueber die Gewichtskraft F2 = m * g. */
(function () {
  var box = document.querySelector('[data-rechner="hebel"]');
  if (!box) return;

  var G = 9.81;
  var fm = box.querySelector('[name="masse"]');
  var fl2 = box.querySelector('[name="lastarm"]');
  var fl1 = box.querySelector('[name="kraftarm"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  var texte = {
    de: { gebiet: 'de-DE',
      fehler: 'Bitte Masse und beide Hebelarme als Zahlen größer als null eintragen.',
      satz: function (f, kg) { return 'Du brauchst <strong>' + f + ' N</strong> — so viel, wie ' + kg + ' kg wiegen.'; },
      zeilen: ['Gewichtskraft der Last', 'Nötige Kraft', 'Kraftverhältnis', 'Moment auf beiden Seiten', 'Weg am langen Ende für 1 cm Hub', 'Rechenweg'],
      ungunst: function (f, kg) { return 'Hier verlierst du Kraft: nötig sind <strong>' + f + ' N</strong>, also das Gewicht von ' + kg + ' kg. Dafür wird die Last schneller bewegt.'; } },
    en: { gebiet: 'en-GB',
      fehler: 'Enter a mass and two lever arms greater than zero.',
      satz: function (f, kg) { return 'You need <strong>' + f + ' N</strong> — the weight of ' + kg + ' kg.'; },
      zeilen: ['Weight of the load', 'Force needed', 'Mechanical advantage', 'Moment on each side', 'Travel at the long end per 1 cm lift', 'How it works out'],
      ungunst: function (f, kg) { return 'This lever costs you force: you need <strong>' + f + ' N</strong>, the weight of ' + kg + ' kg. In exchange the load moves faster.'; } },
    es: { gebiet: 'es-ES',
      fehler: 'Introduce una masa y dos brazos mayores que cero.',
      satz: function (f, kg) { return 'Necesitas <strong>' + f + ' N</strong>, lo que pesan ' + kg + ' kg.'; },
      zeilen: ['Peso de la carga', 'Fuerza necesaria', 'Ventaja mecánica', 'Momento en cada lado', 'Recorrido del extremo largo por cada cm', 'Cómo se obtiene'],
      ungunst: function (f, kg) { return 'Esta palanca te cuesta fuerza: necesitas <strong>' + f + ' N</strong>, lo que pesan ' + kg + ' kg. A cambio, la carga se mueve más rápido.'; } }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

  function zahl(el) {
    var n = parseFloat(String(el.value).replace(',', '.'));
    return isFinite(n) ? n : NaN;
  }
  function f(x, stellen) {
    return x.toLocaleString(t_.gebiet, { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var m = zahl(fm), l2 = zahl(fl2), l1 = zahl(fl1);
    if (!isFinite(m) || !isFinite(l1) || !isFinite(l2) || m <= 0 || l1 <= 0 || l2 <= 0) {
      urteil.textContent = t_.fehler;
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var F2 = m * G;
    var F1 = F2 * l2 / l1;
    var verhaeltnis = l1 / l2;
    var moment = F2 * l2;

    urteil.innerHTML = (verhaeltnis >= 1 ? t_.satz : t_.ungunst)(f(F1, 0), f(F1 / G, 1));
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0], f(F2, 0) + ' N'],
      [t_.zeilen[1], f(F1, 0) + ' N'],
      [t_.zeilen[2], f(verhaeltnis, 2) + ' : 1'],
      [t_.zeilen[3], f(moment, 1) + ' Nm'],
      [t_.zeilen[4], f(verhaeltnis, 2) + ' cm'],
      [t_.zeilen[5], 'F<sub>1</sub> = ' + f(F2, 0) + ' N &middot; ' + f(l2, 2) + ' m &divide; ' + f(l1, 2) + ' m']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fm.addEventListener('input', rechne);
  fl1.addEventListener('input', rechne);
  fl2.addEventListener('input', rechne);
  rechne();
})();
