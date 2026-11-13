import sys, json
sys.stdout.reconfigure(encoding='utf-8')

d = {}

# BAT QUIZ
d['Do jakiej częstotliwości sięgają ultradźwięki sonaru polskich nietoperzy?'] = 'What frequency does the sonar ultrasound of Polish bats reach?'
d['Do 20 000 Hz (jak granica ludzkiego słuchu)'] = 'Up to 20,000 Hz (human hearing threshold)'
d['Do ok. 40 000 Hz'] = 'Up to approx. 40,000 Hz'
d['Aż do 120 000 Hz (120 kHz!)'] = 'Up to 120,000 Hz (120 kHz!)'
d['Nietoperze posługują się wyłącznie infradźwiękami poniżej 20 Hz'] = 'Bats only use infrasound below 20 Hz'
d['Niektóre gatunki (np. podkowce czy nocki) emitują fale o częstotliwości przekraczającej 100-120 kHz, wielokrotnie przekraczając możliwości ludzkiego ucha (max 20 kHz).'] = 'Certain species (e.g., horseshoe bats or Myotis bats) emit frequencies exceeding 100-120 kHz, far surpassing human auditory limits (max 20 kHz).'

d['W jaki sposób nietoperz nie ogłusza samego siebie, krzycząc z siłą ponad 130 dB?'] = 'How does a bat avoid deafening itself when shouting at over 130 dB?'
d['Zatyka uszy skrzydłami w trakcie lotu'] = 'It plugs its ears with its wings mid-flight'
d['Mięsień strzemiączkowy odłącza kosteczki słuchowe na ułamek sekundy podczas każdego krzyku'] = 'The stapedius muscle decouples auditory ossicles for a split second during each ping'
d['Dźwięk sonaru nie rozchodzi się wewnątrz czaszki nietoperza'] = 'Sonar sound does not propagate through the bat\'s skull'
d['Nietoperz jest z natury całkowicie głuchy na własny głos'] = 'The bat is naturally deaf to its own voice'
d['Przed każdym impulsem miniaturowy mięsień w uchu środkowym zaciska się, odłączając błonę bębenkową od ucha wewnętrznego, a ułamek sekundy później rozluźnia się, by wychwycić powracające echo!'] = 'Before each pulse, a miniature middle ear muscle contracts, disconnecting the eardrum from the inner ear, then relaxes a fraction of a millisecond later to catch the returning echo!'

d['Co należy zrobić, gdy nietoperz przypadkowo wleci wieczorem do pokoju przez okno?'] = 'What should you do if a bat accidentally flies into a room through a window at night?'
d['Gasić światło, zamknąć drzwi do reszty mieszkania i otworzyć szeroko okno na zewnątrz'] = 'Turn off the lights, close doors to the rest of the home, and open the window wide'
d['Próbować strącić go miotłą lub zrolowaną gazetą'] = 'Try to knock it down with a broom or rolled newspaper'
d['Złapać go w locie gołymi rękami i wyrzucić przez balkon'] = 'Catch it in mid-air with bare hands and throw it off the balcony'
d['Włączyć głośną muzykę, by go wypłoszyć'] = 'Play loud music to scare it away'
d['Zgaszenie światła i otwarcie okna pozwala nietoperzowi za pomocą echolokacji zlokalizować wolną przestrzeń i samodzielnie, bez stresu opuścić mieszkanie.'] = 'Turning off lights and opening windows lets the bat use echolocation to map the opening and leave peacefully on its own.'

d['Czy nietoperze wplątują się we włosy ludzi?'] = 'Do bats intentionally tangle themselves in human hair?'
d['Tak, polują na wszy i łupież we włosach'] = 'Yes, they hunt lice and dandruff in hair'
d['Nie, to popularny mit — dzięki doskonałemu sonarowi nietoperz wykrywa obiekt o grubości ludzkiego włosa z odległości kilku metrów!'] = 'No, that is a myth — thanks to flawless sonar, bats detect objects as thin as a single human hair from several yards away!'
d['Robią to tylko nietoperze wampiry'] = 'Only vampire bats do that'
d['Robią to wyłącznie wtedy, gdy w pokoju pali się jasne światło'] = 'Only when bright light is on in the room'
d['Sonar nietoperza jest tak precyzyjny, że potrafi wykryć nić pajęczą o grubości 0,07 mm. Nietoperz doskonale wie, gdzie jest człowiek i omija go z zapasem!'] = 'A bat\'s sonar is so precise it detects spider silk as thin as 0.07 mm. The bat knows exactly where a human is and steers well clear!'

d['Jaki pożytek przynoszą nietoperze w polskim ekosystemie?'] = 'What ecological benefit do bats provide in Poland?'
d['Zjadają setki tysięcy uciążliwych komarów, ciem i szkodników leśnych co noc'] = 'They consume hundreds of thousands of mosquitoes, moths, and agricultural pests every night'
d['Zapylają wyłącznie kwiaty mniszka lekarskiego'] = 'They pollinate only dandelion blossoms'
d['Roznoszą nasiona drzew iglastych w jaskiniach'] = 'They disperse conifer seeds in caves'
d['Nie przynoszą żadnego pożytku'] = 'They provide no ecological benefit'
d['Pojedynczy nocek rudy potrafi w ciągu jednej nocy upolować nawet 1000–1500 komarów! Wszystkie 27 gatunków nietoperzy w Polsce objętych jest ścisłą ochroną gatunkową.'] = 'A single Daubenton\'s bat can capture up to 1,000–1,500 mosquitoes in a single night! All 27 bat species in Poland are strictly protected by law.'

# BEAR QUIZ
d['O ile razy węch niedźwiedzia brunatnego przewyższa węch psa domowego (np. bloodhounda)?'] = 'How many times does a brown bear\'s sense of smell exceed that of a domestic tracking hound (e.g., bloodhound)?'
d['Jest słabszy od węchu psa'] = 'It is weaker than a dog\'s scent'
d['Jest zbliżony do węchu psa'] = 'It is roughly comparable to a dog\'s scent'
d['Około 7-krotnie przewyższa węch bloodhounda (i 100-krotnie węch człowieka!)'] = 'Approximately 7 times superior to a bloodhound (and 100 times keener than human smell!)'
d['Około 2-krotnie'] = 'Approximately 2 times'
d['Opuszka węchowa w mózgu niedźwiedzia jest 5 razy większa niż u człowieka, a powierzchnia nabłonka węchowego 100-krotnie większa. Niedźwiedź czuje padlinę z odległości ponad 20 km!'] = 'A bear\'s olfactory bulb is 5 times larger than a human\'s, and its sensory epithelium is 100 times greater. Bears scent carrion from over 12.4 miles away!'

d['Dlaczego ucieczka sprintem lub wdrapywanie się na drzewo przed niedźwiedziem to śmiertelny błąd?'] = 'Why is sprinting away or climbing a tree from a bear a fatal mistake?'
d['Niedźwiedź biega z prędkością do 50 km/h, świetnie wspina się na drzewa, a ucieczka wyzwala w nim bezwarunkowy instynkt pogoni za ofiarą'] = 'Bears run up to 30 mph (50 km/h), excel at climbing trees, and fleeing triggers their predatory chase instinct'
d['Niedźwiedź potrafi latać na krótkich dystansach'] = 'Bears can glide short distances'
d['Niedźwiedź rzuca kamieniami w uciekających ludzi'] = 'Bears throw boulders at fleeing people'
d['Drzewa w polskich lasach są za słabe na ciężar człowieka'] = 'Trees in Polish forests cannot hold human weight'
d['Nawet 300-kilogramowy niedźwiedź rozwija na krótkim dystansie prędkość 50 km/h (szybciej niż Usain Bolt!). Człowiek nie ma szans na ucieczkę biegiem.'] = 'Even a 650-pound bear reaches 30 mph on short sprints (faster than Olympic sprinters!). Humans stand zero chance of outrunning one.'

d['Co w rzeczywistości oznacza, gdy niedźwiedź na szlaku staje na tylnych łapach?'] = 'What does it actually mean when a bear stands on its hind legs on a trail?'
d['To znak, że za ułamek sekundy nastąpi skok i śmiertelny atak'] = 'A signal that an immediate lethal lunge will follow in a split second'
d['Niedźwiedź prosi o jedzenie jak pies w cyrku'] = 'Bear begging for food like a circus dog'
d['Niedźwiedź próbuje lepiej zlokalizować źródło zapachu i widoku — to postawa ciekawości i oceny sytuacji, a nie agresji!'] = 'The bear is gathering scent and sightlines — it is an posture of curiosity and situational assessment, not aggression!'
d['Niedźwiedź szykuje się do snu zimowego'] = 'The bear is preparing for winter sleep'
d['Stanięcie na dwóch łapach unosi nos niedźwiedzia ponad warstwę przyziemnych zawirowań powietrza, pozwalając mu złapać czystszy prąd zapachowy i ocenić, z czym ma do czynienia.'] = 'Standing on two legs lifts the bear\'s nostrils above surface air turbulence, allowing it to catch cleaner scent currents and determine what is approaching.'

d['Jak należy się zachować, jeśli dojdzie do bezpośredniego ataku niedźwiedzia i kontaktu fizycznego?'] = 'How should you react if a physical bear attack and contact actually occurs?'
d['Walczyć pięściami i kopać niedźwiedzia w nos'] = 'Fight with fists and kick the bear in the snout'
d['Zastosować Pozycję Żółwia: paść na brzuch, spleść palce na karku, łokcie przy głowie, nogi lekko rozszerzone — chroniąc szyję i narządy wewnętrzne'] = 'Adopt the Turtle Position: drop face-down, lace fingers behind your neck, elbows guarding your face, legs slightly spread — protecting throat and vital organs'
d['Zacząć gwałtownie turlać się w dół zbocza'] = 'Start violently rolling down the slope'
d['Krzyczeć piskliwym głosem prosto w pysk zwierzęcia'] = 'Scream shrilly directly into the animal\'s face'
d['Pozycja żółwia minimalizuje obrażenia krytyczne (szyja, tętnice szyjne, twarz, brzuch). Niedźwiedź zazwyczaj po spacyfikowaniu „zagrożenia” odchodzi w las.'] = 'The turtle position shields critical anatomy (carotid arteries, face, throat, abdomen). Once the threat is neutralized, the bear typically disengages and leaves.'

d['Jaki procent diety polskiego niedźwiedzia brunatnego stanowią pokarmy roślinne?'] = 'What percentage of a Polish brown bear\'s diet consists of plant matter?'
d['Zjada wyłącznie mięso upolowanych jeleni'] = 'Eats exclusively meat from hunted deer'
d['Aż 70–80% diety to pokarm roślinny: jagody, trawy, zioła, bukiew, żołędzie i korzonki!'] = 'As much as 70–80% is plant matter: berries, grasses, herbs, beech nuts, acorns, and roots!'
d['Zjada wyłącznie miód z barci'] = 'Eats only wild hive honey'
d['Około 10%'] = 'Around 10%'
d['Choć niedźwiedź należy do rzędu drapieżnych, anatomicznie i behawioralnie jest oportunistycznym wszystkożercą, a większość jego rocznego bilansu kalorycznego pochodzi z runa leśnego!'] = 'Although classified taxonomically in Carnivora, bears are opportunistic omnivores whose primary annual caloric intake derives from forest vegetation!'

# BEE QUIZ
d['Jakiego koloru widzialnego dla człowieka pszczoła miodna NIE dostrzega i widzi go jako czerń?'] = 'Which color visible to humans is honeybees INCAPABLE of seeing, viewing it as pitch black?'
d['Koloru żółtego'] = 'Yellow'
d['Koloru niebieskiego'] = 'Blue'
d['Koloru czerwonego'] = 'Red'
d['Koloru zielonego'] = 'Green'
d['Oczy złożone pszczoły mają receptory dla zieleni, błękitu i ultrafioletu (UV). Zakres widzenia pszczoły jest przesunięty ku falom krótszym — nie widzi barwy czerwonej, widząc ją jako ciemność lub czerń!'] = 'A bee\'s compound eyes possess green, blue, and UV photoreceptors. Their visual spectrum is shifted toward shorter wavelengths — they cannot see red, perceiving it as blackness!'

d['Czym są tzw. „ścieżki nektarowe” (nectar guides) na płatkach kwiatów?'] = 'What are "nectar guides" on floral petals?'
d['Sztucznymi ścieżkami wydeptanymi przez mrówki'] = 'Artificial tracks trampled by ants'
d['Wzorami widocznymi wyłącznie w ultrafiolecie (UV), działającymi jak pasy startowe prowadzące owada prosto do nektarnika'] = 'Patterns visible solely in ultraviolet (UV), functioning like airport runway lights guiding pollinators directly to nectaries'
d['Kroplami rosy odbijającymi światło księżyca'] = 'Dewdrops reflecting moonlight'
d['Śladami zapachowymi zostawianymi przez trutnie'] = 'Scent markings left by drones'
d['Wiele kwiatów (np. mniszek, fiołek, storczyk) wygląda dla nas jednolicie, ale w świetle UV posiada kontrastowy celownik (tzw. Bullseye) skierowany prosto na zalążnię i nektar!'] = 'Many flowers look uniform to human eyes, but in UV light exhibit high-contrast bullseye targets pointing directly to nectaries and pollen!'

d['W jaki sposób pszczoła zwiadowczyni przekazuje w ulu informację o kierunku i odległości do bogatego źródła nektaru?'] = 'How does a scout bee communicate the direction and distance of a rich nectar source to hive mates?'
d['Wydaje głośne piski o różnej wysokości'] = 'Emits loud chirps of varying pitch'
d['Wykonuje na plastrze miodu tzw. Taniec Wywijany (Waggle Dance), gdzie kąt biegu oznacza kąt względem słońca, a czas trwania fazy wywijania — odległość!'] = 'Performs the Waggle Dance on the honeycomb: running angle indicates sun bearing, while vibration duration encodes distance!'
d['Wylatuje z ula i ciągnie za sobą inne pszczoły'] = 'Flies out and physically drags other bees along'
d['Zostawia ślad feromonowy na gałęziach drzew'] = 'Leaves a pheromone trail across tree branches'
d['Za rozszyfrowanie tańca pszczół austriacki zoolog Karl von Frisch otrzymał w 1973 roku Nagrodę Nobla. Kąt osi tańca względem pionu odpowiada kątowi między słońcem a kwiatami!'] = 'Karl von Frisch won the Nobel Prize in 1973 for deciphering the waggle dance. The angle of the figure-eight run relative to vertical matches the angle between the sun and floral targets!'

d['Jaka jest prawidłowa pierwsza pomoc po użądleniu przez pszczołę w rękę lub nogę?'] = 'What is the correct first aid after a bee sting on a hand or leg?'
d['Ucisnąć żądło dwoma palcami i mocno wyciągnąć w górę'] = 'Pinch the stinger with two fingers and pull straight up'
d['Natychmiast zeskrobać żądło płaskim ruchem twardą krawędzią (np. kartą płatniczą lub paznokciem), by nie wycisnąć jadu z woreczka jadowego!'] = 'Immediately scrape the stinger sideways with a firm, flat edge (credit card or fingernail) to avoid injecting remaining venom from the venom sac!'
d['Polać miejsce użądlenia wrzątkiem'] = 'Pour boiling water over the sting'
d['Naciąć skórę żyletką i wyssać jad ustami'] = 'Slit the skin with a razor and suck the venom out'
d['Żądło pszczoły posiada mikroskopijne zadziory i po użądleniu zostaje wyrwane z odwłoka wraz z pulsującym woreczkiem jadowym. Ściśnięcie pęsetą lub palcami wstrzykuje resztę jadu wprost do krwiobiegu!'] = 'A bee\'s barbed stinger remains behind with the pulsing venom sac. Grabbing or pinching with fingers pumps the entire venom payload directly into tissue!'

d['Dlaczego pszczoła miodna ginie po użądleniu człowieka lub innego ssaka?'] = 'Why does a honeybee die after stinging a human or other mammal?'
d['Jad pszczeli jest trujący dla samej pszczoły'] = 'Bee venom is toxic to the bee itself'
d['Zadziory na żądle zakotwiczają się w elastycznej skórze ssaka; odlatująca pszczoła urywa aparat żądłowy wraz z fragmentem przewodu pokarmowego'] = 'Barbs hook firmly in elastic mammal skin; as the bee flies away, its stinging apparatus and digestive tract are torn out'
d['Pszczoła umiera z wycieńczenia psychicznego'] = 'The bee dies from psychological exhaustion'
d['Pszczoła po użądleniu traci zmysł wzroku'] = 'The bee goes blind after stinging'
d['W walce z innymi owadami (o chitynowym pancerzu) pszczoła potrafi wysunąć żądło bez uszczerbku. Elastyczna skóra człowieka zaciska się jednak wokół zadziorów jak imadło.'] = 'Against chitinous insects, bees withdraw their stingers cleanly. Elastic mammal skin, however, traps the barbs like a vise.'

# BOAR QUIZ
d['Jaki zmysł dzika jest absolutną supermocą lasu?'] = 'Which sense of the wild boar is an absolute superpower of the forest?'
d['Wzrok — dzik widzi w podczerwieni'] = 'Vision — boars see infrared'
d['Węch — wyczuwa żołędzie 1 m pod ziemią i człowieka z ponad 500 m'] = 'Scent — detects acorns 3 feet underground and humans from over 500 yards'
d['Smak — potrafi odróżniać rodzaje kory'] = 'Taste — distinguishes tree bark varieties'
d['Echolokacja ultradźwiękowa'] = 'Ultrasonic echolocation'
d['Węch dzika (gwizd) jest 5-krotnie silniejszy niż u psa myśliwskiego. Pozwala mu wyczuwać pędraki pod metrową warstwą zmarzliny!'] = 'A boar\'s sense of smell is 5 times keener than a hunting dog\'s. It smells insect grubs through three feet of frozen soil!'

d['Co jest statystycznie NAJCZĘSTSZYM powodem ataku dzika na człowieka w Polsce?'] = 'What is statistically the MOST COMMON cause of wild boar attacks on humans in Poland?'
d['Głód dzika w środku zimy'] = 'Boar hunger in mid-winter'
d['Kolor ubrań spacerowicza'] = 'Color of hiker\'s clothing'
d['Pies biegający bez smyczy, który prowokuje dzika i ucieka pod nogi właściciela'] = 'An off-leash dog provoking the boar and fleeing back to its owner\'s legs'
d['Śpiewanie piosenek w lesie'] = 'Singing songs in the woods'
d['Ponad 80% konfrontacji z dzikami wywołuje luźno biegający pies. Dzik kontratakuje, a przerażony pies szuka ratunku u swego opiekuna.'] = 'Over 80% of wild boar confrontations are triggered by off-leash dogs. The boar retaliates, and the terrified dog flees to its guardian.'

d['Dlaczego człowiek stojący w bezruchu pod wiatr jest dla dzika niemal niewidzialny?'] = 'Why is a motionless person standing upwind almost invisible to a wild boar?'
d['Dzik ignoruje obiekty wyższe niż 1 metr'] = 'Boars ignore objects taller than 3 feet'
d['Bo dzik jest skrajnym krótkowidzem i reaguje niemal wyłącznie na ruch'] = 'Because boars are severely near-sighted and register almost only movement'
d['Dzik widzi tylko obiekty w kolorze czerwonym'] = 'Boars only see red objects'
d['Bo dziki zamykają oczy podczas buchtowania'] = 'Because boars close their eyes while rooting'
d['Ślepia dzika są małe i krótkowzroczne. Jeśli wiatr nie niesie zapachu, dzik minie nieruchomego człowieka o 2–3 metry, biorąc go za pień drzewa!'] = 'A boar\'s eyes are small and myopic. If wind doesn\'t carry your scent, a boar will walk past a still human within 6 feet, mistaking them for a tree trunk!'

d['Dlaczego dzików w miastach NIE WOLNO dokarmiać resztkami ze stołu?'] = 'Why must wild boars in cities NEVER be fed food scraps?'
d['Bo od pieczywa wypadają im szable'] = 'Because bread makes their tusks fall out'
d['Bo tracą naturalny lęk przed ludźmi i stają się roszczeniowe, co kończy się ich odstrzałem'] = 'Because they lose natural fear of humans and become demanding, leading to mandatory culling'
d['Dziki w mieście i tak mają za dużo jedzenia'] = 'Urban boars already have too much food'
d['Bo dziki jedzą wyłącznie mięso'] = 'Because boars eat only meat'
d['Dokarmianie to wyrok śmierci na dzika. Dzik traci dystans, zaczyna wymuszać jedzenie i w końcu stwarza zagrożenie, przez co miasto zmuszone jest go uśmiercić.'] = 'Feeding urban wildlife is a death sentence. Boars lose caution, demand handouts, become hazardous, and are eventually shot by wildlife authorities.'

d['Co oznacza głośne zgrzytanie szablami (kłapanie zębami) u odyńca?'] = 'What does loud tusk-chattering (jaw popping) mean in an adult wild boar?'
d['Dzik czyści zęby po zjedzeniu żołędzi'] = 'The boar is cleaning its teeth after eating acorns'
d['Prośba o jedzenie'] = 'A plea for food'
d['Ostateczne ostrzeżenie przed atakiem — za ułamek sekundy może nastąpić szarża'] = 'Final pre-attack warning — a charge may follow in a split second'
d['Sygnał powitania dla watahy'] = 'A greeting signal to the sounder'
d['Kłapanie orężem to demonstracja siły i sygnał alarmowy: „jesteś za blisko, atakuję!”. Należy natychmiast, bez paniki, wycofać się tyłem.'] = 'Tusk chattering is a threat display: "you are too close, I am about to charge!". Back away immediately and calmly.'

# CAT QUIZ
d['Dlaczego kot domowy nie jest w stanie poczuć smaku słodkiego?'] = 'Why is the domestic cat unable to perceive sweet tastes?'
d['Bo koty nie lubią deserów'] = 'Because cats dislike desserts'
d['Z powodu trwałej mutacji genu Tas1r2 — kot jest bezwzględnym mięsożercą'] = 'Due to a permanent pseudogene mutation in Tas1r2 — the cat is an obligate carnivore'
d['Bo cukier natychmiast znieczula ich język'] = 'Because sugar immediately numbs their tongue'
d['Koty czują słodycz lepiej niż ludzie'] = 'Cats taste sweetness better than humans'
d['U kotów gen Tas1r2 jest uszkodzonym pseudogenem. Koty jako jedyne spośród udomowionych ssaków nie mają receptorów smaku słodkiego!'] = 'In felines, Tas1r2 is a non-functional pseudogene. Cats are the only domestic mammals devoid of sweet taste receptors!'

d['Do jakiej częstotliwości sięga słuch kota domowego?'] = 'What frequency does a domestic cat\'s hearing reach?'
d['Do 20 000 Hz (jak człowiek)'] = 'Up to 20,000 Hz (like humans)'
d['Do 65 000 Hz (jak pies)'] = 'Up to 65,000 Hz (like dogs)'
d['Aż do 85 000 Hz (znacznie przewyższa słuch psa i człowieka!)'] = 'Up to 85,000 Hz (surpasses both dogs and humans!)'
d['Do 10 000 Hz'] = 'Up to 10,000 Hz'
d['Kot słyszy ultradźwięki aż do 85 kHz. Pozwala mu to bezbłędnie namierzać pisk małych gryzoni i młodych kociąt w trawie.'] = 'Cats detect ultrasound up to 85 kHz, allowing them to pinpoint the high-frequency squeaks of rodents and kittens in dense grass.'

d['Dlaczego koty zostawiają chrupki na dnie głębokiej miski i miauczą o więcej?'] = 'Why do cats leave kibble at the bottom of a deep bowl and meow for more?'
d['Cierpią na Whisker Fatigue (zmęczenie wibrysów) — uderzanie wąsami o ścianki wywołuje ból'] = 'They suffer from Whisker Fatigue — bumping sensitive whiskers against deep sides causes nerve discomfort'
d['Bo chcą zwrócić na siebie uwagę'] = 'Because they want attention'
d['Koty nie widzą nic na odległość mniejszą niż 1 metr'] = 'Cats cannot see anything closer than 3 feet'
d['Mają alergię na dno miski'] = 'They are allergic to the bowl bottom'
d['Wibrysy kota są naszpikowane receptorami. Dotykanie ścianek głębokiej miski wywołuje bolesne przeciążenie nerwowe (Whisker Fatigue). Koty potrzebują płaskiego talerzyka!'] = 'Feline whiskers are packed with nerve receptors. Rubbing deep bowl edges causes sensory overload (Whisker Fatigue). Flat plates are ideal!'

d['Co oznacza, gdy kot kładzie się na plecach i odsłania brzuch?'] = 'What does it mean when a cat rolls onto its back and displays its belly?'
d['Jest głodny i czeka na miskę'] = 'It is hungry and waiting for food'
d['Pokazuje bezgraniczne zaufanie lub pozycję obronną — dotknięcie grozi atakiem!'] = 'It indicates ultimate trust or a defensive fighting posture — petting risks an aggressive scratch or bite!'
d['Ma gorączkę i chłodzi ciało'] = 'It has a fever and is cooling down'
d['Bawi się w martwe zwierzę'] = 'It is playing dead'
d['Odsłonięcie brzucha to dowód zaufania („ufam, że mnie nie skrzywdzisz”) lub gotowość bojowa z użyciem 4 łap. Dotknięcie brzucha wyzwala natychmiastowy odruch obronny!'] = 'Showing the belly demonstrates trust ("I trust you won\'t harm me") or defensive combat readiness with all 4 paws. Petting the belly triggers reflex grabs!'

d['Która roślina jest dla kota ŚMIERTELNĄ trucizną nawet w ilości ziarenka pyłku?'] = 'Which plant is a DEADLY poison for cats even in a single grain of pollen?'
d['Lilia (Liliaceae) — każda jej część wywołuje ostrą martwicę nerek'] = 'Lily (Liliaceae) — all parts induce acute tubular kidney necrosis'
d['Kocimiętka'] = 'Catnip'
d['Trawa pszeniczna'] = 'Wheatgrass'
d['Zielistka Sternberga'] = 'Spider plant'
d['Lilie są dla kotów skrajnie toksyczne. Zlizanie pyłku z futra lub wypicie wody z wazonu po liliach prowadzi do bezmoczowej martwicy nerek i zgonu w 24-48h.'] = 'True lilies are lethal to felines. Licking pollen or drinking lily vase water causes acute kidney failure and death within 24–48 hours.'

with open('dict_quiz_batchA.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print(f"dict_quiz_batchA.json created with {len(d)} translations!")
