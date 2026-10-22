/* Rechner: schwimmt, schwebt oder sinkt ein Körper?
   Grundlage: Auftriebskraft F_A = rho_fluessigkeit * V * g (Prinzip des Archimedes). */
(function () {
  var box = document.querySelector('[data-rechner="auftrieb"]');
  if (!box) return;

  var G = 9.81;
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
    return x.toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var rk = zahl(felder.koerper), rf = zahl(felder.fluid), v = zahl(felder.volumen);
    if (!isFinite(rk) || !isFinite(rf) || !isFinite(v) || rk <= 0 || rf <= 0 || v <= 0) {
      urteil.textContent = 'Bitte überall eine Zahl größer als null eintragen.';
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
      text = 'Der Körper schwebt — er steigt nicht und sinkt nicht.';
    } else if (rk < rf) {
      anteil = rk / rf;
      text = 'Der Körper schwimmt. ' + fmt(anteil * 100, 1) + ' % seines Volumens liegen unter Wasser.';
    } else {
      text = 'Der Körper sinkt.';
    }
    urteil.textContent = text;
    urteil.className = 'rechner-urteil';

    var zeilen = [
      ['Masse', fmt(masse, 3) + ' kg'],
      ['Gewichtskraft', fmt(gewicht, 2) + ' N'],
      ['Auftrieb bei vollem Eintauchen', fmt(auftriebVoll, 2) + ' N']
    ];
    if (anteil !== null) {
      zeilen.push(['Verdrängtes Volumen im Schwimmen', fmt(v * anteil, 0) + ' cm³']);
    } else if (rk > rf) {
      zeilen.push(['Restkraft nach unten', fmt(gewicht - auftriebVoll, 2) + ' N']);
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
