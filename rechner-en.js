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

  var texte = {
    de: {
      gebiet: 'de-DE',
      satz: 'Erwartete Bindungsart: ',
      zeilen: ['EN ', 'Differenz &Delta;EN', 'Einordnung', 'Warum'],
      skala: 'unter 0,4 unpolar &middot; 0,4 bis 1,7 polar &middot; über 1,7 ionisch',
      arten: ['Metallbindung', 'unpolare Elektronenpaarbindung', 'polare Elektronenpaarbindung', 'Ionenbindung'],
      warum: [
        'Zwei Metalle: Beide geben ab, niemand nimmt auf. Die Atomrümpfe stecken in einem gemeinsamen Elektronengas.',
        'Beide ziehen fast gleich stark, das gemeinsame Elektronenpaar liegt in der Mitte.',
        'Das Elektronenpaar verschiebt sich zum stärkeren Partner, ganz hinüber wandert es aber nicht. Es entstehen eine leicht negative und eine leicht positive Seite.',
        'Der Unterschied ist so groß, dass das Elektron vollständig übergeht. Aus den Atomen werden Ionen, die sich elektrisch anziehen.'
      ]
    },
    en: {
      gebiet: 'en-GB',
      satz: 'Expected type of bond: ',
      zeilen: ['EN ', 'Difference &Delta;EN', 'Scale', 'Why'],
      skala: 'below 0.4 non-polar &middot; 0.4 to 1.7 polar &middot; above 1.7 ionic',
      arten: ['metallic bond', 'non-polar covalent bond', 'polar covalent bond', 'ionic bond'],
      warum: [
        'Two metals: both want to give electrons away and neither takes any on. The positive cores sit in a shared sea of electrons.',
        'Both pull almost equally hard, so the shared pair sits in the middle.',
        'The shared pair shifts towards the stronger partner without moving across completely. One side becomes slightly negative, the other slightly positive.',
        'The difference is so large that the electron transfers completely. The atoms become ions, which attract each other electrically.'
      ]
    },
    es: {
      gebiet: 'es-ES',
      satz: 'Tipo de enlace esperado: ',
      zeilen: ['EN ', 'Diferencia &Delta;EN', 'Escala', 'Por qué'],
      skala: 'menos de 0,4 apolar &middot; de 0,4 a 1,7 polar &middot; más de 1,7 iónico',
      arten: ['enlace metálico', 'enlace covalente apolar', 'enlace covalente polar', 'enlace iónico'],
      warum: [
        'Dos metales: los dos ceden y ninguno acepta. Los restos atómicos quedan inmersos en un mar de electrones común.',
        'Los dos tiran casi con la misma fuerza, así que el par compartido se queda en el medio.',
        'El par compartido se desplaza hacia el más fuerte, pero no pasa del todo. Aparecen un lado ligeramente negativo y otro ligeramente positivo.',
        'La diferencia es tan grande que el electrón pasa por completo. Los átomos se convierten en iones que se atraen eléctricamente.'
      ]
    }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

  function teile(el) {
    var p = el.value.split('|');
    return { name: p[0], en: parseFloat(p[1]), metall: p[2] === '1' };
  }
  function f(x, stellen) {
    return x.toLocaleString(t_.gebiet, { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
  }

  function rechne() {
    var a = teile(fa), b = teile(fb);
    var d = Math.abs(a.en - b.en);

    var i;
    if (a.metall && b.metall) i = 0;
    else if (d < 0.4) i = 1;
    else if (d < 1.7) i = 2;
    else i = 3;

    urteil.innerHTML = t_.satz + '<strong>' + t_.arten[i] + '</strong>';
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0] + a.name, f(a.en, 2)],
      [t_.zeilen[0] + b.name, f(b.en, 2)],
      [t_.zeilen[1], f(d, 2)],
      [t_.zeilen[2], t_.skala],
      [t_.zeilen[3], t_.warum[i]]
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fa.addEventListener('change', rechne);
  fb.addEventListener('change', rechne);
  rechne();
})();
