import sys, json
sys.stdout.reconfigure(encoding='utf-8')

d = {}

# DOLPHIN QUIZ
d['Jaką rolę pełni melon czołowy w aparacie zmysłowym delfina?'] = 'What role does the melon play in a dolphin\'s sensory anatomy?'
d['Służy jako taran do rozbijania lodu na powierzchni'] = 'Serves as a battering ram to break surface ice'
d['Działa jak soczewka akustyczna — ogniskuje i kieruje wiązkę ultradźwięków sonaru w wąski stożek'] = 'Acts like an acoustic lens — focusing and directing the sonar ultrasound beam into a narrow cone'
d['Jest narządem magazynującym tlen pod wodą'] = 'Stores oxygen while submerged'
d['Wytwarza prąd elektryczny do paraliżowania ryb'] = 'Generates electrical shocks to stun fish'
d['Melon czołowy to owalna poduszka ze specjalnych tłuszczów, która skupia fale dźwiękowe wytwarzane przez wargi fononiczne (phonic lips) w wąską, skoncentrowaną wiązkę skanującą toń morską.'] = 'The melon is an oval fatty pad that focuses sound waves produced by phonic lips into a narrow, concentrated scanning beam through sea water.'

d['W jaki sposób echo powracające z sonaru trafia do ucha wewnętrznego delfina?'] = 'How does returning sonar echo reach a dolphin\'s inner ear?'
d['Przez widoczne małżowiny uszne na głowie'] = 'Through external ear pinnae on the head'
d['Przez cienką kość dolnej żuchwy wypełnioną tłuszczem przewodzącym dźwięk'] = 'Through the thin lower jawbone pan bone filled with sound-conducting acoustic fat'
d['Przez płetwy piersiowe rejestrujące wibracje'] = 'Through pectoral fins sensing vibration'
d['Przez odpowietrznik na czubku głowy'] = 'Through the blowhole on top of the head'
d['Zewnętrzne otwory uszne delfina zanikły. Odbite fale dźwiękowe wnikają przez dolną szczękę, skąd kanał tłuszczowy przewodzi je bezpośrednio do puszki słuchowej (bulla tympanica).'] = 'Dolphins have lost external ear openings. Reflected sound waves penetrate the lower jaw, where an acoustic fat channel conducts them straight to the auditory bulla.'

d['Czym jest tzw. sen unihemisferyczny u delfinów?'] = 'What is unihemispheric slow-wave sleep in dolphins?'
d['Snem w pozycji pionowej na dnie oceanu'] = 'Sleeping vertically on the ocean floor'
d['Odpoczynkiem jednej półkuli mózgu na raz — druga półkula czuwa i kontroluje wynurzanie po tlen'] = 'Resting one brain hemisphere at a time — while the other stays awake to control breathing and surface surfacing'
d['Całkowitym brakiem snu przez całe dorosłe życie'] = 'Complete absence of sleep throughout adult life'
d['Snem zimowym trwającym 3 miesiące'] = 'Three-month winter hibernation'
d['Delfin musi oddychać świadomie, więc nie może stracić przytomności. Jedna połowa mózgu śpi przez ok. 2 godziny z zamkniętym przeciwnym okiem, po czym następuje zamiana stron!'] = 'Dolphins are conscious breathers and cannot lose consciousness. One hemisphere sleeps for ~2 hours with the opposite eye closed, then they switch!'

d['Czym są tzw. „gwizdy podpisowe” (signature whistles) delfinów butlonosych?'] = 'What are the "signature whistles" of bottlenose dolphins?'
d['Odgłosem ostrzegającym przed nadejściem sztormu'] = 'A call warning of approaching storms'
d['Indywidualnymi imionami akustycznymi — każdy delfin tworzy swój własny unikalny gwizd'] = 'Individual acoustic names — each dolphin develops its own unique whistle'
d['Dźwiękiem uderzania ogonem o wodę'] = 'Sound of slapping tails on water'
d['Mechanicznym dźwiękiem tarcia płetw'] = 'Mechanical sound of fin friction'
d['Każdy delfin w pierwszym roku życia tworzy własny wzorzec gwizdu, który pełni funkcję imienia. Inne osobniki potrafią go naśladować, by zawołać konkretnego członka stada!'] = 'Each dolphin develops an individualized whistle contour in its first year that serves as an acoustic name. Pod mates can mimic it to address specific individuals!'

d['Dlaczego wojskowe sonary niskich częstotliwości są śmiertelnie groźne dla waleni?'] = 'Why are military low-frequency active sonars deadly to cetaceans?'
d['Zmieniają temperaturę wody w oceanie'] = 'They alter ocean water temperature'
d['Generują falę akustyczną o natężeniu do 230 dB, wywołującą krwotoki w uszach i paniczne wynurzanie z chorobą dekompresyjną'] = 'They generate blast waves up to 230 dB, causing ear hemorrhage and frantic surfacing with decompression sickness'
d['Niszczą plankton, którym żywią się delfiny'] = 'They destroy plankton that dolphins eat'
d['Odstraszają ryby na setki kilometrów'] = 'They scare fish away for hundreds of miles'
d['Ekstremalnie głośne sonary wojskowe niszczą delikatny aparat słuchowy waleni i wywołują u nich tak silną panikę, że wynurzają się zbyt szybko, co prowadzi do śmiertelnej choroby ciśnieniowej i masowych wyrzuceń na plaże.'] = 'Extremely loud military sonars destroy cetacean auditory tissue and trigger panicked rapid ascents, causing lethal gas embolism and mass beach strandings.'

# EAGLE QUIZ
d['Ile dołków środkowych (fovea centralis) posiada orzeł w każdym oku i jaką pełnią funkcję?'] = 'How many central foveae does an eagle have in each eye, and what is their function?'
d['Tylko jeden dołek, tak jak człowiek'] = 'Only one fovea, just like humans'
d['Dwa dołki: boczny o szerokim kącie i centralny działający jak teleobiektyw powiększający cel 8-krotnie'] = 'Two foveae: a lateral wide-angle fovea and a deep central fovea functioning like an 8x magnifying telephoto lens'
d['Trzy dołki: do widzenia w nocy, w dzień i pod wodą'] = 'Three foveae: night, day, and underwater'
d['Nie ma dołków siatkówki'] = 'No retinal foveae'
d['Zjawisko widzenia dwudołkowego (bifoveal vision) pozwala orłowi jednocześnie kontrolować panoramę terenu i z chirurgiczną ostrością powiększać mały punkt z odległości 3 kilometrów!'] = 'Bifoveal vision allows eagles to monitor a wide panoramic horizon while zooming in with surgical resolution on small prey nearly 2 miles away!'

d['W jaki sposób widzenie w ultrafiolecie (UV) ułatwia orłom polowanie na nornice?'] = 'How does ultraviolet (UV) vision help eagles hunt voles?'
d['Mocz nornic świeci w ultrafiolecie, ujawniając ich podziemne autostrady w trawie'] = 'Vole urine glows in ultraviolet, revealing runway trails through grass'
d['Ultrafiolet prześwietla ziemię jak promienie Rentgena'] = 'Ultraviolet penetrates soil like X-rays'
d['Ciała gryzoni wytwarzają promieniowanie gamma'] = 'Rodent bodies produce gamma radiation'
d['UV odstrasza inne ptaki drapieżne'] = 'UV scares away rival raptors'
d['Mocz i kał małych gryzoni silnie pochłaniają i fluoryzują w paśmie bliskiego UV. Dla orła szlaki komunikacyjne nornic wyglądają z powietrza jak jaskrawe neonowe ścieżki!'] = 'Small rodent urine trails absorb and fluoresce in near-UV. From high altitude, vole runways appear to raptors like glowing neon highways!'

d['Dlaczego orły i bieliki potrafią godzinami szybować w powietrzu bez ani jednego uderzenia skrzydłem?'] = 'Why can eagles and sea eagles soar for hours without flapping their wings?'
d['Posiadają silniki odrzutowe pod skrzydłami'] = 'They have jet propulsion beneath their wings'
d['Wykorzystują kominy termiczne (wznoszące prądy ciepłego powietrza) oraz prądy orograficzne przy zboczach gór'] = 'They harness thermal updrafts (rising warm air columns) and orographic ridge lift along slopes'
d['Powietrze w górach ma mniejszą gęstość i samo unosi ptaka'] = 'Mountain air is less dense and lifts birds automatically'
d['Orły latają wyłącznie z wiatrem w dół'] = 'Eagles fly only downwind'
d['Dzięki potężnej powierzchni nośnej skrzydeł o rozpiętości do 2,5 metra orzeł krąży wewnątrz wstępującego słupa ciepłego powietrza, wznosząc się bez zużycia energii mięśniowej.'] = 'With wingspans up to 8 feet generating immense lift, eagles circle inside rising thermal columns, gaining altitude with virtually zero muscular energy.'

d['Jaka jest minimalna odległość strefy ochrony całorocznej wokół gniazda bielika w Polsce?'] = 'What is the minimum radius of year-round nest protection for sea eagles in Poland?'
d['50 metrów'] = '50 meters (165 ft)'
d['200 metrów (oraz 500 metrów w okresie lęgowym)'] = '200 meters (656 ft, and 500 meters during breeding season)'
d['10 kilometrów'] = '10 kilometers'
d['Gniazda bielików nie są chronione prawem'] = 'Sea eagle nests are not protected by law'
d['Wokół gniazd bielika, orła przedniego i rybołowa obowiązuje w Polsce strefa ochrony ścisłej: 200 m całorocznie i 500 m w okresie od 1 stycznia do 31 lipca.'] = 'Strict conservation zones surround nests of white-tailed eagles and golden eagles in Poland: 650 ft (200m) year-round and 1,640 ft (500m) during breeding.'

d['Co jest główną przyczyną śmiertelnych zatruć bielików w Europie?'] = 'What is the primary cause of lethal poisoning in white-tailed eagles across Europe?'
d['Zjadanie trujących grzybów'] = 'Eating poisonous mushrooms'
d['Ołowica (zatrucie ołowiem) z postrzelonej ołowianym śrutem padliny pozostawionej przez myśliwych'] = 'Lead poisoning (plumbism) from ingesting lead ammunition fragments in unrecovered hunter game'
d['Wdychanie dymu z kominów'] = 'Inhaling chimney smoke'
d['Alergia na rybie ości'] = 'Allergy to fish bones'
d['Bieliki chętnie żywią się padliną. Zjedzenie wnętrzności zwierzęcia postrzelonego ołowianym śrutem wywołuje paraliż przewodu pokarmowego, ślepotę i bolesną śmierć z zatrucia ołowiem.'] = 'Eagles scavenge carcasses. Ingesting lead bullet fragments from unretrieved game causes gastrointestinal paralysis, blindness, and fatal plumbism.'

# FOX QUIZ
d['W jakim kierunku geograficznym skoki myszkujące lisa rudego przynoszą statystycznie aż 73% sukcesu (w porównaniu do zaledwie 18% w innych kierunkach)?'] = 'In which compass direction do red fox mousing leaps achieve 73% success (versus only 18% in other bearings)?'
d['Kierunek nie ma znaczenia — liczy się tylko prędkość biegu'] = 'Direction doesn\'t matter — only running speed'
d['Północny Wschód (około 20° azymutu, zgodnie z wektorem nachylenia ziemskiego pola magnetycznego)'] = 'Northeast (~20° azimuth, aligned with Earth\'s geomagnetic inclination vector)'
d['Ściśle na Południe, by słońce świeciło w oczy ofiary'] = 'Strictly South, so sun blinds the prey'
d['Zawsze dokładnie pod wiatr'] = 'Always directly into the wind'
d['Badania zespołu prof. Hyneka Burdy i dr. Jaroslava Červený\'ego wykazały, że lis używa receptorów kryptochromu w oku jako celownika magnetycznego, synchronizując słuch ze stałym kątem pola geomagnetycznego!'] = 'Research by Prof. Hynek Burda and Dr. Jaroslav Červený demonstrated that foxes use retinal cryptochrome as a magnetic crosshair, synchronizing sound perception with Earth\'s field lines!'

d['Jaka unikalna cecha budowy oka odróżnia lisa rudego od WSZYSTKICH innych dzikich psowatych (Canidae), takich jak wilki czy szakale?'] = 'What unique ocular feature distinguishes the red fox from ALL other wild canids (Canidae), like wolves and jackals?'
d['Całkowity brak widzenia barwnego (achromatopsja)'] = 'Total lack of color vision (achromatopsia)'
d['Oczy umieszczone symetrycznie z tyłu głowy'] = 'Eyes positioned on the back of the head'
d['Pionowe źrenice szczelinowe (identyczne jak u kotów)'] = 'Vertical slit pupils (identical to cats)'
d['Czwarta powieka chroniąca przed mrozem'] = 'A fourth eyelid protecting against frost'
d['Lis jest jedynym dzikim przedstawicielem rodziny psowatych posiadającym pionowe źrenice szczelinowe. Pozwala mu to precyzyjnie regulować ilość wpadającego światła i polować zarówno w ostrym słońcu na śniegu, jak i w głębokiej nocy.'] = 'Foxes are the only wild canids with vertical slit pupils. This allows precise light regulation, hunting both in dazzling snowy glare and total midnight darkness.'

d['Dlaczego epidemiolodzy i służby sanitarne bezwzględnie nakazują dokładne mycie leśnych jagód, poziomek i borówek przed spożyciem?'] = 'Why do epidemiologists mandate thorough washing of wild berries before eating?'
d['Owoce leśne mogą zawierać mikroskopijne jaja tasiemca bąblowcowego (Echinococcus multilocularis) wydalane przez lisy'] = 'Wild berries may harbor microscopic eggs of the alveolar hydatid tapeworm (Echinococcus multilocularis) shed by foxes'
d['Aby zmyć naturalny kwas szczawiowy z leśnego runa'] = 'To wash off natural oxalic acid from forest ground cover'
d['Leśne jagody bez umycia tracą witaminy w żołądku'] = 'Unwashed berries lose stomach vitamins'
d['Żeby usunąć pyłki iglaste utrudniające trawienie'] = 'To remove conifer pollen hindering digestion'
d['Bąblowica wielojamowa (echinokokoza) to śmiertelnie groźna parazytoza. Mikroskopijne jaja tasiemca przyczepione do leśnych owoców po zjedzeniu tworzą w wątrobie człowieka guzy przypominające nowotwór. Mycie w ciepłej wodzie ratuje życie!'] = 'Alveolar echinococcosis is a lethal parasitic infection. Microscopic tapeworm eggs ingested from unwashed wild berries form tumor-like cysts in the human liver. Washing in running warm water saves lives!'

d['Co udowodnił słynny, trwający ponad 50 lat eksperyment prof. Dymitra Biełajewa nad udomowieniem lisów srebrzystych?'] = 'What did Prof. Dmitry Belyaev\'s famous 50-year silver fox domestication experiment prove?'
d['Że lisy są genetycznie niezdolne do oswojenia przez człowieka'] = 'That foxes are genetically incapable of being tamed'
d['Że selekcja wyłącznie pod kątem braku agresji wywołała tzw. zespół udomowienia: merdanie ogonem, oklapnięte uszy i plamiste futro'] = 'That selecting solely for tameness triggered the "domestication syndrome": tail wagging, floppy ears, and piebald coats'
d['Że udomowione lisy zaczęły znosić jaja'] = 'That domesticated foxes laid eggs'
d['Że lisy tracą zdolność słyszenia ultradźwięków'] = 'That foxes lose ultrasound hearing'
d['Eksperyment Biełajewa w Nowosybirsku to kamień milowy genetyki. Selekcja najłagodniejszych lisów doprowadziła do obniżenia poziomu adrenaliny i wywołała kaskadę cech dziecięcych (neotenia) identycznych jak u psów domowych.'] = 'Belyaev\'s Novosibirsk experiment is a milestone in genetics. Breeding exclusively for tameness lowered adrenaline and triggered paedomorphic canine traits (neoteny).'

d['Dlaczego widok lisa spokojnie spacerującego w środku dnia po osiedlu mieszkaniowym w polskim mieście NIE oznacza zazwyczaj wścieklizny?'] = 'Why does a fox calmly walking through a suburban Polish neighborhood during the day NOT indicate rabies?'
d['Wszystkie lisy w Polsce rodzą się z wrodzoną odpornością na wirusa wścieklizny'] = 'All Polish foxes are born with innate rabies immunity'
d['Lisy miejskie są wypuszczane ze schronisk dla zwierząt'] = 'Urban foxes are released from shelters'
d['Wścieklizna u dzikich lisów w Polsce została praktycznie wyeliminowana dzięki zrzutom szczepionek, a lisy miejskie szukają łatwego pożywienia w śmietnikach'] = 'Rabies in wild foxes has been virtually eliminated by aerial vaccine drops; urban foxes simply scavenge easy food in bins'
d['Wirus wścieklizny nie występuje na terenach zurbanizowanych'] = 'Rabies does not occur in urban areas'
d['Dzięki wieloletnim ogólnopolskim zrzutom szczepionek w przynętach z samolotów, wścieklizna w Polsce występuje skrajnie rzadko. Lisy w miastach to zjawisko synantropizacji — inteligentne drapieżniki korzystają z obfitości resztek jedzenia i braku polowań.'] = 'Thanks to decades of aerial bait vaccination drops, rabies is virtually eradicated in Poland. Urban foxes represent synanthropy — smart predators capitalizing on human food waste and absence of hunters.'

# HEDGEHOG QUIZ
d['Dlaczego krowie mleko jest śmiertelnie niebezpieczne dla jeża?'] = 'Why is cow\'s milk fatal to hedgehogs?'
d['Ponieważ zawiera za dużo tłuszczu i jeż nie może się zwinąć w kulkę'] = 'Because it has too much fat and the hedgehog cannot curl up'
d['Jeże nie wytwarzają laktazy — mleko wywołuje ciężką, odwadniającą biegawkę i martwicę jelit'] = 'Hedgehogs lack lactase — cow milk triggers severe dehydrating diarrhea and intestinal necrosis'
d['Mleko przyciąga lisy, które polują na jeże'] = 'Milk attracts predatory foxes'
d['Mleko zmiękcza keratynę w kolcach jeża'] = 'Milk softens quill keratin'
d['Dorosłe i małe jeże nie trawią cukru mlecznego (laktozy). Podanie miski z mlekiem krowim powoduje ostrą biegunkę, odwodnienie organizmu i w ciągu kilkunastu godzin prowadzi do zgonu zwierzęcia!'] = 'Hedgehogs cannot digest lactose. Giving a saucer of cow\'s milk triggers explosive diarrhea, dehydration, and painful death within 24–48 hours!'

d['Co robi jeż podczas zjawiska tzw. samosmarowania (self-anointing)?'] = 'What does a hedgehog do during "self-anointing"?'
d['Zanurza się w błocie, by schłodzić organizm w upalny dzień'] = 'Submerges in mud to cool down on hot days'
d['Żuje intensywny zapach, spienia ślinę i językiem nanosi białą pianę na swoje kolce'] = 'Chews an intense scent, foams saliva, and distributes the frothy paste onto its quills with its tongue'
d['Ociera się o sierść psa, by przejąć jego zapach'] = 'Rubs against dog fur to adopt its smell'
d['Czyści kolce za pomocą rosy z porannych traw'] = 'Cleans spines using morning grass dew'
d['Samosmarowanie (self-anointing) to fascynujący odruch wyzwalany przez narząd Jacobsona przy kontakcie z mocnym zapachem (tytoń, skóra ropuchy, mięta). Jeż pokrywa kolce pienistą śliną, co może służyć kamuflażowi lub odstraszaniu pasożytów.'] = 'Self-anointing is an instinctive reflex triggered via the vomeronasal organ upon encountering pungent smells. The hedgehog lathers quills with foamy saliva for olfactory camouflage or antiparasitic defense.'

d['Dzięki jakiemu białku jeż jest odporny na jad żmii zygzakowatej?'] = 'Which protein makes hedgehogs resistant to common European adder venom?'
d['Mioglobinie'] = 'Myoglobin'
d['Erinaceinie — inhibitorowi krwotocznych metaloproteinaz jadu'] = 'Erinacin — an anti-hemorrhagic venom metalloproteinase inhibitor'
d['Hemoglobinie typu B'] = 'Type B hemoglobin'
d['Keratynie we krwi'] = 'Blood keratin'
d['Białko erinaceina obecne w osoczu krwi jeża neutralizuje enzymy jadu żmii niszczące naczynia krwionośne. Dorosły jeż potrafi przeżyć dawkę jadu śmiertelną dla dorosłego psa!'] = 'Erinacin in hedgehog blood serum binds and neutralizes venom metalloproteinases. An adult hedgehog can survive venom doses lethal to a large dog!'

d['Ile minimalnie powinien ważyć młody jeż w listopadzie, aby bezpiecznie przetrwać hibernację?'] = 'What is the minimum weight a young hedgehog needs by November to survive winter hibernation?'
d['Około 150–200 gramów'] = 'Around 150–200 grams'
d['Minimum 600–700 gramów'] = 'Minimum 600–700 grams (1.3–1.5 lbs)'
d['Co najmniej 2 kilogramy'] = 'At least 2 kilograms'
d['Waga nie ma żadnego znaczenia'] = 'Body weight is irrelevant'
d['Zimowy sen trwa do 5 miesięcy. Jeż ważący poniżej 600g (a zwłaszcza poniżej 400g) nie zgromadził wystarczającej ilości brunatnej tkanki tłuszczowej i umrze z wychłodzenia przed wiosną. Taki maluch wymaga natychmiastowej pomocy ośrodka rehabilitacji!'] = 'Hibernation lasts up to 5 months. A hedgehog under 600g (and especially under 400g) lacks sufficient brown adipose tissue and will freeze before spring. Such hoglets require immediate rescue!'

d['Jaka jest prawdziwa natura diety jeża w naturze?'] = 'What is the true dietary nature of wild hedgehogs?'
d['Jest roślinożercą i żywi się głównie spadłymi jabłkami i gruszkami'] = 'Herbivore feeding primarily on windfall apples and pears'
d['Jest drapieżnym owadożercą — zjada ślimaki, chrząszcze, pędraki, dżdżownice i padlinę'] = 'Carnivorous insectivore — eating slugs, beetles, grubs, earthworms, and carrion'
d['Odżywia się wyłącznie korzonkami traw i grzybami'] = 'Feeds exclusively on grass roots and fungi'
d['Żywi się nasionami zbóż i orzechami'] = 'Feeds on cereal grains and nuts'
d['Jeż jest drapieżnym owadożercą (rząd Eulipotyphla). Opowieść o noszeniu jabłek na kolcach to bajkowy mit rzymskiego pisarza Pliniusza Starszego sprzed 2000 lat! Jeże nie trawią celulozy i nie jedzą jabłek.'] = 'Hedgehogs are predatory insectivores (order Eulipotyphla). The myth of carrying apples on spines dates back 2,000 years to Roman author Pliny the Elder! Hedgehogs cannot digest cellulose and do not eat orchard apples.'

with open('dict_quiz_batchB.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print(f"dict_quiz_batchB.json created with {len(d)} translations!")
