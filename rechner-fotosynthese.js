/* Vereinfachtes Modell zum Minimumgesetz: Licht, CO2 und Temperatur werden
   jeweils in einen Wert zwischen 0 und 1 umgerechnet, und der kleinste davon
   bestimmt die Fotosyntheserate. Das ist bewusst ein Lehrmodell, kein Messwert. */
(function () {
  var box = document.querySelector('[data-rechner="fotosynthese"]');
  if (!box) return;

  var fl = box.querySelector('[name="licht"]');
  var fc = box.querySelector('[name="co2"]');
  var ft = box.querySelector('[name="temperatur"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  var texte = {
    de: { gebiet: 'de-DE', fehler: 'Bitte alle drei Felder als Zahlen eintragen.',
      satz: function (p, f) { return 'Rate etwa <strong>' + p + ' Prozent</strong> des Höchstwerts. Begrenzender Faktor: <strong>' + f + '</strong>.'; },
      namen: ['Licht', 'CO₂', 'Temperatur'],
      zeilen: ['Lichtfaktor', 'CO₂-Faktor', 'Temperaturfaktor', 'Fotosyntheserate', 'Was zuerst hilft'],
      kalt: 'zu kalt', heiss: 'zu heiß',
      hinweis: function (f) { return 'mehr ' + f; } },
    en: { gebiet: 'en-GB', fehler: 'Enter a number in all three fields.',
      satz: function (p, f) { return 'Rate about <strong>' + p + ' per cent</strong> of the maximum. Limiting factor: <strong>' + f + '</strong>.'; },
      namen: ['light', 'CO₂', 'temperature'],
      zeilen: ['Light factor', 'CO₂ factor', 'Temperature factor', 'Photosynthesis rate', 'What helps first'],
      kalt: 'too cold', heiss: 'too hot',
      hinweis: function (f) { return 'more ' + f; } },
    es: { gebiet: 'es-ES', fehler: 'Introduce un número en los tres campos.',
      satz: function (p, f) { return 'Tasa de aproximadamente el <strong>' + p + ' por ciento</strong> del máximo. Factor limitante: <strong>' + f + '</strong>.'; },
      namen: ['la luz', 'el CO₂', 'la temperatura'],
      zeilen: ['Factor luz', 'Factor CO₂', 'Factor temperatura', 'Tasa de fotosíntesis', 'Qué ayuda primero'],
      kalt: 'hace demasiado frío', heiss: 'hace demasiado calor',
      hinweis: function (f) { return 'más ' + f; } }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

  function zahl(el) {
    var n = parseFloat(String(el.value).replace(',', '.'));
    return isFinite(n) ? n : NaN;
  }
  function f(x, stellen) {
    return x.toLocaleString(t_.gebiet, { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  /* Temperaturkurve: unter 5 Grad nichts, Bestwert bei 30, ab 45 Grad nichts mehr. */
  function tempFaktor(T) {
    if (T <= 5 || T >= 45) return 0;
    if (T <= 30) return (T - 5) / 25;
    return (45 - T) / 15;
  }

  function rechne() {
    var L = zahl(fl), C = zahl(fc), T = zahl(ft);
    if (!isFinite(L) || !isFinite(C) || !isFinite(T)) {
      urteil.textContent = t_.fehler;
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var fL = Math.max(0, Math.min(1, L / 60));      /* Sättigung ab 60 Prozent Lichtstärke */
    var fC = Math.max(0, Math.min(1, C / 0.10));    /* Sättigung ab 0,10 Prozent CO2 */
    var fT = tempFaktor(T);

    var faktoren = [fL, fC, fT];
    var kleinster = Math.min(fL, fC, fT);
    var i = faktoren.indexOf(kleinster);
    var name = t_.namen[i];
    if (i === 2) name = name + ' (' + (T <= 30 ? t_.kalt : t_.heiss) + ')';

    urteil.innerHTML = t_.satz(f(kleinster * 100, 0), name);
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0], f(fL * 100, 0) + ' %'],
      [t_.zeilen[1], f(fC * 100, 0) + ' %'],
      [t_.zeilen[2], f(fT * 100, 0) + ' %'],
      [t_.zeilen[3], f(kleinster * 100, 0) + ' %'],
      [t_.zeilen[4], t_.hinweis(t_.namen[i])]
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fl.addEventListener('input', rechne);
  fc.addEventListener('input', rechne);
  ft.addEventListener('input', rechne);
  rechne();
})();
