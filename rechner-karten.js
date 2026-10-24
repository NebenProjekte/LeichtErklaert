/* Fakultät, Variationen und Kombinationen für ein Kartenblatt.
   Gerechnet wird über Zehnerlogarithmen, damit auch 52! ohne Überlauf
   darstellbar bleibt: log10(n!) = log10(1) + log10(2) + ... + log10(n). */
(function () {
  var box = document.querySelector('[data-rechner="karten"]');
  if (!box) return;

  var fn = box.querySelector('[name="karten"]');
  var fk = box.querySelector('[name="gezogen"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function ganz(el) {
    var n = parseInt(String(el.value).replace(',', '.'), 10);
    return isFinite(n) ? n : NaN;
  }

  function logFak(n) {
    var s = 0;
    for (var i = 2; i <= n; i++) s += Math.log(i) / Math.LN10;
    return s;
  }

  /* Aus dem Zehnerlogarithmus eine lesbare Zahl machen: kleine Werte
     ausgeschrieben mit Tausenderpunkten, große in Zehnerpotenzschreibweise. */
  function ausLog(L) {
    if (L < 15) {
      var exakt = Math.round(Math.pow(10, L));
      return exakt.toLocaleString('de-DE');
    }
    var e = Math.floor(L);
    var m = Math.pow(10, L - e);
    return m.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
           ' &middot; 10<sup>' + e + '</sup>';
  }

  function stellen(L) {
    return Math.floor(L) + 1;
  }

  function rechne() {
    var n = ganz(fn), k = ganz(fk);
    if (!isFinite(n) || n < 1 || n > 60) {
      urteil.textContent = 'Bitte für die Kartenzahl eine ganze Zahl zwischen 1 und 60 eintragen.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    if (!isFinite(k) || k < 1 || k > n) {
      urteil.textContent = 'Bitte für die gezogenen Karten eine ganze Zahl zwischen 1 und ' + n + ' eintragen.';
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }

    var Ln = logFak(n);
    var Lrest = logFak(n - k);
    var Lvar = Ln - Lrest;                 /* geordnet, ohne Zurücklegen */
    var Lkomb = Lvar - logFak(k);          /* ungeordnet */

    urteil.innerHTML = 'Ein Stapel aus <strong>' + n + ' Karten</strong> lässt sich auf <strong>' +
      ausLog(Ln) + '</strong> Arten anordnen — eine Zahl mit ' + stellen(Ln) + ' Stellen.';
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      ['Reihenfolgen des ganzen Stapels (n!)', ausLog(Ln)],
      ['Mit Reihenfolge: ' + k + ' aus ' + n + ' ziehen', ausLog(Lvar)],
      ['Ohne Reihenfolge: mögliche Blätter', ausLog(Lkomb)],
      ['Chance auf ein bestimmtes Blatt', '1 zu ' + ausLog(Lkomb)],
      ['Rechenweg', 'n! &divide; (n &minus; k)! &divide; k! = ' + n + '! &divide; ' + (n - k) + '! &divide; ' + k + '!']
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fn.addEventListener('input', rechne);
  fk.addEventListener('input', rechne);
  rechne();
})();
