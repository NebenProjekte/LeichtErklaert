/* Aggregatzustand eines Stoffes bei einer bestimmten Temperatur.
   Entscheidend sind Schmelz- und Siedepunkt bei Normaldruck. */
(function () {
  var box = document.querySelector('[data-rechner="zustand"]');
  if (!box) return;

  var fs = box.querySelector('[name="stoff"]');
  var ft = box.querySelector('[name="temperatur"]');
  var urteil = box.querySelector('.rechner-urteil');
  var werte = box.querySelector('.rechner-werte');

  var texte = {
    de: {
      gebiet: 'de-DE',
      fehler: 'Bitte eine Temperatur als Zahl eintragen.',
      fest: 'fest', fluessig: 'flüssig', gas: 'gasförmig',
      satz: function (n, t, z) { return n + ' ist bei ' + t + ' &deg;C <strong>' + z + '</strong>.'; },
      zeilen: ['Schmelzpunkt', 'Siedepunkt', 'Abstand zum Schmelzpunkt', 'Abstand zum Siedepunkt', 'Bei Zimmertemperatur (20 °C)'],
      darueber: 'Grad darüber', darunter: 'Grad darunter', genau: 'genau erreicht'
    },
    en: {
      gebiet: 'en-GB',
      fehler: 'Enter a temperature as a number.',
      fest: 'solid', fluessig: 'liquid', gas: 'gaseous',
      satz: function (n, t, z) { return 'At ' + t + ' &deg;C, ' + n + ' is <strong>' + z + '</strong>.'; },
      zeilen: ['Melting point', 'Boiling point', 'Distance from the melting point', 'Distance from the boiling point', 'At room temperature (20 °C)'],
      darueber: 'degrees above', darunter: 'degrees below', genau: 'exactly reached'
    },
    es: {
      gebiet: 'es-ES',
      fehler: 'Introduce una temperatura como número.',
      fest: 'estado sólido', fluessig: 'estado líquido', gas: 'estado gaseoso',
      satz: function (n, t, z) { return 'A ' + t + ' &deg;C, ' + n + ' se encuentra en <strong>' + z + '</strong>.'; },
      zeilen: ['Punto de fusión', 'Punto de ebullición', 'Distancia al punto de fusión', 'Distancia al punto de ebullición', 'A temperatura ambiente (20 °C)'],
      darueber: 'grados por encima', darunter: 'grados por debajo', genau: 'alcanzado exactamente'
    }
  };
  var t_ = texte[box.getAttribute('data-sprache') || document.documentElement.lang] || texte.de;

  function f(x, stellen) {
    /* Echtes Minuszeichen statt Bindestrich. */
    return x.toLocaleString(t_.gebiet, { minimumFractionDigits: stellen, maximumFractionDigits: stellen }).replace('-', '\u2212');
  }
  function zustand(temp, schmelz, siede) {
    if (temp < schmelz) return t_.fest;
    if (temp < siede) return t_.fluessig;
    return t_.gas;
  }
  function abstand(temp, punkt) {
    var d = temp - punkt;
    if (Math.abs(d) < 0.05) return t_.genau;
    return f(Math.abs(d), 0) + ' ' + (d > 0 ? t_.darueber : t_.darunter);
  }

  function rechne() {
    var p = fs.value.split('|');
    var name = p[0], schmelz = parseFloat(p[1]), siede = parseFloat(p[2]);
    var temp = parseFloat(String(ft.value).replace(',', '.'));
    if (!isFinite(temp)) {
      urteil.textContent = t_.fehler;
      urteil.className = 'rechner-urteil rechner-fehler';
      werte.innerHTML = '';
      return;
    }
    urteil.innerHTML = t_.satz(name, f(temp, temp === Math.round(temp) ? 0 : 1), zustand(temp, schmelz, siede));
    urteil.className = 'rechner-urteil';

    werte.innerHTML = [
      [t_.zeilen[0], f(schmelz, 0) + ' &deg;C'],
      [t_.zeilen[1], f(siede, 0) + ' &deg;C'],
      [t_.zeilen[2], abstand(temp, schmelz)],
      [t_.zeilen[3], abstand(temp, siede)],
      [t_.zeilen[4], zustand(20, schmelz, siede)]
    ].map(function (z) { return '<dt>' + z[0] + '</dt><dd>' + z[1] + '</dd>'; }).join('');
  }

  fs.addEventListener('change', rechne);
  ft.addEventListener('input', rechne);
  rechne();
})();
