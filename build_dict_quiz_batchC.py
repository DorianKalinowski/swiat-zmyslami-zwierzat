import sys, json
sys.stdout.reconfigure(encoding='utf-8')

d = {}

# OCTOPUS QUIZ
d['Gdzie znajduje się większość (ok. 2/3) neuronów ośmiornicy?'] = 'Where are the majority (approx. 2/3) of an octopus\'s neurons located?'
d['W potężnym mózgu umieszczonym wewnątrz chitynowego dzioba'] = 'In a massive brain located inside its chitinous beak'
d['W ośmiu ramionach, z których każde posiada autonomiczny zwój nerwowy'] = 'In the eight arms, each possessing an autonomous neural ganglion ring'
d['W worku czernidłowym odpowiedzialnym za obronę'] = 'In the ink sac responsible for defensive release'
d['W trzech sercach pompujących błękitną krew'] = 'In the three hearts pumping blue blood'
d['Aż 350 milionów z 500 milionów neuronów ośmiornicy zlokalizowanych jest w ramionach. Każde ramię potrafi niezależnie badać dno, smakować przyssawkami i chwytać pokarm!'] = 'As many as 350 million of an octopus\'s 500 million neurons reside in the arms. Each arm independently probes the substrate, tastes with suckers, and manipulates objects!'

d['Dlaczego krew ośmiornicy jest intensywnie błękitna, a nie czerwona?'] = 'Why is an octopus\'s blood vivid blue rather than red?'
d['Ponieważ zawiera barwnik melaninowy pobrany z worka czernidłowego'] = 'Because it contains melanin pigment harvested from the ink sac'
d['Ośmiornica absorbuje sole kobaltu z wody morskiej'] = 'The octopus absorbs cobalt salts from seawater'
d['Zamiast żelaza opiera się na miedzi (hemocyjanina), która w zimnej wodzie wydajniej wiąże tlen'] = 'Instead of iron, it relies on copper (hemocyanin), which binds oxygen far more efficiently in cold ocean waters'
d['Jej krew nie zawiera żadnych cząsteczek transportujących tlen'] = 'Its blood contains zero oxygen-transport molecules'
d['Krew głowonogów wykorzystuje cząsteczki hemocyjaniny oparte na atomach miedzi. Po utlenowaniu krew przybiera głęboki lazurowo-błękitny kolor!'] = 'Cephalopod blood utilizes copper-based hemocyanin molecules. When oxygenated, the blood turns an intense azure blue!'

d['Jakie zagrożenie niesie ze sobą dotknięcie małej ośmiornicy niebieskopierścieniowej (Hapalochlaena)?'] = 'What hazard is posed by touching a tiny blue-ringed octopus (Hapalochlaena)?'
d['Może jedynie ubrudzić skórę trwałym atramentem'] = 'Can only stain your skin with persistent ink'
d['Wydziela śmiertelną tetrodotoksynę (TTX), która paraliżuje mięśnie oddechowe człowieka w kilkanaście minut'] = 'It secretes lethal tetrodotoxin (TTX), paralyzing human respiratory muscles within minutes'
d['Powoduje lekkie swędzenie dłoni przypominające poparzenie pokrzywą'] = 'Causes mild hand itching resembling nettle rash'
d['Nie niesie żadnego zagrożenia, te ośmiornice nie mają jadu'] = 'Carries no hazard; these octopuses are non-venomous'
d['Ośmiornica niebieskopierścieniowa przenosi w ślinie tetrodotoksynę (TTX) produkowaną przez symbiotyczne bakterie. Jedno ukąszenie zawiera dawkę wystarczającą do zabicia 26 dorosłych ludzi!'] = 'The blue-ringed octopus carries symbiotic bacterial tetrodotoxin (TTX) in its saliva. A single bite contains enough venom to kill 26 adult humans!'

d['Jaka jest jedyna twarda część ciała ośmiornicy decydująca o tym, przez jaką szczelinę zdoła się przecisnąć?'] = 'What is the ONLY rigid body part that dictates the size of crevice an octopus can squeeze through?'
d['Szkielet wewnętrzny głowotułowia'] = 'Internal skull-box skeleton'
d['Chitynowy dziób w centrum ramion (przypominający dziób papugi)'] = 'The chitinous beak at the center of the arms (resembling a parrot\'s beak)'
d['Pierścienie chrzęstne syfonu odrzutowego'] = 'Cartilaginous siphon rings'
d['Wapienne tarczki na przyssawkach'] = 'Calcareous plates on suckers'
d['Ośmiornica nie posiada ani jednej kości. Jedynym sztywnym elementem jest twardy chitynowy dziób. Jeśli dziób przejdzie przez otwór, całe 10-kilogramowe ciało przeciśnie się bez trudu!'] = 'An octopus has no bones whatsoever. The only rigid structure is its chitinous beak. If the beak clears an aperture, the entire 25-pound animal squeezes through!'

d['Jak szybko ośmiornica potrafi zmienić kolor i strukturę 3D swojej skóry dzięki chromatoforom?'] = 'How fast can an octopus transform its skin color and 3D texture using chromatophores?'
d['Potrzebuje około 2–3 godzin na powolną syntezę barwników'] = 'Requires 2–3 hours for pigment synthesis'
d['Około 15 minut (podobnie jak kameleon)'] = 'Around 15 minutes (like a chameleon)'
d['W zaledwie 200 milisekund (ułamek sekundy) dzięki bezpośredniej kontroli nerwowej mięśni chromatoforów'] = 'In just 200 milliseconds (a split second) via direct neural motor control of chromatophores'
d['Zmienia kolor tylko raz w roku podczas linienia'] = 'Changes color only once a year during molting'
d['W przeciwieństwie do kameleona, który polega na hormonach, chromatofory ośmiornicy połączone są bezpośrednio z układem nerwowym. Zmiana barwy i faktury (papille) następuje w ułamku sekundy!'] = 'Unlike chameleons, which rely on slow endocrine hormonal shifts, cephalopod chromatophores and skin papillae are wired directly to motor nerves, transforming in 200 milliseconds!'

# OWL QUIZ
d['Dlaczego sowa potrafi obrócić głowę aż o 270 stopni w obu kierunkach?'] = 'Why can an owl rotate its head up to 270 degrees in either direction?'
d['Jej szyja nie ma kręgów i jest zbudowana z czystej chrząstki'] = 'Its neck lacks vertebrae and consists of cartilage'
d['Jej oczy są cylindryczne i nieruchome w czaszce, a szyja ma aż 14 kręgów (2x więcej niż u człowieka)'] = 'Its eyes are tubular and immovable in the skull, and its neck has 14 vertebrae (twice as many as humans)'
d['Sowa obraca całe ciało na gałęzi, a nie tylko głowę'] = 'The owl rotates its whole body on the perch, not just its head'
d['To złudzenie optyczne spowodowane puszystymi piórami'] = 'An optical illusion caused by fluffy down feathers'
d['Oczy sowy to nie ruchome kule, lecz wydłużone tuby zablokowane w czaszce pierścieniami twardówkowymi. Aby spojrzeć w bok, sowa musi obrócić całą głowę — pomaga jej w tym 14 kręgów szyjnych i unikalne naczynia krwionośne!'] = 'Owl eyes are not movable spheres, but elongated tubes locked into the skull by sclerotic rings. To glance sideways, owls must rotate their entire head, aided by 14 cervical vertebrae and carotid bypass pools!'

d['W jaki sposób sowa bezbłędnie określa, czy dźwięk dobiega z góry, czy z dołu?'] = 'How does an owl pinpoint whether a sound originates from above or below?'
d['Dzięki asymetrii uszu: prawe ucho jest wyżej i skierowane w dół, a lewe niżej i skierowane w górę'] = 'Through ear asymmetry: the right ear opening is higher and angled upward, while the left is lower and angled downward'
d['Wysyła ultradźwiękowy pisk sonaru jak nietoperz'] = 'Emits ultrasonic sonar clicks like a bat'
d['Używa dzioba jako wskaźnika poziomu dźwięku'] = 'Uses its beak as an acoustic pitch gauge'
d['Odbiera fale wyłącznie przez wibrujące pióra ogona'] = 'Detects sound solely through vibrating tail rectrices'
d['Asymetria puszki słuchowej sprawia, że dźwięk dobiegający z góry jest głośniejszy w prawym uchu, a z dołu w lewym. Pozwala to na trójwymiarowe mapowanie położenia ofiary pod śniegiem z dokładnością do 1 stopnia!'] = 'Ear canal asymmetry ensures sound from above is louder in one ear, and sound from below louder in the other. This grants 3D acoustic triangulation of prey under snow with 1-degree accuracy!'

d['Czym jest szlara twarzowa sowy i jaką pełni funkcję?'] = 'What is an owl\'s facial disc and what is its function?'
d['To ozdobny kołnierz służący do odstraszania drapieżników'] = 'A decorative ruff to intimidate predators'
d['To wieniec sztywnych, ułożonych promieniście piór działający jak talerz satelitarny skupiający fale dźwiękowe'] = 'A ring of stiff, radially arranged feathers functioning like a satellite dish to focus acoustic waves directly into the ear canals'
d['To warstwa tłuszczu chroniąca twarz sowy przed mrozem'] = 'A layer of fat protecting the face from frostbite'
d['To narząd węchu chemicznego do tropienia myszy'] = 'A chemosensory olfactory organ to sniff out mice'
d['Szlara twarzowa ma paraboliczny profil. Zbiera fale akustyczne z otoczenia i kanalizuje je wprost do otworów usznych, wzmacniając ciche piski myszy pod śniegiem nawet 10-krotnie!'] = 'The facial disc has a parabolic contour. It gathers ambient sound waves and funnels them directly into the ear canals, amplifying rodent rustles under snow tenfold!'

d['Co sprawia, że lot sowy jest niemal w 100% bezgłośny dla ucha gryzonia?'] = 'What makes an owl\'s flight nearly 100% silent to rodent ears?'
d['Sowa nie macha skrzydłami i tylko spada na ofiarę'] = 'Owls never flap wings and only drop from above'
d['Aksamitny meszek pochłaniający dźwięk oraz grzebykowate ząbki (serracje) na krawędzi lotek rozbijające wiry powietrza'] = 'Velvety sound-absorbing down and comb-like serrations on flight feather edges that break air turbulence'
d['Sowa porusza się tak wolno, że powietrze nie stawia oporu'] = 'Owls fly so slowly air creates zero resistance'
d['Pióra sowy są pokryte śluzem zmniejszającym tarcie'] = 'Owl plumage is coated with friction-reducing mucus'
d['Na przedniej krawędzi skrzydeł sowy znajdują się mikroskopijne ząbki, które rozbijają duże wiry powietrza na mikro-strumienie. Górna powierzchnia piór pokryta jest miękkim puchem, który tłumi szum tarcia piór o pióra!'] = 'The leading edge of flight feathers features comb-like serrations breaking air turbulence into micro-eddies. The velvety upper down absorbs high-frequency friction sound!'

d['Znalazłeś w lesie młodego, opierzonego podlota sowy siedzącego na trawie pod drzewem. Co robisz?'] = 'You find a young, feathered owl fledgling sitting on grass under a tree. What should you do?'
d['Zabierasz go natychmiast do domu i karmisz surowym mięsem z kurczaka'] = 'Take it home immediately and feed it raw chicken'
d['Zostawiasz go w spokoju (ewentualnie sadzasz na bezpiecznej, wyższej gałęzi) — rodzice są w pobliżu i karmią go w nocy'] = 'Leave it alone (or gently perch it on a safe higher branch) — parents are nearby and feed it at night'
d['Wzywasz straż pożarną do transportu na czubek drzewa'] = 'Call the fire department to hoist it into the treetop'
d['Polewasz go wodą, by go ochłodzić'] = 'Splash water on it to cool it down'
d['Podlot sowy celowo opuszcza ciasną dziuplę, zanim nauczy się w pełni latać. Ukrywa się w podszycie, a rodzice czuwają w koronach drzew i karmią go każdej nocy. Zabieranie go to porwanie dzikiego zwierzęcia!'] = 'Owl fledglings deliberately leave cramped tree cavities before mastering sustained flight. They perch in lower branches while parents guard and feed them nightly. Taking them is kidnapping wildlife!'

# SHARK QUIZ
d['Do czego służą ampułki Lorenziniego zlokalizowane na pysku rekina?'] = 'What is the function of the ampullae of Lorenzini on a shark\'s snout?'
d['Do filtrowania planktonu i soli z wody morskiej'] = 'Filtering plankton and salt from seawater'
d['Do detekcji mikro-pól elektrycznych generowanych przez skurcze mięśni i bicie serca'] = 'Detecting micro-electric fields generated by prey muscle contractions and heartbeats'
d['Do świecenia w ciemnościach głębinowych (bioluminescencja)'] = 'Glowing in deep-sea darkness (bioluminescence)'
d['Do regulowania ciśnienia w pęcherzu pławnym'] = 'Regulating swim bladder buoyancy pressure'
d['Ampułki Lorenziniego to pory wypełnione żelem o najwyższym znanym biologicznym przewodnictwie elektrycznym. Wykrywają napięcia rzędu nanowoltów (0,000000005 V/cm) — wyczują baterię zegarkową zanurzoną w oceanie z 1500 km!'] = 'The ampullae of Lorenzini are gel-filled pores with the highest known biological conductivity. They detect voltages down to 5 nanovolts/cm — sensitive enough to detect a wristwatch battery in seawater!'

d['Z czego składa się szkielet rekina?'] = 'What is a shark\'s skeleton made of?'
d['Z twardych kości pneumatycznych wypełnionych powietrzem'] = 'Dense pneumatic hollow bone'
d['Z chitynowych płytek pancerza zewnętrznego'] = 'Chitinous exoskeleton armor plates'
d['W 100% ze sprężystej chrząstki (brak tradycyjnych kości)'] = '100% resilient cartilage (zero true bone)'
d['Ze zmineralizowanych łusek rogowych'] = 'Mineralized horn-like scutes'
d['Rekiny należą do ryb chrzęstnoszkieletowych. Ich szkielet jest o połowę lżejszy od szkieletu kostnego, niezwykle elastyczny i pozwala na ciasne zwroty w pogoni za zdobyczą.'] = 'Sharks are cartilaginous fish (Chondrichthyes). Their skeleton is half the density of bone, immensely flexible, allowing tight turns during pursuit.'

d['Co powinieneś zrobić, gdy podczas pływania na rafie zauważysz zbliżającego się rekina?'] = 'What should you do if you notice a shark approaching while swimming over a reef?'
d['Panicznie chlapać rękami i nogami oraz płynąć sprintem do brzegu'] = 'Frantically splash arms and legs and sprint for shore'
d['Utrzymywać stały kontakt wzrokowy, przyjąć pozycję pionową i spokojnie się wycofywać'] = 'Maintain continuous eye contact, adopt a vertical posture, and calmly back away'
d['Wypuścić powietrze z płuc i natychmiast uderzyć rekina w pysk'] = 'Exhale all lung air and immediately punch the shark in the snout'
d['Udać martwego unosząc się bezwładnie na powierzchni'] = 'Play dead while drifting limp on the surface'
d['Rekin to drapieżnik z zasadzki. Gdy widzi, że stale na niego patrzysz, wie, że stracił element zaskoczenia. Paniczne pluskanie na powierzchni brzmi dla rekina jak konająca, ranna ryba!'] = 'Sharks are ambush predators. Eye contact removes surprise. Frantic surface splashing mimics a thrashing, dying fish!'

d['W jaki sposób ząbki skórne (łuski plakoidalne) pomagają rekinowi w polowaniu?'] = 'How do dermal denticles (placoid scales) aid a shark in hunting?'
d['Świecą w ciemności, przywabiając małe krewetki'] = 'Glow in the dark to lure small shrimp'
d['Wytwarzają rowki redukujące mikrowiry wody, umożliwiając cichy i szybki pływ bez oporu'] = 'Create riblet microgrooves that cancel drag turbulence, allowing silent, frictionless cruising'
d['Wydzielają silną truciznę paraliżującą przeciwnika'] = 'Secrete potent paralytic venom'
d['Zmieniają kolor w zależności od temperatury wody'] = 'Change color with water temperature'
d['Ząbki skórne rekina przypominają miniaturowe zęby ze szkliwa. Wyciszają szum opływającej wody i redukują opór hydrodynamiczny (stąd stroje pływackie typu Speedo Fastskin inspirowane skórą rekina!).'] = 'Dermal denticles resemble tiny enameled teeth. They suppress boundary layer turbulence, reducing hydrodynamic drag (inspiring Olympic shark-skin swimsuits!).'

d['Ile zębów rekin może wytworzyć i wymienić w ciągu swojego życia?'] = 'How many teeth can a shark produce and shed over its lifespan?'
d['Tylko 32 zęby, podobnie jak dorosły człowiek'] = 'Only 32 teeth, like an adult human'
d['Około 150 zębów (wymieniane raz na 10 lat)'] = 'Around 150 teeth (replaced once a decade)'
d['Nawet do 30 000 zębów na przesuwającej się „taśmie transmisyjnej” dziąseł'] = 'Up to 30,000 teeth on conveyor-belt rotating dental rows'
d['Rekiny rodzą się z jednym zestawem zębów, który nie odrasta'] = 'Sharks are born with one permanent set that never regrows'
d['Zęby rekina ułożone są w wielu rzędach. Gdy jeden ząb wypadnie, w ciągu 24–48 godzin na jego miejsce przesuwa się nowy ząb z tylnego rzędu. Rekin nigdy nie ma problemów z tępymi zębami!'] = 'Shark teeth are arranged in multiple parallel rows. When a front tooth is lost, a replacement rotates forward within 24–48 hours. A shark always maintains razor-sharp weaponry!'

# VIPER QUIZ
d['Po jakich dwóch cechach najpewniej odróżnisz jadowitą żmiję zygzakowatą od niejadowitego zaskrońca?'] = 'By which two visual traits can you reliably distinguish the venomous adder from the harmless grass snake?'
d['Żmija ma pionową źrenicę oka i wstęgę kainową (zygzak), a zaskroniec okrągłą źrenicę i żółte plamy za skroniami'] = 'The adder has vertical slit pupils and a zigzag dorsal ribbon; the grass snake has round pupils and yellow temporal crescent spots'
d['Żmija zawsze głośno grzechocze ogonem, a zaskroniec szczeka'] = 'Adders loudly rattle tails; grass snakes bark'
d['Żmija jest zielona, a zaskroniec zawsze czarny'] = 'Adders are green; grass snakes are always jet black'
d['Żmija ma nogi, a zaskroniec nie ma'] = 'Adders have legs; grass snakes do not'
d['Żmija zygzakowata ma pionowe, kocie źrenice, sercowatą głowę i wyraźny zygzak na grzbiecie. Niejadowity zaskroniec zwyczajny ma okrągłe źrenice oraz charakterystyczne, jaskrawożółte plamy za uszami!'] = 'The common adder has vertical slit pupils, a heart-shaped head, and a dorsal zigzag. The harmless grass snake has round pupils and prominent yellow ear patches!'

d['W jaki sposób żmija „słyszy” zbliżającego się człowieka, skoro nie posiada uszu zewnętrznych ani błony bębenkowej?'] = 'How does an adder "hear" an approaching human without external ears or eardrums?'
d['Wyłącznie za pomocą oczu'] = 'Solely through vision'
d['Odbiera drgania sejsmiczne podłoża dolną szczęką i kością kwadratową połączoną z uchem wewnętrznym'] = 'Detects ground seismic vibrations through lower jaw and quadrate bones linked to the inner ear'
d['Czuje zapach perfum z odległości 2 kilometrów'] = 'Smells perfume from a mile away'
d['W ogóle nie słyszy ani nie czuje obecności człowieka'] = 'Cannot hear or feel humans at all'
d['Żmija dosłownie „słyszy brzuchem”. Drgania kroków człowieka niosą się przez grunt, a kości żuchwy stykające się z ziemią przekazują fale sejsmiczne bezpośrednio do ucha wewnętrznego. Mocne tupanie na szlaku zawsze ją odstrasza!'] = 'Adders literally "hear with their bellies". Footstep ground waves pass through resting jawbones directly into the inner ear. Stamping feet firmly on hiking trails alerts and deters them!'

d['Co należy zrobić w pierwszej kolejności, jeśli dojdzie do ukąszenia przez żmiję?'] = 'What is the immediate priority if bitten by an adder?'
d['Naciąć nożem ranę i wysysać jad ustami'] = 'Incise the wound with a knife and suck venom'
d['Założyć ciasną opaskę uciskową powyżej rany'] = 'Apply a tight arterial tourniquet above the wound'
d['Unieruchomić ukąszoną kończynę poniżej poziomu serca, zachować spokój i wezwać pogotowie (112)'] = 'Immobilize the bitten limb below heart level, remain calm, and call emergency services (112 / 911)'
d['Biec jak najszybciej do najbliższego szpitala'] = 'Sprint as fast as possible to the hospital'
d['Spokój to klucz: każdy wysiłek i stres przyspieszają krążenie krwi i rozprzestrzenianie jadu. Unieruchomienie kończyny (jak przy złamaniu) spowalnia wchłanianie toksyn. Naciskanie i wysysanie rany to niebezpieczne mity!'] = 'Calmness is vital: exertion and panic accelerate systemic venom dissemination. Splinting the limb slows lymphatic absorption. Cutting or sucking wounds are dangerous obsolete myths!'

d['Czym jest tzw. „suche ukąszenie” (dry bite)?'] = 'What is a "dry bite"?'
d['Ukąszeniem przez martwego węża'] = 'A bite from a dead snake'
d['Ukąszeniem obronnym, w którym żmija wbija zęby, ale nie wstrzykuje ani kropli jadu'] = 'A defensive strike where fangs penetrate, but zero venom is injected'
d['Ukąszeniem w trakcie upalnego, suchego lata'] = 'A bite during a hot dry summer'
d['Ukąszeniem przez młodego węża, który nie ma jeszcze zębów'] = 'A bite from a newborn snake without teeth'
d['Nawet 30–50% ukąszeń żmii to tzw. ukąszenia suche! Produkcja jadu kosztuje węża mnóstwo energii, a człowiek jest dla niego zbyt duży na posiłek. Żmija wstrzykuje jad dopiero wtedy, gdy zostanie przygnieciona lub bezpośrednio zaatakowana.'] = 'Up to 30–50% of adder strikes are dry bites! Venom synthesis is metabolically costly, and humans cannot be eaten. Venom is conserved unless the snake is stepped on or physically restrained.'

d['Do czego służy żmii rozwidlony język i narząd Jacobsona?'] = 'What is the function of the adder\'s forked tongue and Jacobson\'s organ?'
d['Do wstrzykiwania jadu w ciało ofiary'] = 'Injecting venom into prey'
d['Do termoregulacji i chłodzenia pyszczka'] = 'Thermoregulation and mouth cooling'
d['Do chemicznego stereo-węchu: język zbiera cząsteczki zapachu i przenosi je do receptorów na podniebieniu'] = 'Stereo-chemical olfaction: the tongue captures airborne scent molecules and delivers them to palate sensory receptors'
d['Do wydawania ostrzegawczego syku'] = 'Producing a warning hiss'
d['Rozwidlony język bada stężenie cząsteczek zapachowych z lewej i prawej strony, pozwalając żmii bezbłędnie podążać śladem uciekającej nornicy w całkowitych ciemnościach!'] = 'The forked tongue assesses scent molecule gradients left versus right, allowing the viper to track escaping rodents along chemical scent trails in pitch blackness!'

with open('dict_quiz_batchC.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print(f"dict_quiz_batchC.json created with {len(d)} translations!")
