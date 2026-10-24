/* Elektronegativitaetsdifferenz und die daraus folgende Bindungsart.
   EN-Werte nach Pauling. Die Grenzen 0,4 und 1,7 sind Schulkonvention und
   keine Naturkonstanten - der Uebergang ist in Wirklichkeit fliessend. */
(function () {
  var box = document.querySelector('[data-rechner="en"]');
  if (!box) return;

  var fa = box.querySelector('[name="elementa"]');
  var fb = box.querySelector('[name="elementb"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  function teile(el) {
    var p = el.value.split('|');
    return { name: p[0], en: parseFloat(p[1]), metall: p[2] === '1' };
  }
  function f(x, stellen) {
    return x.toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var a = teile(fa), b = teile(fb);
    var d = Math.abs(a.en - b.en);

    var art, erklaerung;
    if (a.metall && b.metall) {
      art = 'Metallbindung';
      erklaerung = 'Zwei Metalle: Beide geben ab, niemand nimmt auf. Die Atomrümpfe stecken in einem gemeinsamen Elektronengas.';
    } else if (d < 0.4) {
      art = 'unpolare Elektronenpaarbindung';
      erklaerung = 'Beide ziehen fast gleich stark, das gemeinsame Elektronenpaar liegt in der Mitte.';
    } else if (d < 1.7) {
      art = 'polare Elektronenpaarbindung';
      erklaerung = 'Das Elektronenpaar verschiebt sich zum stärkeren Partner, ganz hinüber wandert es aber nicht. Es entstehen eine leicht negative und eine leicht positive Seite.';
    } else {
      art = 'Ionenbindung';
      erklaerung = 'Der Unterschied ist so groß, dass das Elektron vollständig übergeht. Aus den Atomen werden Ionen, die sich elektrisch anziehen.';
    }

    urteil.innerHTML = 'Erwartete Bindungsart: <strong>' + art + '</strong>';
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      ['EN ' + a.name, f(a.en, 2)],
      ['EN ' + b.name, f(b.en, 2)],
      ['Differenz &Delta;EN', f(d, 2)],
      ['Einordnung', 'unter 0,4 unpolar &middot; 0,4 bis 1,7 polar &middot; über 1,7 ionisch'],
      ['Warum', erklaerung]
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fa.addEventListener('change', rechne);
  fb.addEventListener('change', rechne);
  rechne();
})();
