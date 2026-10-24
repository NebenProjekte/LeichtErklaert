/* Herzminutenvolumen: HMV = Schlagvolumen * Herzfrequenz.
   Daraus abgeleitet, wie oft die gesamte Blutmenge pro Minute umläuft. */
(function () {
  var box = document.querySelector('[data-rechner="hmv"]');
  if (!box) return;

  var fsv = box.querySelector('[name="schlagvolumen"]');
  var ffr = box.querySelector('[name="frequenz"]');
  var fbl = box.querySelector('[name="blutmenge"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function zahl(el) {
    var n = parseFloat(String(el.value).replace(',', '.'));
    return isFinite(n) ? n : NaN;
  }
  function f(x, stellen) {
    return x.toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var sv = zahl(fsv), hf = zahl(ffr), bl = zahl(fbl);
    if (!isFinite(sv) || !isFinite(hf) || !isFinite(bl) || sv <= 0 || hf <= 0 || bl <= 0) {
      urteil.textContent = 'Bitte alle drei Felder als Zahlen größer als null eintragen.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    var hmv = sv * hf / 1000;        /* Liter je Minute */
    var umlaeufe = hmv / bl;
    var dauer = 60 / umlaeufe;       /* Sekunden für einen vollständigen Umlauf */

    var einordnung;
    if (hmv < 4.5) einordnung = 'Das liegt unter dem Ruhewert eines Erwachsenen, der normalerweise bei 4,5 bis 5 Litern liegt.';
    else if (hmv <= 7) einordnung = 'Das entspricht einem Ruhewert; normal sind 4,5 bis 5 Liter.';
    else if (hmv <= 15) einordnung = 'Das entspricht mittlerer Belastung.';
    else einordnung = 'Das ist Vollbelastung — Spitzensportler erreichen bis zu 35 Liter.';

    urteil.innerHTML = 'Das Herz wirft <strong>' + f(hmv, 1) + ' Liter pro Minute</strong> aus. ' + einordnung;
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      ['Rechenweg', f(sv, 0) + ' ml &middot; ' + f(hf, 0) + ' /min = ' + f(sv * hf, 0) + ' ml/min'],
      ['Herzminutenvolumen', f(hmv, 2) + ' l/min'],
      ['Umläufe der gesamten Blutmenge', f(umlaeufe, 2) + ' pro Minute'],
      ['Dauer eines vollständigen Umlaufs', f(dauer, 0) + ' Sekunden'],
      ['An einem Tag', f(hmv * 1440, 0) + ' Liter']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fsv.addEventListener('input', rechne);
  ffr.addEventListener('input', rechne);
  fbl.addEventListener('input', rechne);
  rechne();
})();
