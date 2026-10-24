/* pH-Wert, Oxonium- und Hydroxid-Konzentration.
   pH = -log10(c(H3O+)), pOH = 14 - pH bei 25 Grad Celsius. */
(function () {
  var box = document.querySelector('[data-rechner="ph"]');
  if (!box) return;

  var fph = box.querySelector('[name="ph"]');
  var auswahl = box.querySelector('[name="stoff"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  var texte = {
    de: {
      gebiet: 'de-DE',
      fehler: 'Bitte einen pH-Wert zwischen 0 und 14 eintragen.',
      sauer: 'sauer', neutral: 'neutral', basisch: 'basisch',
      satz: function (ph, art) { return 'pH ' + ph + ' ist <strong>' + art + '</strong>.'; },
      mehr: function (f) { return ' Die Lösung enthält ' + f + '-mal so viele Oxonium-Ionen wie reines Wasser.'; },
      weniger: function (f) { return ' Die Lösung enthält ' + f + '-mal weniger Oxonium-Ionen als reines Wasser.'; },
      gleich: ' Oxonium- und Hydroxid-Ionen sind genau gleich häufig.',
      zeilen: ['Oxonium-Ionen c(H₃O⁺)', 'pOH-Wert', 'Hydroxid-Ionen c(OH⁻)', 'Rechenweg', 'Faustregel']
    },
    en: {
      gebiet: 'en-GB',
      fehler: 'Enter a pH value between 0 and 14.',
      sauer: 'acidic', neutral: 'neutral', basisch: 'basic',
      satz: function (ph, art) { return 'pH ' + ph + ' is <strong>' + art + '</strong>.'; },
      mehr: function (f) { return ' The solution holds ' + f + ' times as many oxonium ions as pure water.'; },
      weniger: function (f) { return ' The solution holds ' + f + ' times fewer oxonium ions than pure water.'; },
      gleich: ' Oxonium and hydroxide ions are exactly equally common.',
      zeilen: ['Oxonium ions c(H₃O⁺)', 'pOH value', 'Hydroxide ions c(OH⁻)', 'How it works out', 'Rule of thumb']
    },
    es: {
      gebiet: 'es-ES',
      fehler: 'Introduce un valor de pH entre 0 y 14.',
      sauer: 'ácido', neutral: 'neutro', basisch: 'básico',
      satz: function (ph, art) { return 'Un pH de ' + ph + ' es <strong>' + art + '</strong>.'; },
      mehr: function (f) { return ' La disolución tiene ' + f + ' veces más iones oxonio que el agua pura.'; },
      weniger: function (f) { return ' La disolución tiene ' + f + ' veces menos iones oxonio que el agua pura.'; },
      gleich: ' Los iones oxonio y los hidróxido son exactamente igual de frecuentes.',
      zeilen: ['Iones oxonio c(H₃O⁺)', 'Valor de pOH', 'Iones hidróxido c(OH⁻)', 'Cómo se obtiene', 'Regla práctica']
    }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

  function f(x, stellen) {
    return x.toLocaleString(t_.gebiet, { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  /* Zehnerpotenz lesbar schreiben: 10 hoch minus etwas. */
  function potenz(exp) {
    var e = Math.round(exp * 10) / 10;
    var zahl = (e === Math.round(e) ? f(Math.abs(e), 0) : f(Math.abs(e), 1));
    /* Echtes Minuszeichen, sonst steht da 10-7 statt 10 hoch minus 7. */
    return '10<sup>' + (e < 0 ? '\u2212' : '') + zahl + '</sup> mol/l';
  }

  function rechne() {
    var ph = parseFloat(String(fph.value).replace(',', '.'));
    if (!isFinite(ph) || ph < 0 || ph > 14) {
      urteil.textContent = t_.fehler;
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var poh = 14 - ph;
    var art = ph < 6.95 ? t_.sauer : (ph > 7.05 ? t_.basisch : t_.neutral);

    var zusatz;
    var schritte = 7 - ph;
    if (Math.abs(schritte) < 0.05) zusatz = t_.gleich;
    else {
      var faktor = Math.pow(10, Math.abs(schritte));
      var lesbar = faktor >= 1000 ? f(Math.round(faktor), 0) : f(faktor, faktor < 10 ? 1 : 0);
      zusatz = schritte > 0 ? t_.mehr(lesbar) : t_.weniger(lesbar);
    }

    urteil.innerHTML = t_.satz(f(ph, ph === Math.round(ph) ? 0 : 1), art) + zusatz;
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0], potenz(-ph)],
      [t_.zeilen[1], f(poh, poh === Math.round(poh) ? 0 : 1)],
      [t_.zeilen[2], potenz(-poh)],
      [t_.zeilen[3], 'pH + pOH = 14'],
      [t_.zeilen[4], '1 &rarr; 10 &middot; 2 &rarr; 100 &middot; 3 &rarr; 1000']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  if (auswahl) {
    auswahl.addEventListener('change', function () {
      if (auswahl.value) { fph.value = auswahl.value.replace('.', ','); rechne(); }
    });
  }
  fph.addEventListener('input', rechne);
  rechne();
})();
