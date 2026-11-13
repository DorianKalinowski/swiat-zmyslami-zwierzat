/* ============================================================
   i18n.js — Internationalization Engine (Polish / American English)
   Author: Dorian Kalinowski for "Świat zmysłami zwierząt V1.1"
   Supports: PL (default, 100% identical) and USA (American English)
   Features: Lossless TreeWalker, localStorage persistence, URL param (?lang=en),
             Dynamic MutationObserver for interactive simulators/quizzes/modals.
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'swiat_zmyslow_lang';
  const DEFAULT_LANG = 'pl';

  // Elements to ignore when walking text nodes
  const IGNORED_TAGS = new Set([
    'SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'IFRAME', 'CANVAS', 'SVG'
  ]);

  class I18nEngine {
    constructor() {
      this.currentLang = DEFAULT_LANG;
      this.translations = window.TRANSLATIONS_EN || {};
      this.observer = null;
      this.isTranslating = false;
    }

    init() {
      // 1. Detect language
      this.currentLang = this.detectLanguage();

      // 2. Setup UI listeners
      this.bindSwitcherEvents();

      // 3. Setup MutationObserver for dynamic content (simulators, quizzes, modals)
      this.setupObserver();

      // 4. Apply language if not default (PL is native HTML)
      if (this.currentLang === 'en') {
        this.applyLanguage('en');
      } else {
        this.updateSwitcherUI('pl');
      }
    }

    detectLanguage() {
      // URL parameter takes highest priority (?lang=en, ?lang=usa, ?lang=pl)
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const param = urlParams.get('lang');
        if (param) {
          const p = param.toLowerCase();
          if (p === 'en' || p === 'usa' || p === 'us' || p === 'en-us') return 'en';
          if (p === 'pl') return 'pl';
        }
      } catch (e) {}

      // Check localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'en' || stored === 'pl') return stored;
      } catch (e) {}

      // Default is Polish (native)
      return DEFAULT_LANG;
    }

    setLanguage(lang) {
      const normalized = (lang === 'en' || lang === 'usa' || lang === 'us') ? 'en' : 'pl';
      if (this.currentLang === normalized) {
        // Just refresh UI
        this.updateSwitcherUI(normalized);
        return;
      }

      this.currentLang = normalized;
      try {
        localStorage.setItem(STORAGE_KEY, normalized);
      } catch (e) {}

      this.applyLanguage(normalized);

      // Dispatch global event for animal simulators or other JS scripts
      try {
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: normalized } }));
      } catch (e) {}
    }

    applyLanguage(lang) {
      this.isTranslating = true;
      if (this.observer) this.observer.disconnect();

      // Update HTML lang attribute
      document.documentElement.lang = (lang === 'en') ? 'en-US' : 'pl';

      // Update document title
      this.translateTitle(lang);

      // Walk DOM tree
      if (lang === 'en') {
        this.translateSubtree(document.body);
        this.translateAttributes(document.body);
      } else {
        this.restoreSubtree(document.body);
        this.restoreAttributes(document.body);
      }

      // Update Switcher UI
      this.updateSwitcherUI(lang);

      this.isTranslating = false;
      this.setupObserver();
    }

    translateTitle(lang) {
      if (!document.title) return;
      if (!this._origTitle) this._origTitle = document.title;

      if (lang === 'en') {
        const dict = window.TRANSLATIONS_EN || {};
        if (dict[this._origTitle]) {
          document.title = dict[this._origTitle];
        } else {
          // Try replacing components
          let t = this._origTitle;
          for (const [k, v] of Object.entries(dict)) {
            if (t.includes(k) && k.length > 5) {
              t = t.replace(k, v);
            }
          }
          document.title = t;
        }
      } else {
        document.title = this._origTitle;
      }
    }

    translateSubtree(root) {
      if (!root || !window.TRANSLATIONS_EN) return;
      const dict = window.TRANSLATIONS_EN;

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (IGNORED_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
            if (parent.closest('.lang-switch')) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        this.translateTextNode(node, dict);
      }
    }

    translateTextNode(node, dict) {
      // If node value has been changed dynamically by external JS to something recognized in dict or patterns
      if (node._origText === undefined || (node._origText !== node.nodeValue && (dict[node.nodeValue] || dict[node.nodeValue.trim()] || this.matchDynamicPattern(node.nodeValue.trim(), dict)))) {
        node._origText = node.nodeValue;
      }

      const raw = node._origText;
      const trimmed = raw.trim();
      if (!trimmed) return;

      // Exact match with whitespace preservation
      if (dict[raw]) {
        node.nodeValue = dict[raw];
        return;
      }

      if (dict[trimmed]) {
        const leading = raw.match(/^\s*/)[0];
        const trailing = raw.match(/\s*$/)[0];
        node.nodeValue = leading + dict[trimmed] + trailing;
        return;
      }

      // Normalized internal whitespace (collapsing multi-spaces, newlines, tabs)
      const normalized = trimmed.replace(/\s+/g, ' ');
      if (dict[normalized]) {
        const leading = raw.match(/^\s*/)[0];
        const trailing = raw.match(/\s*$/)[0];
        node.nodeValue = leading + dict[normalized] + trailing;
        return;
      }

      // Dynamic pattern matches (missions, levels, quiz counters, telemetry)
      const trans = this.matchDynamicPattern(trimmed, dict);
      if (trans) {
        const leading = raw.match(/^\s*/)[0];
        const trailing = raw.match(/\s*$/)[0];
        node.nodeValue = leading + trans + trailing;
      }
    }

    matchDynamicPattern(text, dict) {
      if (!text) return null;

      // 1. Mission / Level / Season / Stage patterns
      let m = text.match(/^Misja\s+(\d+)\s+Ukończona!$/i);
      if (m) return `Mission ${m[1]} Completed!`;

      m = text.match(/^Misja\s+(\d+)\s+ukończona!$/i);
      if (m) return `Mission ${m[1]} completed!`;

      m = text.match(/^Misja\s+(\d+)\/(\d+):?$/i);
      if (m) return `Mission ${m[1]}/${m[2]}:`;

      m = text.match(/^Poziom\s+(\d+)\s+Zwyciężony!$/i);
      if (m) return `Level ${m[1]} Victorious!`;

      m = text.match(/^Poziom\s+(\d+)\s+Zakończony Sukcesem!$/i);
      if (m) return `Level ${m[1]} Completed Successfully!`;

      m = text.match(/^Poziom\s+(\d+)\s+Ukończony!$/i);
      if (m) return `Level ${m[1]} Completed!`;

      m = text.match(/^Sukces!\s+Ukończono Misję\s+(\d+)!$/i);
      if (m) return `Success! Mission ${m[1]} Completed!`;

      m = text.match(/^Zwycięstwo!\s+Ukończono Poziom\s+(\d+)!$/i);
      if (m) return `Victory! Level ${m[1]} Completed!`;

      m = text.match(/^🎉\s*Zwycięstwo!\s+Ukończono Poziom\s+(\d+)!$/i);
      if (m) return `🎉 Victory! Level ${m[1]} Completed!`;

      m = text.match(/^🎉\s*Sukces!\s+Ukończono Misję\s+(\d+)!$/i);
      if (m) return `🎉 Success! Mission ${m[1]} Completed!`;

      m = text.match(/^🎉\s*Poziom\s+(\d+)\s+Zakończony Sukcesem!$/i);
      if (m) return `🎉 Level ${m[1]} Completed Successfully!`;

      m = text.match(/^🎉\s*Poziom\s+(\d+)\s+Ukończony!$/i);
      if (m) return `🎉 Level ${m[1]} Completed!`;

      m = text.match(/^🎉\s*Misja\s+(\d+)\s+Zrealizowana!$/i);
      if (m) return `🎉 Mission ${m[1]} Accomplished!`;

      m = text.match(/^Twój wynik:\s*(\d+)\s+z\s+(\d+)\s*\(([\d.]+)%\)$/i);
      if (m) return `Your score: ${m[1]} of ${m[2]} (${m[3]}%)`;

      m = text.match(/^Twój wynik:\s*(\d+)\s*\/\s*(\d+)\s*\(([\d.]+)%\)$/i);
      if (m) return `Your score: ${m[1]} / ${m[2]} (${m[3]}%)`;

      m = text.match(/^Twój wynik:\s*(\d+)\s+z\s+(\d+)\s+punktów\s*\(([\d.]+)%\)$/i);
      if (m) return `Your score: ${m[1]} of ${m[2]} points (${m[3]}%)`;

      m = text.match(/^Twój wynik:\s*(\d+)\s*\/\s*(\d+)$/i);
      if (m) return `Your score: ${m[1]} / ${m[2]}`;

      m = text.match(/^Twój wynik:\s*(\d+)\s+z\s+(\d+)$/i);
      if (m) return `Your score: ${m[1]} of ${m[2]}`;

      m = text.match(/^Nietoperz schwytał wszystkie\s+(\d+)\s+ciem dzięki echolokacji\.?$/i);
      if (m) return `The bat caught all ${m[1]} moths thanks to echolocation.`;

      m = text.match(/^Delfin namierzył sonarem i schwytał wszystkie\s+(\d+)\s+ryby\.?$/i);
      if (m) return `The dolphin tracked with sonar and caught all ${m[1]} fish.`;

      m = text.match(/^Orzeł namierzył i pochwycił wszystkie\s+(\d+)\s+cele z zawrotną precyzją\.?$/i);
      if (m) return `The eagle spotted and caught all ${m[1]} targets with dizzying precision.`;

      m = text.match(/^Lis złowił\s+(\d+)\s+gryzoni dzięki zmysłowi geomagnetycznemu!$/i);
      if (m) return `The fox caught ${m[1]} rodents thanks to its geomagnetic sense!`;

      m = text.match(/^Jeż zjadł\s+(\d+)\s+pożywnych owadów i zgromadził cenny zapas energii\.?$/i);
      if (m) return `The hedgehog ate ${m[1]} nutritious insects and built up a valuable energy reserve.`;

      m = text.match(/^Sowa zlokalizowała i schwytała wszystkie\s+(\d+)\s+gryzonie za pomocą szlary twarzowej\.?$/i);
      if (m) return `The owl located and captured all ${m[1]} rodents using its facial disc.`;

      m = text.match(/^Znakomicie!\s+Wytropiłeś wszystkie\s+(\d+)\s+ofiary!$/i);
      if (m) return `Splendid! You tracked down all ${m[1]} prey!`;

      m = text.match(/^Wspaniale!\s+Ukończyłeś misję,\s*zbierając\s+(\d+)\s+krabów!$/i);
      if (m) return `Wonderful! You completed the mission, gathering ${m[1]} crabs!`;

      m = text.match(/^Pszczoła napełniła wole miodowe\s*\(([\d.]+)\s*mg\)\.\s*Pasieka rośnie w siłę!$/i);
      if (m) return `The bee filled its honey stomach (${m[1]} mg). The apiary grows in strength!`;

      m = text.match(/^Niedźwiedź zgromadził wymaganą porcję kalorii\s*\(([\d.]+)\s*kcal\)\.?$/i);
      if (m) return `The bear gathered the required calorie portion (${m[1]} kcal).`;

      m = text.match(/^Pszczoła napełniła wole miodowe\s*\(([\d.]+)\s*mg\s*z\s*([\d.]+)\s*mg\)\.\s*Wracaj z tańcem wywijanym do ula!$/i);
      if (m) return `The bee filled its honey stomach (${m[1]} mg of ${m[2]} mg). Return to the hive with the waggle dance!`;

      m = text.match(/^Niedźwiedź zgromadził wymaganą porcję kalorii\s*\(([\d.]+)\s*kcal\s*z\s*([\d.]+)\s*kcal\)\.\s*Ruszaj dalej w puszczę!$/i);
      if (m) return `The bear gathered the required calorie portion (${m[1]} kcal of ${m[2]} kcal). Head deeper into the primeval forest!`;

      m = text.match(/^Uwaga!\s+Zaplątałeś się w\s*(kotwicę|porzuconą sieć widmo)!$/i);
      if (m) return m[1] === 'kotwicę' ? 'Warning! You became tangled in an anchor!' : 'Warning! You became tangled in a ghost net!';

      m = text.match(/^Upolowałeś\s+(\d+)\s+z\s+(\d+)\s+celów!$/i);
      if (m) return `You hunted ${m[1]} of ${m[2]} targets!`;

      m = text.match(/^Znalazłeś\s+(\d+)\s+trufli$/i);
      if (m) return `You found ${m[1]} truffles`;

      m = text.match(/^Sezon\s+(\d+)\s+Zakończony Sukcesem!$/i);
      if (m) return `Season ${m[1]} Completed Successfully!`;

      m = text.match(/^PYTANIE\s+(\d+)\s+Z\s+(\d+)$/);
      if (m) return `QUESTION ${m[1]} OF ${m[2]}`;

      m = text.match(/^Pytanie\s+(\d+)\s+z\s+(\d+)$/i);
      if (m) return `Question ${m[1]} of ${m[2]}`;

      m = text.match(/^Poziom\s+(\d+)$/i);
      if (m) return `Level ${m[1]}`;

      m = text.match(/^Krok\s+(\d+)\s+z\s+(\d+)$/i);
      if (m) return `Step ${m[1]} of ${m[2]}`;

      m = text.match(/^(\d+)\s*\/\s*(\d+)\s+punktów$/i);
      if (m) return `${m[1]} / ${m[2]} points`;

      m = text.match(/^(\d+)\s+z\s+(\d+)\s+celów$/i);
      if (m) return `${m[1]} of ${m[2]} targets`;

      m = text.match(/^(\d+)\s+z\s+(\d+)\s+punktów$/i);
      if (m) return `${m[1]} of ${m[2]} points`;

      m = text.match(/^(\d+)\s+z\s+(\d+)\s+pytań$/i);
      if (m) return `${m[1]} of ${m[2]} questions`;

      m = text.match(/^(\d+)\s+myszy$/i);
      if (m) return `${m[1]} mice`;

      m = text.match(/^(\d+)\s+owadów$/i);
      if (m) return `${m[1]} insects`;

      m = text.match(/^(\d+)\s+ciem$/i);
      if (m) return `${m[1]} moths`;

      m = text.match(/^(\d+)\s*trufli$/i);
      if (m) return `${m[1]} truffles`;

      // 2. Technical and sensor labels
      m = text.match(/^Różnica czasu \(ITD\):\s*([\d.]+)\s*µs\s*\|\s*Różnica głośności \(ILD\):\s*([\d.]+)\s*dB$/i);
      if (m) return `Time Difference (ITD): ${m[1]} µs | Level Difference (ILD): ${m[2]} dB`;

      m = text.match(/^Napięcie:\s*([\d.]+)\s*nV\/cm\s*•\s*Zasięg wykrywania serca:\s*([\d.]+)\s*m$/i);
      if (m) return `Voltage: ${m[1]} nV/cm • Heartbeat detection range: ${m[2]} m`;

      m = text.match(/^Zmysł:\s*Elektrorecepcja aktywna\s*\(([\d.]+)\s*nV\/cm\)$/i);
      if (m) return `Sense: Active electroreception (${m[1]} nV/cm)`;

      m = text.match(/^Tekstura:\s*(.*?)\s*\((\d+)%\)$/i);
      if (m) {
        const texTrans = dict[m[1]] || m[1];
        return `Texture: ${texTrans} (${m[2]}%)`;
      }

      m = text.match(/^Kamuflaż:\s*(\d+)%\s*\(Niewidoczna dla drapieżnika\)$/i);
      if (m) return `Camouflage: ${m[1]}% (Invisible to predators)`;

      m = text.match(/^Stan skóry:\s*(.*)$/i);
      if (m) {
        const stTrans = dict[m[1]] || m[1];
        return `Skin state: ${stTrans}`;
      }

      m = text.match(/^Wykryto zapach:\s*(.*)$/i);
      if (m) {
        const scTrans = dict[m[1]] || m[1];
        return `Scent detected: ${scTrans}`;
      }

      m = text.match(/^(\d+)°\s*względem słońca$/i);
      if (m) return `${m[1]}° relative to the sun`;

      m = text.match(/^(\d+)\s*m od ula$/i);
      if (m) return `${m[1]} m from the hive`;

      return null;
    }

    restoreSubtree(root) {
      if (!root) return;
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (IGNORED_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        if (node._origText !== undefined) {
          node.nodeValue = node._origText;
        }
      }
    }

    translateAttributes(root) {
      if (!root || !window.TRANSLATIONS_EN) return;
      const dict = window.TRANSLATIONS_EN;

      const attrs = ['placeholder', 'title', 'aria-label'];
      const elements = root.querySelectorAll(attrs.map(a => `[${a}]`).join(','));

      elements.forEach(el => {
        if (el.closest('.lang-switch')) return;

        attrs.forEach(attr => {
          const val = el.getAttribute(attr);
          if (!val) return;

          const origKey = `_orig_${attr}`;
          if (el[origKey] === undefined) {
            el[origKey] = val;
          }

          const origVal = el[origKey];
          const trimmed = origVal.trim();
          if (dict[origVal]) {
            el.setAttribute(attr, dict[origVal]);
          } else if (dict[trimmed]) {
            el.setAttribute(attr, dict[trimmed]);
          }
        });
      });
    }

    restoreAttributes(root) {
      if (!root) return;
      const attrs = ['placeholder', 'title', 'aria-label'];
      const elements = root.querySelectorAll(attrs.map(a => `[${a}]`).join(','));

      elements.forEach(el => {
        attrs.forEach(attr => {
          const origKey = `_orig_${attr}`;
          if (el[origKey] !== undefined) {
            el.setAttribute(attr, el[origKey]);
          }
        });
      });
    }

    setupObserver() {
      if (this.observer) this.observer.disconnect();

      this.observer = new MutationObserver((mutations) => {
        if (this.isTranslating || this.currentLang !== 'en') return;

        for (const mut of mutations) {
          if (mut.type === 'childList') {
            for (const added of mut.addedNodes) {
              if (added.nodeType === Node.TEXT_NODE) {
                this.translateTextNode(added, window.TRANSLATIONS_EN || {});
              } else if (added.nodeType === Node.ELEMENT_NODE) {
                if (!IGNORED_TAGS.has(added.tagName) && !added.closest('.lang-switch')) {
                  this.translateSubtree(added);
                  this.translateAttributes(added);
                }
              }
            }
          } else if (mut.type === 'characterData') {
            const target = mut.target;
            if (target && target.parentElement && !IGNORED_TAGS.has(target.parentElement.tagName)) {
              if (!target.closest?.('.lang-switch')) {
                // If text changed dynamically by JS
                if (target._lastTranslated !== target.nodeValue) {
                  this.translateTextNode(target, window.TRANSLATIONS_EN || {});
                  target._lastTranslated = target.nodeValue;
                }
              }
            }
          }
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    updateSwitcherUI(lang) {
      const switchers = document.querySelectorAll('.lang-switch');
      switchers.forEach(sw => {
        const btns = sw.querySelectorAll('.lang-btn');
        btns.forEach(btn => {
          const btnLang = btn.dataset.lang;
          const isActive = (btnLang === lang);
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      });
    }

    bindSwitcherEvents() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (!btn) return;
        const targetLang = btn.dataset.lang;
        if (targetLang) {
          e.preventDefault();
          this.setLanguage(targetLang);
        }
      });
    }

    // Translation helper for JS code: i18n.t("Tekst")
    t(key) {
      if (!key || typeof key !== 'string') return key;
      if (this.currentLang === 'en' && window.TRANSLATIONS_EN) {
        const dict = window.TRANSLATIONS_EN;
        if (dict[key]) return dict[key];
        const trimmed = key.trim();
        if (dict[trimmed]) return dict[trimmed];
        const normalized = trimmed.replace(/\s+/g, ' ');
        if (dict[normalized]) return dict[normalized];
        const pat = this.matchDynamicPattern(trimmed, dict);
        if (pat) return pat;
      }
      return key;
    }
  }

  // Instantiate and expose globally
  window.i18n = new I18nEngine();
  window.t = function (key) {
    return window.i18n ? window.i18n.t(key) : key;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.i18n.init());
  } else {
    window.i18n.init();
  }
})();
