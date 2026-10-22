/* Rechner: schwimmt, schwebt oder sinkt ein Körper?
   Grundlage: Auftriebskraft F_A = rho_fluessigkeit * V * g (Prinzip des Archimedes). */
(function () {
  var box = document.querySelector('[data-rechner="auftrieb"]');
  if (!box) return;

  var G = 9.81;
  var T = {
    de: {
      fehler: 'Bitte überall eine Zahl größer als null eintragen.',
      schwebt: 'Der Körper schwebt — er steigt nicht und sinkt nicht.',
      schwimmt: function (p) { return 'Der Körper schwimmt. ' + p + ' % seines Volumens liegen unter Wasser.'; },
      sinkt: 'Der Körper sinkt.',
      masse: 'Masse', gewicht: 'Gewichtskraft', auftrieb: 'Auftrieb bei vollem Eintauchen',
      verdraengt: 'Verdrängtes Volumen im Schwimmen', rest: 'Restkraft nach unten',
      ort: 'de-DE'
    },
    en: {
      fehler: 'Please enter a number greater than zero in every field.',
      schwebt: 'The object hovers — it neither rises nor sinks.',
      schwimmt: function (p) { return 'The object floats. ' + p + ' % of its volume sits below the surface.'; },
      sinkt: 'The object sinks.',
      masse: 'Mass', gewicht: 'Weight', auftrieb: 'Buoyancy when fully submerged',
      verdraengt: 'Volume displaced while floating', rest: 'Net downward force',
      ort: 'en-GB'
    },
    es: {
      fehler: 'Introduce un número mayor que cero en cada campo.',
      schwebt: 'El cuerpo queda suspendido: ni sube ni se hunde.',
      schwimmt: function (p) { return 'El cuerpo flota. El ' + p + ' % de su volumen queda bajo el agua.'; },
      sinkt: 'El cuerpo se hunde.',
      masse: 'Masa', gewicht: 'Peso', auftrieb: 'Empuje con el cuerpo totalmente sumergido',
      verdraengt: 'Volumen desplazado al flotar', rest: 'Fuerza neta hacia abajo',
      ort: 'es-ES'
    }
  };
  var t = T[box.getAttribute('data-sprache') || document.documentElement.lang] || T.de;

  var felder = {
    koerper: box.querySelector('[name="dichte-koerper"]'),
    fluid: box.querySelector('[name="dichte-fluid"]'),
    volumen: box.querySelector('[name="volumen"]')
  };
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function zahl(el) {
    return parseFloat(String(el.value).replace(',', '.'));
  }

  function fmt(x, stellen) {
    return x.toLocaleString(t.ort, { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var rk = zahl(felder.koerper), rf = zahl(felder.fluid), v = zahl(felder.volumen);
    if (!isFinite(rk) || !isFinite(rf) || !isFinite(v) || rk <= 0 || rf <= 0 || v <= 0) {
      urteil.textContent = t.fehler;
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var vM3 = v * 1e-6;                 // cm³ in m³
    var masse = rk * 1000 * vM3;        // kg
    var gewicht = masse * G;            // N
    var auftriebVoll = rf * 1000 * vM3 * G; // N bei vollständigem Eintauchen

    var text, anteil = null;
    if (Math.abs(rk - rf) < 1e-9) {
      text = t.schwebt;
    } else if (rk < rf) {
      anteil = rk / rf;
      text = t.schwimmt(fmt(anteil * 100, 1));
    } else {
      text = t.sinkt;
    }
    urteil.textContent = text;
    urteil.className = 'rechner-urteil';

    var zeilen = [
      [t.masse, fmt(masse, 3) + ' kg'],
      [t.gewicht, fmt(gewicht, 2) + ' N'],
      [t.auftrieb, fmt(auftriebVoll, 2) + ' N']
    ];
    if (anteil !== null) {
      zeilen.push([t.verdraengt, fmt(v * anteil, 0) + ' cm³']);
    } else if (rk > rf) {
      zeilen.push([t.rest, fmt(gewicht - auftriebVoll, 2) + ' N']);
    }
    werte.innerHTML = zeilen.map(function (z) {
      return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>';
    }).join('');
  }

  Object.keys(felder).forEach(function (k) {
    felder[k].addEventListener('input', rechne);
    felder[k].addEventListener('change', rechne);
  });
  rechne();
})();
