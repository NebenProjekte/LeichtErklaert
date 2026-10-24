/* Kraftanstiegsrate (RFD) und Explosivkraftindex.
   RFD = Kraftzuwachs geteilt durch die dafür benötigte Zeit.
   Der Index setzt die im Zeitfenster erreichte Kraft ins Verhältnis zur Maximalkraft. */
(function () {
  var box = document.querySelector('[data-rechner="rfd"]');
  if (!box) return;

  var fmax = box.querySelector('[name="fmax"]');
  var fzeit = box.querySelector('[name="fzeit"]');
  var ft = box.querySelector('[name="zeit"]');
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
    var Fmax = zahl(fmax), F = zahl(fzeit), t = zahl(ft);
    if (!isFinite(Fmax) || !isFinite(F) || !isFinite(t) || Fmax <= 0 || F <= 0 || t <= 0) {
      urteil.textContent = 'Bitte alle drei Felder als Zahlen größer als null eintragen.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    if (F > Fmax) {
      urteil.textContent = 'Die Kraft im Zeitfenster kann nicht größer sein als die Maximalkraft.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }

    var rfd = F / (t / 1000);          /* N pro Sekunde */
    var index = F / Fmax * 100;        /* Anteil der Maximalkraft in Prozent */
    var bisMax = Fmax / rfd * 1000;    /* Millisekunden, linear hochgerechnet */

    var text, klasse = 'rechner-urteil';
    if (index >= 60) {
      text = 'Starker Kraftanstieg: nach ' + f(t, 0) + ' ms stehen bereits <strong>' + f(index, 1) +
             ' Prozent</strong> der Maximalkraft zur Verfügung.';
    } else if (index >= 40) {
      text = 'Mittlerer Kraftanstieg: nach ' + f(t, 0) + ' ms sind <strong>' + f(index, 1) +
             ' Prozent</strong> der Maximalkraft abrufbar.';
    } else {
      text = 'Flacher Kraftanstieg: nach ' + f(t, 0) + ' ms sind erst <strong>' + f(index, 1) +
             ' Prozent</strong> der Maximalkraft da — hier liegt das Trainingsziel.';
      klasse = 'rechner-urteil';
    }
    urteil.innerHTML = text;
    urteil.className = klasse;

    werte.innerHTML = [
      ['Kraftanstiegsrate (RFD)', f(rfd, 0) + ' N/s'],
      ['Umgerechnet', f(rfd / 1000, 2) + ' N je Millisekunde'],
      ['Explosivkraftindex', f(index, 1) + ' Prozent der Maximalkraft'],
      ['Rechenweg', f(F, 0) + ' N &divide; ' + f(t / 1000, 3) + ' s = ' + f(rfd, 0) + ' N/s'],
      ['Bei gleichbleibendem Anstieg wäre Fmax erreicht nach', f(bisMax, 0) + ' ms']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fmax.addEventListener('input', rechne);
  fzeit.addEventListener('input', rechne);
  ft.addEventListener('input', rechne);
  rechne();
})();
