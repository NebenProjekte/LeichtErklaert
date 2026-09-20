# -*- coding: utf-8 -*-
"""Umzug von nebenprojekte.github.io/LeichtErklaert/ auf leichterklaert.com.

ERST AUSFUEHREN, WENN DIE DOMAIN GEKAUFT IST.
Aufruf:  python3 umzug-leichterklaert.py          (nur anzeigen, nichts aendern)
         python3 umzug-leichterklaert.py --tun    (wirklich umstellen)

Das Skript aendert nur Dateien in den beiden Projektordnern.
Es committet nichts und pusht nichts — das passiert danach von Hand.
"""
import io, os, re, shutil, sys

ALT_LANG = "https://nebenprojekte.github.io/LeichtErklaert"
ALT_ROOT = "https://nebenprojekte.github.io"
NEU = "https://leichterklaert.com"
DOMAIN = "leichterklaert.com"

HIER = os.path.dirname(os.path.abspath(__file__))
LE = os.path.dirname(HIER)                                  # ...\Projects\LeichtErklaert
ROOT = os.path.join(os.path.dirname(LE), "nebenprojekte.github.io")

TUN = "--tun" in sys.argv

# Dateien, die aus dem Wurzel-Repo mitmuessen, damit /impressum.html usw. weiter gehen
MITNEHMEN = [
    "datenschutz.html", "impressum.html",
    "privacy.html", "imprint.html",
    "privacidad.html", "aviso-legal.html",
    "ueber-uns.html", "about.html", "sobre-nosotros.html",
    "favicon.ico", "favicon.svg", "apple-touch-icon.png",
    "ads.txt",
]

ROBOTS = "User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % NEU


def sag(*a):
    print(("[TUN] " if TUN else "[PROBE] ") + " ".join(str(x) for x in a))


def ersetze_in_datei(pfad):
    try:
        roh = io.open(pfad, "rb").read()
    except OSError:
        return 0
    try:
        txt = roh.decode("utf-8-sig")
    except UnicodeDecodeError:
        return 0
    neu = txt.replace(ALT_LANG, NEU).replace(ALT_ROOT, NEU)
    # doppelte Schraegstriche vermeiden, falls ALT_LANG ohne Slash endete
    neu = neu.replace(NEU + "//", NEU + "/")
    if neu == txt:
        return 0
    n = len(re.findall(re.escape(ALT_ROOT), txt))
    if TUN:
        io.open(pfad, "w", encoding="utf-8").write(neu)
    return n


def schritt1_mitnehmen():
    print("\n--- 1. Rechtstexte und Nebendateien ins Website-Repo holen ---")
    for name in MITNEHMEN:
        q = os.path.join(ROOT, name)
        z = os.path.join(LE, name)
        if not os.path.exists(q):
            print("   FEHLT im Wurzel-Repo:", name)
            continue
        sag("kopiere", name)
        if TUN:
            shutil.copy2(q, z)


def schritt2_cname_robots():
    print("\n--- 2. CNAME und robots.txt anlegen ---")
    sag("CNAME ->", DOMAIN)
    sag("robots.txt ->", "Sitemap auf", NEU)
    if TUN:
        io.open(os.path.join(LE, "CNAME"), "w", encoding="utf-8").write(DOMAIN + "\n")
        io.open(os.path.join(LE, "robots.txt"), "w", encoding="utf-8").write(ROBOTS)


def schritt3_adressen():
    print("\n--- 3. Alle Adressen umschreiben ---")
    gesamt = betroffen = 0
    for wurzel, dirs, dateien in os.walk(LE):
        if ".git" in wurzel or "_umzug" in wurzel or "Claude outputs" in wurzel:
            continue
        for d in dateien:
            if not d.endswith((".html", ".js", ".xml", ".txt", ".css")):
                continue
            n = ersetze_in_datei(os.path.join(wurzel, d))
            if n:
                betroffen += 1
                gesamt += n
    sag("Dateien geaendert:", betroffen, "— Adressen ersetzt:", gesamt)


def schritt4_sitemap():
    print("\n--- 4. Neue sitemap.xml fuer die eigene Domain ---")
    seiten = []
    for wurzel, dirs, dateien in os.walk(LE):
        if ".git" in wurzel or "_umzug" in wurzel or "Claude outputs" in wurzel:
            continue
        for d in sorted(dateien):
            if not d.endswith(".html"):
                continue
            rel = os.path.relpath(os.path.join(wurzel, d), LE).replace(os.sep, "/")
            if rel in ("404.html",):
                continue
            seiten.append("/" if rel == "index.html" else "/" + rel)
    seiten = sorted(set(seiten))
    zeilen = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for s in seiten:
        prio = "1.0" if s == "/" else ("0.8" if s.count("/") == 1 else "0.7")
        zeilen.append("  <url><loc>%s%s</loc><priority>%s</priority></url>" % (NEU, s, prio))
    zeilen.append("</urlset>")
    sag("Sitemap mit", len(seiten), "Adressen")
    if TUN:
        io.open(os.path.join(LE, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(zeilen) + "\n")


if __name__ == "__main__":
    print("Website-Repo :", LE)
    print("Wurzel-Repo  :", ROOT)
    if not TUN:
        print("\nPROBELAUF — es wird nichts geaendert. Mit --tun wirklich umstellen.\n")
    schritt1_mitnehmen()
    schritt2_cname_robots()
    schritt3_adressen()
    schritt4_sitemap()
    print("\nFertig. Danach im Ordner LeichtErklaert:")
    print('  git add -A && git commit -m "Umzug auf leichterklaert.com"')
    print("  Der Push laeuft automatisch ueber auto-push.bat.")
