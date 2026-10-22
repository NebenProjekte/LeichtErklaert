/* Simulation des Drei-Türen-Problems. Spielt echte Runden,
   zählt getrennt, wie oft Bleiben und wie oft Wechseln gewinnt. */
(function () {
  var box = document.querySelector('[data-sim="drei-tueren"]');
  if (!box) return;

  var gesamt = 0, bleibenGewinnt = 0, wechselnGewinnt = 0;
  var stand = box.querySelector('.sim-stand');
  var zeilen = {
    bleiben: box.querySelector('.sim-zeile.bleiben'),
    wechseln: box.querySelector('.sim-zeile.wechseln')
  };

  function spiele(n) {
    for (var i = 0; i < n; i++) {
      var auto = Math.floor(Math.random() * 3);
      var wahl = Math.floor(Math.random() * 3);
      // Der Moderator öffnet eine Tür, die weder gewählt ist noch das Auto verbirgt.
      var offen;
      do { offen = Math.floor(Math.random() * 3); } while (offen === wahl || offen === auto);
      var gewechselt = 3 - wahl - offen;
      if (wahl === auto) bleibenGewinnt++;
      if (gewechselt === auto) wechselnGewinnt++;
      gesamt++;
    }
    zeichne();
  }

  function prozent(x) {
    return gesamt ? (100 * x / gesamt) : 0;
  }

  function zeichne() {
    [['bleiben', bleibenGewinnt], ['wechseln', wechselnGewinnt]].forEach(function (paar) {
      var z = zeilen[paar[0]];
      if (!z) return;
      var p = prozent(paar[1]);
      z.querySelector('.sim-wert').textContent = paar[1].toLocaleString('de-DE') + ' von '
        + gesamt.toLocaleString('de-DE') + ' (' + p.toFixed(1).replace('.', ',') + ' %)';
      z.querySelector('.sim-balken span').style.width = p + '%';
    });
    stand.textContent = gesamt
      ? gesamt.toLocaleString('de-DE') + ' Spiele gerechnet. Erwartet werden 33,3 % für Bleiben und 66,7 % für Wechseln.'
      : 'Noch keine Spiele gerechnet.';
  }

  box.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-reset')) {
      gesamt = bleibenGewinnt = wechselnGewinnt = 0;
    } else {
      spiele(parseInt(b.getAttribute('data-runden'), 10) || 0);
    }
    zeichne();
  });

  zeichne();
})();
