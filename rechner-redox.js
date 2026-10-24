/* Laeuft die Reaktion zwischen einem Metall und der Loesung eines anderen Metalls ab?
   Entscheidend ist die Redoxreihe: Das unedlere Metall gibt die Elektronen ab.
   Die Spannung ist die Differenz der Standardpotentiale. */
(function () {
  var box = document.querySelector('[data-rechner="redox"]');
  if (!box) return;

  var fm = box.querySelector('[name="metall"]');
  var fi = box.querySelector('[name="ion"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  var texte = {
    de: {
      gebiet: 'de-DE',
      gleich: 'Zwei gleiche Metalle — hier passiert nichts, es gibt keinen Unterschied im Bestreben, Elektronen abzugeben.',
      ja: function (a, b, u) { return 'Die Reaktion läuft ab: <strong>' + a + ' löst ' + b + ' aus der Lösung.</strong> Zellspannung ' + u + ' V.'; },
      nein: function (a, b) { return 'Hier passiert nichts. ' + a + ' ist edler als ' + b + ' und gibt seine Elektronen nicht ab.'; },
      zeilen: ['Oxidation (Elektronen ab)', 'Reduktion (Elektronen auf)', 'Standardpotentiale', 'Zellspannung', 'Merksatz'],
      merk: 'Das unedlere Metall gibt ab — es steht in der Redoxreihe weiter links.',
      keine: 'keine Reaktion'
    },
    en: {
      gebiet: 'en-GB',
      gleich: 'Two identical metals — nothing happens here, as there is no difference in their willingness to give up electrons.',
      ja: function (a, b, u) { return 'The reaction runs: <strong>' + a + ' displaces ' + b + ' from the solution.</strong> Cell voltage ' + u + ' V.'; },
      nein: function (a, b) { return 'Nothing happens here. ' + a + ' is nobler than ' + b + ' and will not give up its electrons.'; },
      zeilen: ['Oxidation (gives electrons)', 'Reduction (takes electrons)', 'Standard potentials', 'Cell voltage', 'Rule of thumb'],
      merk: 'The less noble metal gives electrons away — it sits further left in the reactivity series.',
      keine: 'no reaction'
    },
    es: {
      gebiet: 'es-ES',
      gleich: 'Dos metales iguales: aquí no pasa nada, porque no hay diferencia en su tendencia a ceder electrones.',
      ja: function (a, b, u) { return 'La reacción se produce: <strong>' + a + ' cede sus electrones y ' + b + ' se deposita como metal.</strong> Voltaje de la pila: ' + u + ' V.'; },
      nein: function (a, b) { return 'Aquí no pasa nada. ' + a + ' es más noble que ' + b + ' y no cede sus electrones.'; },
      zeilen: ['Oxidación (cede electrones)', 'Reducción (acepta electrones)', 'Potenciales estándar', 'Voltaje de la pila', 'Regla práctica'],
      merk: 'El metal menos noble es el que cede — está más a la izquierda en la serie de reactividad.',
      keine: 'no hay reacción'
    }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

  function teile(el) {
    var p = el.value.split('|');
    return { name: p[0], symbol: p[1], e: parseFloat(p[2]), n: parseInt(p[3], 10) };
  }
  function f(x, stellen) {
    return x.toLocaleString(t_.gebiet, { minimumFractionDigits: stellen, maximumFractionDigits: stellen }).replace('-', '−');
  }
  function ion(m) {
    return m.symbol + '<sup>' + (m.n > 1 ? m.n : '') + '+</sup>';
  }
  /* Am Satzanfang muss der Stoffname gross beginnen - im Englischen und
     Spanischen stehen die Namen sonst klein mitten im Satz. */
  function gross(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function rechne() {
    var m = teile(fm), i = teile(fi);

    if (m.symbol === i.symbol) {
      urteil.textContent = t_.gleich;
      urteil.className = 'rechner-urteil';
      werte.innerHTML = '';
      return;
    }

    var u = i.e - m.e;            /* positiv: die Reaktion laeuft freiwillig ab */
    var laeuft = u > 0;

    urteil.innerHTML = laeuft ? t_.ja(m.name, i.name, f(u, 2)) : t_.nein(gross(m.name), i.name);
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0], laeuft ? (m.symbol + ' &rarr; ' + ion(m) + ' + ' + m.n + ' e<sup>&minus;</sup>') : t_.keine],
      [t_.zeilen[1], laeuft ? (ion(i) + ' + ' + i.n + ' e<sup>&minus;</sup> &rarr; ' + i.symbol) : t_.keine],
      [t_.zeilen[2], m.symbol + ': ' + f(m.e, 2) + ' V &middot; ' + i.symbol + ': ' + f(i.e, 2) + ' V'],
      [t_.zeilen[3], f(u, 2) + ' V'],
      [t_.zeilen[4], t_.merk]
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fm.addEventListener('change', rechne);
  fi.addEventListener('change', rechne);
  rechne();
})();
