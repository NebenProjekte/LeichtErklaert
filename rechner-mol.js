/* Umrechnung zwischen Masse, Stoffmenge und Teilchenzahl.
   n = m / M und N = n * NA mit NA = 6,02214076e23 1/mol (SI, exakt seit 2019). */
(function () {
  var box = document.querySelector('[data-rechner="mol"]');
  if (!box) return;

  var texte = {
    de: {
      locale: 'de-DE',
      fehler: 'Bitte Masse und molare Masse als Zahlen größer als null eintragen.',
      urteil: function (n, N) { return 'Das sind <strong>' + n + ' mol</strong>, also etwa ' + N + ' Teilchen.'; },
      weg: 'Rechenweg', menge: 'Stoffmenge n', zahl: 'Teilchenzahl N',
      einzel: 'Masse eines Teilchens', zurueck: 'Umgekehrt: Masse für 1 mol'
    },
    en: {
      locale: 'en-GB',
      fehler: 'Please enter the mass and the molar mass as numbers greater than zero.',
      urteil: function (n, N) { return 'That is <strong>' + n + ' mol</strong>, so roughly ' + N + ' particles.'; },
      weg: 'Calculation', menge: 'Amount of substance n', zahl: 'Number of particles N',
      einzel: 'Mass of one particle', zurueck: 'The other way round: mass of 1 mol'
    },
    es: {
      locale: 'es-ES',
      fehler: 'Introduce la masa y la masa molar como números mayores que cero.',
      urteil: function (n, N) { return 'Son <strong>' + n + ' mol</strong>, es decir, unas ' + N + ' partículas.'; },
      weg: 'Cálculo', menge: 'Cantidad de sustancia n', zahl: 'Número de partículas N',
      einzel: 'Masa de una partícula', zurueck: 'Al revés: masa de 1 mol'
    }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

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
    return x.toLocaleString(t_.locale, { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function wissenschaftlich(x) {
    if (x === 0) return '0';
    var e = Math.floor(Math.log10(Math.abs(x)));
    var m = x / Math.pow(10, e);
    return f(m, 3) + ' &middot; 10<sup>' + String(e).replace('-', '\u2212') + '</sup>';
  }

  function rechne() {
    var m = zahl(fm), M = zahl(fM);
    if (!isFinite(m) || !isFinite(M) || m <= 0 || M <= 0) {
      urteil.textContent = t_.fehler;
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var n = m / M;
    var N = n * NA;
    urteil.innerHTML = t_.urteil(f(n, 4), wissenschaftlich(N));
    urteil.className = 'rechner-urteil';
    werte.innerHTML = [
      [t_.weg, 'n = m &divide; M = ' + f(m, 2) + ' g &divide; ' + f(M, 2) + ' g/mol'],
      [t_.menge, f(n, 4) + ' mol'],
      [t_.zahl, wissenschaftlich(N)],
      [t_.einzel, wissenschaftlich(M / NA) + ' g'],
      [t_.zurueck, f(M, 2) + ' g']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  if (auswahl) {
    auswahl.addEventListener('change', function () {
      if (auswahl.value) {
        fM.value = (t_.locale === 'en-GB') ? auswahl.value : auswahl.value.replace('.', ',');
        rechne();
      }
    });
  }
  fm.addEventListener('input', rechne);
  fM.addEventListener('input', rechne);
  rechne();
})();
