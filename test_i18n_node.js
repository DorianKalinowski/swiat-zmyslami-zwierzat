// Node.js test harness for i18n and translations
const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Mock window and document environment for Node
global.window = global;
global.MutationObserver = class {
  constructor(cb) { this.cb = cb; }
  observe() {}
  disconnect() {}
};
global.localStorage = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; }
};
global.document = {
  readyState: 'complete',
  title: 'Świat zmysłami zwierząt',
  documentElement: { lang: 'pl' },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  createTreeWalker() { return { nextNode() { return null; } }; },
  addEventListener() {}
};

// 1. Load translations.js
const transCode = fs.readFileSync(path.join(__dirname, 'js/translations.js'), 'utf-8');
eval(transCode);
console.log('✓ translations.js loaded. Total keys:', Object.keys(window.TRANSLATIONS_EN).length);

// 2. Load i18n.js
const i18nCode = fs.readFileSync(path.join(__dirname, 'js/i18n.js'), 'utf-8');
eval(i18nCode);
console.log('✓ i18n.js loaded.');

// Set language to 'en'
window.i18n.setLanguage('en');
assert.strictEqual(window.i18n.currentLang, 'en');
console.log('✓ Switched language to "en"');

// 3. Test dynamic patterns
const testDynamic = [
  ["Misja 1 Ukończona!", "Mission 1 Completed!"],
  ["Misja 3 ukończona!", "Mission 3 Completed!"],
  ["Poziom 2 Zwyciężony!", "Level 2 Victorious!"],
  ["Poziom 1 Zakończony Sukcesem!", "Level 1 Completed Successfully!"],
  ["Poziom 5 Ukończony!", "Level 5 Completed!"],
  ["Sukces! Ukończono Misję 3!", "Success! Mission 3 Completed!"],
  ["Zwycięstwo! Ukończono Poziom 4!", "Victory! Level 4 Completed!"],
  ["🎉 Zwycięstwo! Ukończono Poziom 2!", "🎉 Victory! Level 2 Completed!"],
  ["🎉 Sukces! Ukończono Misję 1!", "🎉 Success! Mission 1 Completed!"],
  ["🎉 Poziom 3 Zakończony Sukcesem!", "🎉 Level 3 Completed Successfully!"],
  ["🎉 Poziom 4 Ukończony!", "🎉 Level 4 Completed!"],
  ["🎉 Misja 2 Zrealizowana!", "🎉 Mission 2 Accomplished!"],
  ["Sezon 1 Zakończony Sukcesem!", "Season 1 Completed Successfully!"],
  ["PYTANIE 1 Z 5", "QUESTION 1 OF 5"],
  ["Pytanie 2 z 5", "Question 2 of 5"],
  ["Twój wynik: 5 z 5 (100%)", "Your score: 5 of 5 (100%)"],
  ["Twój wynik: 3 / 5 (60%)", "Your score: 3 / 5 (60%)"],
  ["Twój wynik: 4 z 5 punktów (80%)", "Your score: 4 of 5 points (80%)"],
  ["Nietoperz schwytał wszystkie 5 ciem dzięki echolokacji.", "The bat caught all 5 moths thanks to echolocation."],
  ["Delfin namierzył sonarem i schwytał wszystkie 6 ryby.", "The dolphin tracked with sonar and caught all 6 fish."],
  ["Orzeł namierzył i pochwycił wszystkie 4 cele z zawrotną precyzją.", "The eagle spotted and caught all 4 targets with dizzying precision."],
  ["Lis złowił 3 gryzoni dzięki zmysłowi geomagnetycznemu!", "The fox caught 3 rodents thanks to its geomagnetic sense!"],
  ["Jeż zjadł 8 pożywnych owadów i zgromadził cenny zapas energii.", "The hedgehog ate 8 nutritious insects and built up a valuable energy reserve."],
  ["Sowa zlokalizowała i schwytała wszystkie 5 gryzonie za pomocą szlary twarzowej.", "The owl located and captured all 5 rodents using its facial disc."],
  ["Znakomicie! Wytropiłeś wszystkie 4 ofiary!", "Splendid! You tracked down all 4 prey!"],
  ["Wspaniale! Ukończyłeś misję, zbierając 6 krabów!", "Wonderful! You completed the mission, gathering 6 crabs!"],
  ["Pszczoła napełniła wole miodowe (45 mg). Pasieka rośnie w siłę!", "The bee filled its honey stomach (45 mg). The apiary grows in strength!"],
  ["Niedźwiedź zgromadził wymaganą porcję kalorii (3200 kcal).", "The bear gathered the required calorie portion (3200 kcal)."],
  ["Niedźwiedź zgromadził wymaganą porcję kalorii (2500 kcal z 5000 kcal). Ruszaj dalej w puszczę!", "The bear gathered the required calorie portion (2500 kcal of 5000 kcal). Head deeper into the primeval forest!"],
  ["Pszczoła napełniła wole miodowe (30 mg z 60 mg). Wracaj z tańcem wywijanym do ula!", "The bee filled its honey stomach (30 mg of 60 mg). Return to the hive with the waggle dance!"],
  ["Upolowałeś 7 z 10 celów!", "You hunted 7 of 10 targets!"],
  ["Znalazłeś 5 trufli", "You found 5 truffles"],
  ["15 myszy", "15 mice"],
  ["8 ciem", "8 moths"]
];

console.log('Testing dynamic translations...');
let passed = 0;
for (const [pl, expected] of testDynamic) {
  const actual = window.t(pl);
  assert.strictEqual(actual, expected, `Failed translation for: '${pl}'. Got: '${actual}', Expected: '${expected}'`);
  passed++;
}
console.log(`✓ Passed all ${passed} dynamic pattern translations!`);

// 4. Test target names from user image & minigames
const targets = [
  ["🥩 Soczysta kiełbasa", "🥩 Juicy Sausage"],
  ["🦴 Smakowita kość", "🦴 Tasty Bone"],
  ["🎾 Żółta piłeczka", "🎾 Yellow Ball"],
  ["WĘCH WYKRYTY! (20 km)", "SCENT DETECTED! (12.4 mi)"],
  ["NE (73% sukcesu)", "NE (73% success)"],
  ["UKRYTY (100%)", "HIDDEN (100%)"],
  ["WIDOCZNY!", "VISIBLE!"],
  ["WYKRYTO DRGANIA ŻUCHWĄ!", "JAW SEISMIC VIBRATIONS DETECTED!"],
  ["💨 Zawieja śnieżna: 35 km/h →", "💨 Snow blizzard: 35 km/h →"],
  ["Strach! LUDZIE! ⚠️", "Fear! HUMANS! ⚠️"],
  ["Węszy...", "Sniffing..."],
  ["Ruch (ryzyko!)", "Movement (risk!)"],
  ["Zastygnięcie (bezpiecznie)", "Freezing (safe)"],
  ["Ultrafiolet UV 🟣 (Ślady widoczne)", "Ultraviolet UV 🟣 (Tracks visible)"],
  ["Pancerz / Kula 🛡️", "Armor / Ball 🛡️"],
  ["⚡ Ampułki (Elektryczność)", "⚡ Ampullae (Electricity)"],
  ["👁️ Zwykły wzrok", "👁️ Normal vision"],
  ["🏆 MISTRZ PRZETRWANIA JEŻA!", "🏆 HEDGEHOG SURVIVAL MASTER!"],
  ["🏆 WŁADCA OCEANICZNEGO SONARU!", "🏆 MASTER OF OCEANIC SONAR!"],
  ["🏆 WŁADCA POLSKIEGO NIEBA!", "🏆 RULER OF THE POLISH SKIES!"],
  ["GRATULACJE! Władca Głębinowego Kamuflażu!", "CONGRATULATIONS! Master of Deep-Sea Camouflage!"],
  ["GRATULACJE! Władca Zmysłów Oceanu!", "CONGRATULATIONS! Master of Ocean Senses!"]
];

for (const [pl, expected] of targets) {
  const actual = window.t(pl);
  assert.strictEqual(actual, expected, `Failed dictionary translation for: '${pl}'. Got: '${actual}'`);
}
console.log(`✓ Passed all ${targets.length} target and HUD dictionary translations!`);

// 5. Test switching back to Polish
window.i18n.setLanguage('pl');
assert.strictEqual(window.i18n.currentLang, 'pl');
for (const [pl] of testDynamic) {
  const actual = window.t(pl);
  assert.strictEqual(actual, pl, `PL mode altered original text: got '${actual}', expected '${pl}'`);
}
for (const [pl] of targets) {
  const actual = window.t(pl);
  assert.strictEqual(actual, pl, `PL mode altered original text: got '${actual}', expected '${pl}'`);
}
console.log('✓ PL mode preserves 100% of original Polish strings identical without modifications!');

console.log('\n======================================================');
console.log('🎉 ALL NODE.JS i18n & SIMULATOR TESTS PASSED WITH 100% SUCCESS!');
console.log('======================================================');
