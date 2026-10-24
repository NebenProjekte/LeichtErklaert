/* Formel eines Salzes aus den Ladungen der beiden Ionen.
   Regel: Die Summe der Ladungen muss null sein. Gesucht ist also das kleinste
   gemeinsame Vielfache der beiden Ladungszahlen; daraus ergeben sich die Anzahlen. */
(function () {
  var box = document.querySelector('[data-rechner="salzformel"]');
  if (!box) return;

  var kat = box.querySelector('[name="kation"]');
  var an = box.querySelector('[name="anion"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  var texte = {
    de: { satz: 'Die Formel lautet ', zeilen: ['Name', 'Ladungsausgleich', 'Anzahl Kationen', 'Anzahl Anionen', 'Rechenweg'],
          kgv: 'kleinstes gemeinsames Vielfaches von ', und: ' und ', zusammen: true },
    en: { satz: 'The formula is ', zeilen: ['Name', 'Charge balance', 'Number of cations', 'Number of anions', 'How it works out'],
          kgv: 'lowest common multiple of ', und: ' and ' },
    es: { satz: 'La fórmula es ', zeilen: ['Nombre', 'Equilibrio de cargas', 'Número de cationes', 'Número de aniones', 'Cómo se obtiene'],
          kgv: 'mínimo común múltiplo de ', und: ' y ', anionZuerst: true }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.en;

  function teile(el) {
    var p = el.value.split('|');
    return { symbol: p[0], ladung: parseInt(p[1], 10), mehratomig: p[2] === '1', name: p[3] };
  }

  function ggt(a, b) { return b === 0 ? a : ggt(b, a % b); }
  function kgv(a, b) { return a * b / ggt(a, b); }

  function schreibe(ion, anzahl) {
    if (anzahl === 1) return ion.symbol;
    if (ion.mehratomig) return '(' + ion.symbol + ')<sub>' + anzahl + '</sub>';
    return ion.symbol + '<sub>' + anzahl + '</sub>';
  }

  function rechne() {
    var k = teile(kat), a = teile(an);
    var v = kgv(k.ladung, a.ladung);
    var nk = v / k.ladung, na = v / a.ladung;
    var formel = schreibe(k, nk) + schreibe(a, na);

    urteil.innerHTML = t_.satz + '<strong>' + formel + '</strong>';
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0], t_.anionZuerst ? (a.name + ' ' + k.name) : (k.name + (t_.zusammen ? '' : ' ') + a.name)],
      [t_.zeilen[1], nk + ' &middot; (+' + k.ladung + ') + ' + na + ' &middot; (&minus;' + a.ladung + ') = 0'],
      [t_.zeilen[2], nk + ' &times; ' + k.symbol + '<sup>' + (k.ladung > 1 ? k.ladung : '') + '+</sup>'],
      [t_.zeilen[3], na + ' &times; ' + a.symbol + '<sup>' + (a.ladung > 1 ? a.ladung : '') + '&minus;</sup>'],
      [t_.zeilen[4], t_.kgv + k.ladung + t_.und + a.ladung + ' = ' + v]
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  kat.addEventListener('change', rechne);
  an.addEventListener('change', rechne);
  rechne();
})();
