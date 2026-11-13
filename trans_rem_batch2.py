import sys, json
sys.stdout.reconfigure(encoding='utf-8')

d = {}

# Feedback & Warnings
d['❌ BŁĄD: Wskakiwanie do wody i próba dotknięcia!'] = '❌ ERROR: Jumping into the water and trying to touch!'
d['❌ BŁĄD: Łapanie do wiaderka lub kubka!'] = '❌ ERROR: Catching in a bucket or cup!'
d['❌ Błąd krytyczny i okrucieństwo!'] = '❌ Critical error and cruelty!'
d['❌ Błąd krytyczny: Piskliwy krzyk i rzucanie kamieniami!'] = '❌ Critical error: High-pitched screaming and throwing stones!'
d['Żadnego nacinania nożem, wysysania ustami ani przypalania! W ustach są mikrootarcia, przez które jad błyskawicznie wchłania się do mózgu ratownika.'] = 'Never cut with a knife, suck by mouth, or cauterize! Oral micro-abrasions allow venom to absorb straight into the rescuer\'s bloodstream.'
d['Świetny pierwszy krok! Przejrzyj sekcje o nawigacji magnetycznej i profilaktyce bąblowicy, aby opanować wiedzę w 100%!'] = 'Great first step! Review magnetic navigation and tapeworm prevention to master 100% of the material!'
d['Znawca Ptaków Nocnych 🌙'] = 'Connoisseur of Night Birds 🌙'
d['Zobacz certyfikat wyników 🏆'] = 'View Performance Certificate 🏆'
d['Zobacz certyfikat leśnego bezpieczeństwa →'] = 'View Forest Safety Certificate →'
d['Zobaczysz, jak w ułamku sekundy dopasowuje się do otoczenia, nie czując się zagrożona.'] = 'You will see it match its surroundings in a split second without feeling threatened.'
d['Poranna mgła i zmarznięty lód. Uważaj na kruchy lód na rowach.'] = 'Morning fog and frozen crust. Beware of brittle ice over ditches.'
d['Poranna mgła ogranicza zwykły wzrok. Filtr ultrafioletowy ujawnia ukryte ścieżki gryzoni!'] = 'Morning fog obscures ordinary sight. Ultraviolet filters reveal hidden rodent runways!'
d['Potężne Szpony o Uścisku Ponad 400 PSI'] = 'Mighty Talons with Grip Over 400 PSI'
d['Płaski talerzyk: PEŁEN KOMFORT'] = 'Flat plate: ABSOLUTE COMFORT'
d['Płetwa Grzbietowa — Stabilizator i Chłodnica'] = 'Dorsal Fin — Hydrodynamic Stabilizer & Thermal Radiator'
d['Płyń spokojnie:'] = 'Swim smoothly:'
d['RGB (Światło widzialne)'] = 'RGB (Visible Light)'
d['Skrajne ciśnienie i głód. Złów 7 krabów pod czujnym okiem 3 drapieżników.'] = 'Extreme pressure and hunger. Catch 7 crabs under the watchful eye of 3 predators.'
d['Skrajne pióra skrzydeł sowy mają ząbkowane krawędzie (jak grzebyk), które rozbijają wiry powietrza na mniejsze strumienie, wyciszając szum lotu.'] = 'Leading-edge wing feathers have comb-like serrations breaking air turbulence into micro-eddies, silencing flight noise.'
d['Skrzydła Szczelinowe z Rozszczepionymi Lotkami'] = 'Slotted Wings with Separated Primaries'
d['Skrzydła z Wydłużonych Palców Dłoni'] = 'Wings Formed from Elongated Hand Digits'
d['Toksyna peptydowa ślimaka stożka: ALARM!'] = 'Cone snail peptide neurotoxin: ALARM!'
d['Triumfalny Powrót do Ula — Królowa Czeka 👑🍯✨'] = 'Triumphant Return to the Hive — The Queen Awaits 👑🍯✨'
d['Tryb: Spektrum UV (300-400 nm) — Wykryto ślady moczu gryzoni!'] = 'Mode: UV Spectrum (300-400 nm) — Rodent urine trails detected!'
d['Turyści w ciężkich butach trekingowych. Ich kroki wywołują sejsmiczne fale. Ukryj się w szczelinie skalnej!'] = 'Hikers in heavy trekking boots. Their steps generate seismic shockwaves. Hide in a rock crevice!'
d['W Polsce wszystkie 27 gatunków nietoperzy to owadożercy pod ścisłą ochroną prawną.'] = 'In Poland, all 27 bat species are insectivores under strict legal conservation protection.'
d['W centrum wieńca ramion znajduje się twardy dziób zbudowany z chityny i usieciowanych białek, zdolny kruszyć pancerze krabów.'] = 'At the center of the arm ring lies a hard beak of chitin and cross-linked proteins, capable of crushing crab carapaces.'
d['W ciemnościach tylko idealny kamuflaż chroni przed czujnym okiem węgorza morskiego i rekina.'] = 'In darkness, only perfect camouflage protects against vigilant moray eels and sharks.'
d['W jaki sposób pszczoła zwiadowczyni informuje siostry w ulu o odległości i kierunku do kwiatów?'] = 'How does a scout bee inform sisters in the hive of distance and direction to blossoms?'
d['Wracasz wieczorem do bloku w Gdyni lub Warszawie. Pod wiatą śmietnikową żeruje wataha dzików.'] = 'You return home in the evening in Gdynia or Warsaw. A wild boar sounder is foraging by the dumpster enclosure.'
d['Wrak porasta 3 strefy dna: skała, piasek i koralowce. Złów 4 kraby, unikając drapieżników.'] = 'The shipwreck spans 3 benthic zones: rock, sand, and corals. Catch 4 crabs while avoiding predators.'
d['Wspaniale! Ukończyłeś misję, zbierając krabów!'] = 'Splendid! You completed the mission, gathering crabs!'
d['Współczynnik oporu: jeden z najniższych w przyrodzie (Cd ~0.003)'] = 'Drag coefficient: one of the lowest in nature (Cd ~0.003)'
d['Zając'] = 'Hare'
d['Zając polny (odległość optyczna: ~ m)'] = 'European hare (optical distance: ~ m)'
d['Zakres słuchu: 250 Hz – 45 000 Hz'] = 'Hearing range: 250 Hz – 45,000 Hz'
d['Zanieczyszczona Zatoka — Uwaga na Śruby 🚤'] = 'Polluted Bay — Watch for Propellers 🚤'
d['Świstak'] = 'Marmot'
d['Żmija zygzakowata jest płochliwym gadem, który atakuje człowieka wyłącznie w bezpośredniej obronie własnej.'] = 'The common adder is a timid reptile that strikes humans exclusively in direct self-defense.'
d['Żaden ssak w Europie nie potrafi latać aktywnie poza nietoperzami. Ich skrzydła to przekształcone dłonie ze skórzastą błoną.'] = 'No mammal in Europe possesses powered flight except bats. Their wings are modified hands with a patagial membrane.'
d['Żółtawa tęczówka oka z pionową źrenicą reaguje w ułamku sekundy na zmiany nasłonecznienia.'] = 'A yellowish iris with a vertical pupil responds in a split second to shifting sunlight.'
d['Żółw'] = 'Turtle'
d['Żółwik'] = 'Turtle position'

with open('dict_rem_b2.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print(f"dict_rem_b2.json created with {len(d)} translations!")
