/* Aufbau eines Atoms aus der Ordnungszahl.
   Die Schalenbesetzung folgt der Schulregel 2-8-8-2, die bis Calcium (20) trägt.
   Die Massenzahl ist die des häufigsten Isotops, daraus folgt die Neutronenzahl. */
(function () {
  var box = document.querySelector('[data-rechner="atom"]');
  if (!box) return;

  var sel = box.querySelector('[name="element"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  var texte = {
    de: {
      zeilen: ['Protonen im Kern', 'Elektronen in der Hülle', 'Neutronen im Kern', 'Schalenbesetzung', 'Außenelektronen', 'Stellung im Periodensystem'],
      satz: function (n, a) { return n + ' hat <strong>' + a + (a === 1 ? ' Außenelektron' : ' Außenelektronen') + '</strong>.'; },
      periode: 'Periode', gruppe: 'Hauptgruppe',
      gibt: function (k) { return ' Es gibt ' + k + ' davon ab und wird zum ' + (k === 1 ? 'einfach' : (k === 2 ? 'zweifach' : 'dreifach')) + ' positiv geladenen Ion.'; },
      nimmt: function (k) { return ' Es nimmt ' + k + ' auf und wird zum ' + (k === 1 ? 'einfach' : (k === 2 ? 'zweifach' : 'dreifach')) + ' negativ geladenen Ion.'; },
      edel: ' Die äußerste Schale ist voll — deshalb reagiert es praktisch mit nichts.',
      mitte: ' Mit vier Außenelektronen gibt es weder ab noch nimmt es auf, sondern teilt sie.',
      massenzahl: function (m) { return ' (bei der Massenzahl ' + m + ')'; }
    },
    en: {
      zeilen: ['Protons in the nucleus', 'Electrons in the shell', 'Neutrons in the nucleus', 'Shell occupancy', 'Outer electrons', 'Position in the periodic table'],
      satz: function (n, a) { return n + ' has <strong>' + a + (a === 1 ? ' outer electron' : ' outer electrons') + '</strong>.'; },
      periode: 'Period', gruppe: 'Group',
      gibt: function (k) { return ' It gives ' + k + ' away and becomes an ion with charge ' + k + '+.'; },
      nimmt: function (k) { return ' It takes ' + k + ' on and becomes an ion with charge ' + k + '−.'; },
      edel: ' Its outer shell is full, which is why it reacts with almost nothing.',
      mitte: ' With four outer electrons it neither gives nor takes, but shares them.',
      massenzahl: function (m) { return ' (for mass number ' + m + ')'; }
    },
    es: {
      zeilen: ['Protones en el núcleo', 'Electrones en la corteza', 'Neutrones en el núcleo', 'Distribución por capas', 'Electrones externos', 'Posición en la tabla periódica'],
      satz: function (n, a) { return n + ' tiene <strong>' + a + (a === 1 ? ' electrón externo' : ' electrones externos') + '</strong>.'; },
      periode: 'Periodo', gruppe: 'Grupo',
      gibt: function (k) { return ' Cede ' + k + ' y se convierte en un ion con carga ' + k + '+.'; },
      nimmt: function (k) { return ' Acepta ' + k + ' y se convierte en un ion con carga ' + k + '−.'; },
      edel: ' Su capa externa está completa, por eso no reacciona prácticamente con nada.',
      mitte: ' Con cuatro electrones externos ni cede ni acepta: los comparte.',
      massenzahl: function (m) { return ' (para el número másico ' + m + ')'; }
    }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

  /* Schalen nach der Schulregel füllen: 2, dann 8, dann 8, der Rest in die vierte. */
  function schalen(z) {
    var platz = [2, 8, 8, 2], aus = [], rest = z;
    for (var i = 0; i < platz.length && rest > 0; i++) {
      var n = Math.min(rest, platz[i]);
      aus.push(n);
      rest -= n;
    }
    return aus;
  }

  function rechne() {
    var p = sel.value.split('|');
    var name = p[0], z = parseInt(p[1], 10), masse = parseInt(p[2], 10), gruppe = parseInt(p[3], 10);
    var s = schalen(z);
    var periode = s.length;
    var aussen = s[s.length - 1];

    var zusatz;
    if (gruppe === 8) zusatz = t_.edel;
    else if (aussen === 4) zusatz = t_.mitte;
    else if (aussen <= 3) zusatz = t_.gibt(aussen);
    else zusatz = t_.nimmt(8 - aussen);

    urteil.innerHTML = t_.satz(name, aussen) + zusatz;
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0], z],
      [t_.zeilen[1], z],
      [t_.zeilen[2], (masse - z) + t_.massenzahl(masse)],
      [t_.zeilen[3], s.join(' &ndash; ')],
      [t_.zeilen[4], aussen],
      [t_.zeilen[5], t_.periode + ' ' + periode + ', ' + t_.gruppe + ' ' + gruppe]
    ].map(function (z2) { return '<dt>' + z2[0] + '</dt><dd>' + z2[1] + '</dd>'; }).join('');
  }

  sel.addEventListener('change', rechne);
  rechne();
})();
