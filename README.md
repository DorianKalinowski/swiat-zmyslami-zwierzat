# Świat zmysłami zwierząt 🐾

> **Nowoczesna oraz interaktywna aplikacja edukacyjna PWA (Progressive Web App)** odkrywająca tajemnice percepcji, kognitywistyki oraz zmysłów zwierząt z perspektywy ich własnego świata (*Umwelt*).

Projekt stworzony z dbałością o najwyższe standardy UX/UI, estetykę typu *Claude Opus / Editorial Dark Theme*, responsywność (*Mobile-First*) oraz pełną funkcjonalność offline bez konieczności instalowania ze sklepów z aplikacjami.

**Autor i Twórca:** Dorian Kalinowski  
**Licencja:** Wszelkie prawa zastrzeżone © 2026

---

## 🌟 Główne Założenia Projektu

Niemiecki biolog Jakob von Uexküll wprowadził pojęcie **Umwelt** — unikalnego świata zmysłowego, w jakim żyje dany gatunek. Ludzie często oceniają zachowanie zwierząt przez pryzmat ludzkich zmysłów, co prowadzi do nieporozumień, mitów, a w skrajnych przypadkach — pogryzień i ataków.

Aplikacja **„Świat zmysłami zwierząt”** pozwala użytkownikowi dosłownie „wejść w skórę” zwierzęcia:
* Zobaczyć świat w dichromatycznej palecie barw psa lub w nocy dzięki kociej źrenicy i *tapetum lucidum*.
* Usłyszeć ultradźwięki piszczących gryzoni i syntezowane dźwięki ostrzegawcze (Web Audio API).
* Wytropić zapachy w przestrzennym węchu stereo.
* Nauczyć się bezbłędnego odczytywania mowy ciała, by uniknąć ugryzienia przez psa, drapnięcia przez kota czy szarży dzika w lesie.
* Zagrać w 3-poziomowe kampanie mini gier edukacyjnych dla każdego gatunku.

---

## 🐾 Moduły Gatunków (Dostępne w Aplikacji)

### 1. 🐕 Pies domowy (`pies.html`)
* **Wzrok:** Interaktywny suwak porównawczy (człowiek vs pies), dichromatyzm (brak czopków czerwieni — jak pies widzi czerwoną piłkę na zielonej trawie), *tapetum lucidum* oraz wzmocniona detekcja ruchu (*Motion Glow*).
* **Słuch & Audio:** Laboratorium częstotliwości (od 20 Hz do 65 000 Hz) z wbudowanym syntezatorem Web Audio API i testem słyszalności dla ludzkiego ucha.
* **Węch Stereo:** Symulator stereoskopowego węszenia — niezależne nozdrza określające kierunek źródła molekuł zapachowych.
* **Rozkoduj Psa (Mowa Ciała):** Anatomiczny diagram z interaktywnymi punktami (oczy „Whale Eye”, uszy, ziewanie ze stresu/warczenie, metronom ogona, zamrożenie „Freeze”).
* **Symulator Kryzysowy:** Jak zachować się przy szarżującym psie (**Zasada Drzewa**).
* **Lista Toksyn:** Śmiertelne zagrożenia domowe (ksylitol, czekolada, winogrona, cebula).
* **Mini Gra:** *„Super-Nos — Tropiciel Zapachów”* (3 misje: Szczeniak w ogrodzie, Park miejski z rozpraszaczami, Pies ratownik K-9 z bocznym wiatrem).
* **Quiz:** 5 pytań z certyfikatem wiedzy.

### 2. 🐈 Kot domowy (`kot.html`)
* **Wzrok & Źrenica:** Symulator adaptacji źrenicy pionowej od pełnego słońca (100 000 Lux — mikroskopijna szczelina chroniąca siatkówkę) do głębokiej nocy (0.01 Lux — wielka okrągła źrenica z 6-krotnym wzmocnieniem światła).
* **Słuch Ultradźwiękowy:** Odbiór do 85 000 Hz — pisk myszy pod śniegiem, 32 niezależne mięśnie małżowiny usznej.
* **Wibrysy:** Zmęczenie wibrysów (*Whisker Fatigue*) — dlaczego kot nie chce jeść z głębokiej miski.
* **Mruczenie 32 Hz:** Generator częstotliwości regenerującej tkanki i kości.
* **Rozkoduj Kota (Consent Heatmap):** Interaktywna mapa dotyku (strefy euforii z feromonami F3 pod brodą vs pułapka brzucha).
* **Śmiertelne Toksyny:** Lilie (śmiertelna martwica nerek u kotów w 24h), paracetamol, permetryna, okna uchylne.
* **Mini Gra:** *„Koci Refleks — Nocny Łowca”* (3 rundy: Salon, Ogród z żądlącymi osami, Czas Lasera z pomiarem czasu w milisekundach).
* **Quiz:** 5 pytań mistrza kociej natury.

### 3. 🐗 Dzik euroazjatycki (`dzik.html`)
* **Ekologia:** Prawdziwa rola inżyniera leśnego ekosystemu (napowietrzanie gleby, naturalne sadzenie dębów, sanitariusz lasu).
* **Zmysły:** Symulator *Super-Węch kontra Krótkowzroczność* (wpływ wiatru i bezruchu sylwetki człowieka).
* **Anatomia i Oręż:** Samoostrzące się szable i fajki, gwizd i płyta przednosowa, pancerny chyb z żywicy.
* **Dźwięki Ostrzegawcze:** Fukanie i kłapanie szablami syntezowane w Web Audio API.
* **Bezpieczeństwo w Lesie:** Scenariusze kryzysowe (locha z warchlakami, pies bez smyczy jako przyczyna 80% ataków, dzik przy śmietniku).
* **Mini Gra:** *„Buchtowanie w Puszczy — Truflowy Taran”* (3 sezony: Jesień z żołędziami, Puszcza trufli, Zmarzlina i odpady do wagi 200 kg).
* **Quiz:** 5 pytań strażnika leśnego bezpieczeństwa.

---

## 🚀 Technologie i Architektura

* **Czysty Web Stack (Zero zbędnych zależności):** HTML5, Semantic CSS3, Vanilla JavaScript (ES6+).
* **Stylistyka:** Autorski Design System z typografią *Newsreader* (serif display), *Plus Jakarta Sans* (interface UI) oraz *JetBrains Mono* (dane liczbowe/HUD).
* **Audio Engine:** Natywny **Web Audio API** do syntezy częstotliwości (tony sinusoidalne, odgłosy buchtowania, fanfary, kłapanie, sonary). Brak konieczności ładowania plików MP3 z sieci.
* **Canvas API:** Płynne silniki gier 60 FPS zoptymalizowane pod urządzenia mobilne i mysz na desktopie.
* **PWA & Offline:** Service Worker (`sw.js` v8) z inteligentnym buforowaniem, instalowalnym manifestem (`manifest.json`) oraz ikonami PWA.
* **Skalowalność:** Globalny rejestr zwierząt `ANIMAL_REGISTRY` w `js/app.js` z wyszukiwarką i filtrowaniem kategorii (`Cmd+K`).
* **Hosting:** Gotowa konfiguracja pod **Vercel** (`vercel.json`) z obsługą czystych adresów URL i bezkolizyjną nawigacją mobilną.

---

## 💻 Uruchomienie Lokalne

Aplikacja nie wymaga instalacji Node.js ani kompilacji — to czysty, wydajny kod statyczny.

### Opcja 1: Dowolny serwer HTTP (np. Python)
```bash
# W głównym katalogu projektu:
python -m http.server 8000
```
Otwórz przeglądarkę pod adresem: `http://localhost:8000`

### Opcja 2: Rozszerzenie VS Code / IDE
Użyj rozszerzenia **Live Server** i kliknij *„Go Live”* na pliku `index.html`.

---

## ☁️ Wdrożenie na Produkcję (Vercel)

Aplikacja zawiera dedykowany plik [`vercel.json`](vercel.json), który zapobiega błędom nawigacji mobilnej w PWA:

1. Połącz repozytorium GitHub z Vercel lub przeciągnij folder w panelu Vercel.
2. Vercel automatycznie wykryje projekt statyczny.
3. Gotowe! Adresy takie jak `/kot`, `/pies`, `/dzik` działają równolegle z `/kot.html` bez żadnych błędów przekierowań.

---

## 📁 Struktura Projektu

```text
├── index.html              # Strona główna z katalogiem zwierząt
├── pies.html               # Moduł: Pies domowy
├── kot.html                # Moduł: Kot domowy
├── dzik.html               # Moduł: Dzik euroazjatycki
├── vercel.json             # Konfiguracja routingu dla hostingu Vercel
├── manifest.json           # Manifest PWA (ikony, motyw, kolory)
├── sw.js                   # Service Worker (PWA offline cache v8)
├── README.md               # Dokumentacja projektu
├── css/
│   └── style.css           # Pełny system stylów, dark theme i responsywność
├── js/
│   ├── app.js              # Główny silnik aplikacji, nawigacja, katalog (Cmd+K)
│   ├── dog-simulators.js   # Symulatory zmysłów i gra węchowa psa
│   ├── cat-simulators.js   # Symulatory źrenicy, słuchu i gra refleksu kota
│   └── boar-simulators.js  # Symulatory zmysłów, anatomii i gra buchtowania dzika
├── img/
│   └── dorian-kalinowski.png # Zdjęcie autora projektu (Dorian Kalinowski)
└── icons/
    ├── icon-192.svg        # Ikona PWA 192x192
    └── icon-512.svg        # Ikona PWA 512x512
```

---

## 👤 Twórca

Projekt zaprojektowany i zaprogramowany przez:  
**Dorian Kalinowski** — pasjonat zoologii kognitywnej, neuronauki percepcji oraz nowoczesnych aplikacji internetowych.
