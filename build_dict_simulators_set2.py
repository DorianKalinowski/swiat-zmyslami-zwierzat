import sys, json
sys.stdout.reconfigure(encoding='utf-8')

d = {}

# BAT
d["🦋 Ćma w locie"] = "🦋 Flying Moth"
d["🧗 Stalaktyt"] = "🧗 Stalactite"
d["🦟 Komar"] = "🦟 Mosquito"
d["🪨 Ściana jaskini"] = "🪨 Cave Wall"
d["Aż do 120 000 Hz (120 kHz!)"] = "Up to 120,000 Hz (120 kHz!)"
d["Pierwsze loty młodego nocka. Spokojne ćmy odpoczywające na ścianach. Wysyłaj impulsy sonaru i łap zdobycz!"] = "First flights of a young Myotis bat. Docile moths resting on walls. Fire sonar pings and catch prey!"
d["Tysiące zwinnych komarów i ciem nad taflą wody. Złap 7 owadów w ułamku sekundy!"] = "Thousands of nimble mosquitoes and moths over water. Catch 7 insects in a split second!"
d["Nietoperz schwytał wszystkie ${lvl.targetMoths} ciem dzięki echolokacji."] = "The bat caught all ${lvl.targetMoths} moths thanks to echolocation."
d["Zabrakło energii! Wyślij więcej impulsów sonaru i poluj szybciej."] = "Out of energy! Send more sonar pulses and hunt faster."
d["Nietoperz uderzył w przeszkodę. Wypuszczaj sonar częściej, by widzieć kształty ścian!"] = "The bat struck an obstacle. Emit sonar pings more often to perceive cave walls!"
d["⏱️ Skończył się czas!"] = "⏱️ Time ran out!"
d["💥 Zderzenie ze stalaktytem!"] = "💥 Collision with a stalactite!"
d["Nos i Narząd Sonaru (Kielich Akustyczny)"] = "Nose & Sonar Organ (Acoustic Horn)"
d["Robi to wyłącznie wtedy, gdy w pokoju pali się jasne światło"] = "Only does so when bright light is on in the room"
d["Próbować strącić go miotłą lub zrolowaną gazetą"] = "Try to knock it down with a broom or rolled newspaper"
d["Złapać go w locie gołymi rękami i wyrzucić przez balkon"] = "Catch it in mid-air with bare hands and throw it off the balcony"
d["Bezbłędnie! Znasz fizykę sonaru, bioakustykę i wiesz doskonale, jak reagować przy spotkaniu z tymi niezwykłymi ssakami."] = "Flawless! You know sonar physics, bioacoustics, and exactly how to respond when encountering these amazing mammals."
d["Bardzo dobry wynik! Wiesz, że nietoperze to pożyteczni sprzymierzeńcy człowieka zjadający tysiące komarów co noc."] = "Very good score! You know bats are beneficial allies of humans eating thousands of mosquitoes every night."
d["Warto przejrzeć sekcję bioakustyki i procedury bezpiecznego uwalniania nietoperza raz jeszcze!"] = "It's worth reviewing the bioacoustics section and safe bat release procedure again!"

# BEAR
d["WĘCH WYKRYTY! (20 km)"] = "SCENT DETECTED! (12.4 mi)"
d["Zasięg węchu: do 20 km w górach"] = "Scent range: up to 12.4 miles (20 km) in mountains"
d["Wiosenne przebudzenie z gawry. Zgłodniały niedźwiedź szuka świeżych traw, ziół i korzonków."] = "Spring emergence from the den. Hungry bear seeks fresh grass, herbs, and roots."
d["Ludzie z psami przeczesują las. Pamiętaj: omijaj zapach człowieka wielkim łukiem!"] = "Humans with dogs are combing the woods. Remember: avoid human scent by a wide margin!"
d["Ciche polowanie w górskim nurcie. Złap zwinne ryby i unikaj obozowiczów."] = "Silent hunting in mountain currents. Catch agile fish and steer clear of campers."
d["Niedźwiedź prosi o jedzenie jak pies w cyrku"] = "Bear begging for food like a circus dog"
d["Powierzchnia nabłonka węchowego niedźwiedzia jest 100-krotnie większa niż u człowieka i 7-krotnie większa niż u psa ogara. Niedźwiedź czuje zapach padliny przez litą ścianę lasu z odległości 20 km i wyczuwa obecność człowieka pod wiatr z 2 km!"] = "A bear's olfactory epithelium is 100 times larger than a human's and 7 times larger than a bloodhound's. It scents carrion through solid forest walls from 12.4 miles away and human presence upwind from 1.2 miles!"
d["Perfekcyjna wiedza! Znasz potęgę węchu niedźwiedzia, zasady bezpieczeństwa na szlaku i pozycję żółwia ratującą życie."] = "Perfect knowledge! You know the power of bear scent, trail safety protocols, and the life-saving turtle position."
d["Bardzo dobry wynik! Wiesz, jak zachować się w gawrze i dlaczego ucieczka sprintem jest najgorszym błędem."] = "Very good score! You know how to act near a den and why sprinting away is the worst mistake."
d["Zabrakło kalorii na zimę. Węszyj uważniej i unikaj spotkań z ludźmi!"] = "Not enough calories for winter. Scent more carefully and avoid human encounters!"
d["Podszedłeś zbyt blisko człowieka! Niedźwiedź unika ludzi, a zaskoczony może zaatakować w obronie własnej."] = "You got too close to a human! Bears avoid humans, but when startled may attack in self-defense."
d["Niedźwiedź zgromadził wymaganą porcję kalorii (${currentCalories} kcal)."] = "The bear gathered the required calorie intake (${currentCalories} kcal)."
d["⏱️ Zmierzch w Bieszczadach!"] = "⏱️ Twilight in Bieszczady!"
d["⚠️ Spotkanie z turystą na szlaku!"] = "⚠️ Encounter with a hiker on the trail!"
d["Dieta: 75% rośliny, 25% białko"] = "Diet: 75% plant-based, 25% protein"
d["Długość: 8–10 cm (konstrukcja kilofa)"] = "Length: 3–4 inches (pickaxe design)"
d["Co w rzeczywistości oznacza, gdy niedźwiedź na szlaku staje na tylnych łapach?"] = "What does it actually mean when a bear stands on its hind legs on a trail?"
d["Dlaczego ucieczka sprintem lub wdrapywanie się na drzewo przed niedźwiedziem to śmiertelny błąd?"] = "Why is sprinting away or climbing a tree a fatal mistake with a bear?"
d["Jak należy się zachować, jeśli dojdzie do bezpośredniego ataku niedźwiedzia i kontaktu fizycznego?"] = "How should you react if a physical bear attack and contact actually occurs?"
d["Zjada wyłącznie miód z barci"] = "Eats only wild hive honey"
d["Zacząć gwałtownie turlać się w dół zbocza"] = "Start violently rolling down the slope"

# FOX
d["NE (73% sukcesu)"] = "NE (73% success)"
d["Adaptacja zimowa: naturalne raki śnieżne"] = "Winter adaptation: natural snow crampons"
d["Arcymistrz Zmysłów Lisa Rudego!"] = "Grandmaster of Red Fox Senses!"
d["Biegun zimna! Temperatura -20°C. Słuchaj chrupania ziaren pod śniegiem."] = "Cold pole! Temperature -4°F (-20°C). Listen for grain chewing beneath snow."
d["Myszki schowały się głęboko pod zmarzlinę. Spróbuj ponownie i poluj w kierunku północno-wschodnim!"] = "Mice hid deep beneath the frozen crust. Try again and pounce toward the northeast!"
d["Lis wpadł na psa wiejskiego lub załamał się lód! Omijaj przeszkody i nasłuchuj w ciszy."] = "Fox bumped into a farm dog or ice broke! Avoid hazards and listen in silence."
d["Lis złowił ${currentMice} gryzoni dzięki magnetycznemu skokowi!"] = "The fox caught ${currentMice} rodents using its magnetic pounce!"
d["⏱️ Zapadła zimowa noc!"] = "⏱️ Winter night has fallen!"
d["⚠️ Zagrożenie na śniegu!"] = "⚠️ Hazard in the snow!"
d["1. **ZAWSZE MYJ LEŚNE OWOCE:** Mycie borówek i poziomek pod bieżącą ciepłą wodą usuwa jaja bąblowca (Echinococcus multilocularis).<br>2. **ODROBACZAJ PSY I KOTY:** Domowe zwierzęta mogą zarazić się bąblowcem, zjadając mysz polną.<br>3. **NIE DOTYKAJ PADŁYCH LISÓW:** Zgłoś martwe zwierzę do nadleśnictwa lub straży miejskiej."] = "1. **ALWAYS WASH WILD BERRIES:** Washing blueberries and wild strawberries under warm running water removes fox tapeworm eggs (Echinococcus multilocularis).<br>2. **DEWORM PETS:** Domestic dogs and cats can contract tapeworms by eating field mice.<br>3. **DO NOT TOUCH DEAD FOXES:** Report carcasses to foresters or animal control."
d["Aby zmyć naturalny kwas szczawiowy z leśnego runa"] = "To wash off natural oxalic acid from forest ground cover"
d["Badania zespołu prof. Hyneka Burdy i dr. Jaroslava Červený"] = "Research by Prof. Hynek Burda and Dr. Jaroslav Červený's team"
d["Bardzo dobry wynik! Doskonale orientujesz się w mechanizmach zmysłów lisa i znasz profilaktykę bąblowicy."] = "Very good score! You thoroughly grasp fox sensory mechanics and tapeworm prevention."

# HEDGEHOG
d["Analiza chemiczna: Liść mięty pieprzowej (Mentol)"] = "Chemical analysis: Peppermint leaf (Menthol)"
d["Analiza chemiczna: Skóra ropuchy szarej (Bufotalina i Bufotenina)"] = "Chemical analysis: Common toad skin (Bufotalin & Bufotenine)"
d["Analiza chemiczna: Tytoń / Dym cygara (Nikotyna)"] = "Chemical analysis: Tobacco / Cigar smoke (Nicotine)"
d["Analiza chemiczna: Żywiczna kora sosny (Terpeny)"] = "Chemical analysis: Resinous pine bark (Terpenes)"
d["Wykryto zapach: Mentol (Mięta)"] = "Scent detected: Menthol (Peppermint)"
d["Wykryto zapach: Bufotalina (Ropucha)"] = "Scent detected: Bufotalin (Toad)"
d["Wykryto zapach: Nikotyna (Tytoń)"] = "Scent detected: Nicotine (Tobacco)"
d["Wykryto zapach: Terpeny (Sosna)"] = "Scent detected: Terpenes (Pine)"
d["🫧 Jeż intensywnie żuje bodziec i pieni ślinę..."] = "🫧 Hedgehog vigorously chews substance and foams saliva..."
d["Adept Świata Jeży 📚"] = "Adept of the Hedgehog World 📚"
d["🏆 MISTRZ PRZETRWANIA JEŻA!"] = "🏆 HEDGEHOG SURVIVAL MASTER!"
d["Ukończyłeś wszystkie 10 nocy! Twój jeż osiągnął wagę 850g i bezpiecznie zapadł w hibernację na zimę."] = "You survived all 10 nights! Your hedgehog reached 850g and safely entered winter hibernation."
d["Słońce wzeszło, a jeż nie zebrał wystarczająco dużo kalorii. Spróbuj ponownie i poluj wydajniej!"] = "Sun rose before the hedgehog gathered enough calories. Try again and forage more efficiently!"
d["Kosiarka automatyczna zaskoczyła jeża podczas marszu! Gdy słyszysz silnik, natychmiast zwijaj się w kulkę."] = "Robotic mower startled the hedgehog on its march! When you hear motors, curl into a ball immediately."
d["Jeż zjadł ${lvl.targetFood} pożywnych bezkręgowców i bezpiecznie wrócił do gniazda!"] = "Hedgehog ate ${lvl.targetFood} nutritious invertebrates and safely returned to the nest!"
d["⏱️ Świt nadszedł!"] = "⏱️ Dawn has broken!"
d["💥 Uwaga na kosiarkę!"] = "💥 Beware of the lawn mower!"
d["1. Umieść malucha w wysokim kartonie wyścielonym ręcznikami papierowymi.<br>2. Ogrzej go termoforem lub butelką z ciepłą wodą owiniętą w ręcznik.<br>3. NIE PODAWAJ KROWIEGO MLEKA! (Jeże nie trawią laktozy — mleko krowie wywołuje śmiertelną bieglinkę).<br>4. Skontaktuj się z ośrodkiem rehabilitacji dzikich zwierząt lub fundacją jeżową (np. Primum, Jeże dla Świata)."] = "1. Place the hoglet in a tall cardboard box lined with paper towels.<br>2. Warm it with a warm water bottle wrapped in a towel.<br>3. DO NOT GIVE COW'S MILK! (Hedgehogs are lactose intolerant — cow's milk causes fatal diarrhea).<br>4. Contact a wildlife rescue center or hedgehog foundation."

with open('dict_simulators_set2.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print(f"Set 2 dictionary created successfully with {len(d)} translations!")
