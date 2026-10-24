/* Rechner zum freien Fall. Luftwiderstand bleibt unberücksichtigt, die Seite sagt das dazu.
   h = 0,5 * g * t^2 und v = Wurzel(2 * g * h). */
(function () {
  var box = document.querySelector('[data-rechner="freefall"]');
  if (!box) return;

  var G = 9.81;
  var hoehe = box.querySelector('[name="hoehe"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  var texte = {
    de: {
      gebiet: 'de-DE',
      fehler: 'Bitte eine Fallhöhe größer als null eintragen.',
      satz: function (h, t, v) { return 'Aus ' + h + ' m dauert der Fall ' + t + ' s und endet bei ' + v + ' km/h.'; },
      zeilen: ['Fallzeit', 'Aufprallgeschwindigkeit', 'Aufprallgeschwindigkeit', 'Strecke in der ersten Sekunde', 'Strecke in der letzten Sekunde']
    },
    en: {
      gebiet: 'en-GB',
      fehler: 'Enter a drop height greater than zero.',
      satz: function (h, t, v) { return 'Falling from ' + h + ' m takes ' + t + ' s and ends at ' + v + ' km/h.'; },
      zeilen: ['Fall time', 'Impact speed', 'Impact speed', 'Distance in the first second', 'Distance in the last second']
    },
    es: {
      gebiet: 'es-ES',
      fehler: 'Introduce una altura de caída mayor que cero.',
      satz: function (h, t, v) { return 'Desde ' + h + ' m la caída dura ' + t + ' s y termina a ' + v + ' km/h.'; },
      zeilen: ['Tiempo de caída', 'Velocidad de impacto', 'Velocidad de impacto', 'Distancia en el primer segundo', 'Distancia en el último segundo']
    }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

  function fmt(x, stellen) {
    return x.toLocaleString(t_.gebiet, { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var h = parseFloat(String(hoehe.value).replace(',', '.'));
    if (!isFinite(h) || h <= 0) {
      urteil.textContent = t_.fehler;
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var t = Math.sqrt(2 * h / G);
    var v = Math.sqrt(2 * G * h);
    urteil.textContent = t_.satz(fmt(h, h >= 10 ? 0 : 1), fmt(t, 2), fmt(v * 3.6, 0));
    urteil.className = 'rechner-urteil';
    werte.innerHTML = [
      [t_.zeilen[0], fmt(t, 2) + ' s'],
      [t_.zeilen[1], fmt(v, 1) + ' m/s'],
      [t_.zeilen[2], fmt(v * 3.6, 1) + ' km/h'],
      [t_.zeilen[3], fmt(0.5 * G * 1 * 1, 1) + ' m'],
      [t_.zeilen[4], fmt(h - 0.5 * G * Math.pow(Math.max(t - 1, 0), 2), 1) + ' m']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  hoehe.addEventListener('input', rechne);
  rechne();
})();
