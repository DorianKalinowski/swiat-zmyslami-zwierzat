import sys, json
sys.stdout.reconfigure(encoding='utf-8')

d = {}

# DOLPHIN
d["🏆 WŁADCA OCEANICZNEGO SONARU!"] = "🏆 RULER OF OCEANIC SONAR!"
d["Ukończyłeś wszystkie 10 głębin morskich! Opanowałeś melon akustyczny i echolokację jak prawdziwy walen!"] = "You conquered all 10 sea depths! You mastered the acoustic melon and echolocation like a true cetacean!"
d["⏱️ Brak tlenu!"] = "⏱️ Out of oxygen!"
d["Delfin musiał wynurzyć się na powierzchnię. Wracaj pod wodę i skanuj dno sonarem!"] = "The dolphin had to surface for air. Dive back down and scan the sea floor with sonar!"
d["Delfin namierzył sonarem i schwytał wszystkie cele w głębinie!"] = "The dolphin tracked and caught all targets in the deep using sonar!"
d["Wysoka precyzja USG"] = "High Precision Ultrasound"
d["Szeroki kąt skanowania"] = "Wide Scanning Angle"
d["1. Zwolnij obroty silnika do biegu jałowego lub utrzymaj stały, wolny kurs.<br>2. Nigdy nie pływaj wprost na stado delfinów — daj im przestrzeń do swobodnego podpłynięcia.<br>3. Nie dotykaj i nie karm delfinów dziko żyjących — dotyk człowieka przenosi patogeny i niszczy ich naturalne zachowania."] = "1. Idle your boat engine or maintain a steady, slow course.<br>2. Never steer directly at a dolphin pod — allow them space to approach voluntarily.<br>3. Do not touch or feed wild dolphins — human touch transfers pathogens and disrupts natural foraging behavior."

# SHARK
d["⚡ Ampułki Lorenziniego:"] = "⚡ Ampullae of Lorenzini:"
d["Wykryto mikrowolty!"] = "Microvolts detected!"
d["GRATULACJE! Władca Zmysłów Oceanu!"] = "CONGRATULATIONS! Master of Ocean Senses!"
d["Ukończyłeś wszystkie 10 poziomów! Opanowałeś elektrorecepcję, stereowęch i bezszelestny pływ ząbków skórnych."] = "You completed all 10 levels! You mastered electroreception, stereo-smell, and silent denticle swimming."
d["Patrol nieudany!"] = "Patrol failed!"
d["Spróbuj ponownie zachować czujność sensoryczną."] = "Try again to maintain sensory vigilance."
d["Twoje ampułki Lorenziniego bezbłędnie wykryły wszystkie ofiary pod dnem!"] = "Your ampullae of Lorenzini flawlessly detected all prey buried in the seabed!"
d["👁️ Przełącz na zwykły wzrok podwodny (Ofiara zniknie w piasku)"] = "👁️ Switch to normal underwater sight (Prey vanishes under sand)"
d["Wzrok: Niewidoczna flądra pod 20 cm piasku"] = "Vision: Flounder invisible beneath 8 inches of sand"
d["Zmysł: Zwykły wzrok podwodny"] = "Sense: Normal underwater vision"
d["Płytka Rafa Koralowa i Płaszczki ⚡"] = "Shallow Coral Reef & Stingrays ⚡"
d["Głębia Oceaniczna i Niewidoczne Rekiny Młoty 🌊"] = "Oceanic Deep & Invisible Hammerheads 🌊"
d["1. <strong>Utrzymuj kontakt wzrokowy:</strong> Obracaj się razem z rekinem, dając mu do zrozumienia, że go widzisz. Rekiny to drapieżnicy z zasadzki — utrata elementu zaskoczenia zazwyczaj zniechęca je do ataku.<br>2. <strong>Nie pluskaj i nie uciekaj w panice:</strong> Chlapanie na powierzchni imituje ranną, szamoczącą się rybę.<br>3. W razie bezpośredniego ataku uderz twardym przedmiotem w czubek pyska (ampułki Lorenziniego), oczy lub szczeliny skrzelowe."] = "1. <strong>Maintain eye contact:</strong> Turn with the shark, letting it know it has been spotted. Sharks are ambush predators — losing the surprise element usually deters them.<br>2. <strong>Do not splash or flee in panic:</strong> Surface splashing imitates a wounded, struggling fish.<br>3. If attacked, firmly strike the snout tip (ampullae of Lorenzini), eyes, or gill slits."

# OCTOPUS
d["UKRYTY (100%)"] = "HIDDEN (100%)"
d["WIDOCZNY!"] = "VISIBLE!"
d["🏖️ Piasek (Żółty)"] = "🏖️ Sand (Yellow)"
d["🪸 Koralowiec (Różowy)"] = "🪸 Coral (Pink)"
d["🪨 Bazalt (Szary)"] = "🪨 Basalt (Gray)"
d["🌿 Algi (Zielony)"] = "🌿 Algae (Green)"
d["GRATULACJE! Władca Głębinowego Kamuflażu!"] = "CONGRATULATIONS! Master of Deep Camouflage!"
d["Ukończyłeś wszystkie 10 poziomów! Opanowałeś 500 mln neuronów, dynamiczne chromatofory i szorstką teksturę papilli."] = "You completed all 10 levels! You mastered 500 million neurons, dynamic chromatophores, and tactile skin papillae."
d["Zdemaskowany!"] = "Exposed!"
d["Drapieżnik zauważył Cię przez niedopasowany wzór kamuflażu! Wybieraj barwę odpowiadającą podłożu."] = "A predator spotted you due to a mismatched camouflage pattern! Select the color matching the sea floor."
d["Ośmiornica bezbłędnie wtopiła się w otoczenie i zdobyła pożywienie!"] = "The octopus seamlessly blended into its surroundings and caught food!"
d["8 Autonomicznych Ramion — Zdecentralizowany Umysł"] = "8 Autonomous Arms — Decentralized Mind"
d["Płytka Rafa i Złote Kraby 🦀🐙"] = "Shallow Reef & Golden Crabs 🦀🐙"
d["Koralowy Labirynt i Purpurowe Ukwiały 🪸"] = "Coral Maze & Purple Anemones 🪸"
d["Skalisty Wrak Okrętu i Ciemny Bazalt 🪨"] = "Rocky Shipwreck & Dark Basalt 🪨"
d["Gęsta Łąka Traw Morskich i Mureny 🌿"] = "Dense Seagrass Meadow & Moray Eels 🌿"
d["Podmorska Rozpadlina Szelfowa 🌊"] = "Subsea Shelf Chasm 🌊"
d["Nocna Rafa i Świecący Plankton ✨"] = "Night Reef & Glowing Plankton ✨"
d["Labirynt Wąskich Szczelin Skalnych 🧗"] = "Maze of Narrow Rock Crevices 🧗"
d["Koralowce Ogniste i Szybkie Mureny 🐍"] = "Fire Corals & Swift Morays 🐍"
d["Głębia Rowu Oceanicznego — Test Zmysłów 🌌"] = "Ocean Trench Abyss — Sensory Trial 🌌"
d["Władca Chromatoforów — Król Kamuflażu 👑🐙"] = "Master of Chromatophores — Camouflage King 👑🐙"
d["1. <strong>Zachowaj dystans:</strong> Podziwiaj zwierzę z odległości 1–2 metrów bez wkładania rąk w szczeliny skalne.<br>2. Choć ośmiornice są ciekawskie i inteligentne, posiadają twardy chitynowy dziób i gruczoły jadowe (jad neurotoksyczny służy do paraliżowania krabów).<br>3. Nie wyciągaj ośmiornicy z wody ani nie chwytaj za ramiona — to wywołuje u niej panikę i zrzucenie chmury atramentu."] = "1. <strong>Keep your distance:</strong> Observe from 3–6 feet away without reaching into rock crevices.<br>2. Although curious and intelligent, octopuses have a hard chitinous beak and venom glands (neurotoxic venom paralyzes crabs).<br>3. Never pull an octopus out of the water or grab its arms — this triggers extreme panic and ink discharge."

with open('dict_simulators_set4.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print(f"Set 4 dictionary created successfully with {len(d)} translations!")
