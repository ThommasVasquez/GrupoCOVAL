"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type LocaleCode = "es" | "pt" | "en" | "fr" | "it" | "zh" | "ja";

export interface LocaleOption {
  code: LocaleCode;
  htmlLang: string;
  badge: string;
  nativeName: string;
  spanishName: string;
}

export const DEFAULT_LOCALE_OPTION: LocaleOption = {
  code: "es",
  htmlLang: "es-CO",
  badge: "ES",
  nativeName: "Español",
  spanishName: "Español",
};

export const LOCALE_OPTIONS: LocaleOption[] = [
  DEFAULT_LOCALE_OPTION,
  { code: "pt", htmlLang: "pt", badge: "PT", nativeName: "Português", spanishName: "Portugués" },
  { code: "en", htmlLang: "en", badge: "EN", nativeName: "English", spanishName: "Inglés" },
  { code: "fr", htmlLang: "fr", badge: "FR", nativeName: "Français", spanishName: "Francés" },
  { code: "it", htmlLang: "it", badge: "IT", nativeName: "Italiano", spanishName: "Italiano" },
  { code: "zh", htmlLang: "zh-CN", badge: "中", nativeName: "中文", spanishName: "Chino" },
  { code: "ja", htmlLang: "ja", badge: "日", nativeName: "日本語", spanishName: "Japonés" },
];

const LANG_STORAGE_KEY = "coval_lang_v1";
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);
const TRANSLATABLE_ATTRS = ["placeholder", "title", "aria-label"] as const;

type Dictionary = Record<string, string>;

interface LanguageContextValue {
  locale: LocaleCode;
  isLoading: boolean;
  setLocale: (next: LocaleCode) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "es",
  isLoading: false,
  setLocale: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

function isValidLocale(value: string | null): value is LocaleCode {
  return LOCALE_OPTIONS.some((item) => item.code === value);
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function translateDynamicPattern(
  normalized: string,
  dict: Dictionary,
  locale: Exclude<LocaleCode, "es">,
): string | null {
  // 1. Coincidencia exacta
  const direct = dict[normalized];
  if (direct) return direct;

  if (normalized === "(ej.") {
    const map: Record<Exclude<LocaleCode, "es">, string> = {
      pt: "(ex.",
      en: "(e.g.",
      fr: "(ex.",
      it: "(es.",
      zh: "(例如",
      ja: "(例：",
    };
    return map[locale];
  }

  if (normalized === "Soporte administrativo:") {
    const map: Record<Exclude<LocaleCode, "es">, string> = {
      pt: "Suporte administrativo:",
      en: "Administrative support:",
      fr: "Support administratif :",
      it: "Supporto amministrativo:",
      zh: "行政支持：",
      ja: "管理サポート：",
    };
    return map[locale];
  }

  // 2. Plantillas de equipos en /alquiler/[categoria]/[equipo]
  const faqMatch = normalized.match(/^¿Cómo cotizar (.+) con VT Ingequipos\?$/);
  if (faqMatch?.[1]) {
    const rawEq = faqMatch[1];
    const eq = dict[rawEq] ?? rawEq;
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: `Como solicitar orçamento para ${eq} com a VT Ingequipos?`,
      en: `How to request a quote for ${eq} with VT Ingequipos?`,
      fr: `Comment demander un devis pour ${eq} avec VT Ingequipos ?`,
      it: `Come richiedere un preventivo per ${eq} con VT Ingequipos?`,
      zh: `如何向 VT Ingequipos 咨询 ${eq} 报价？`,
      ja: `VT Ingequipos で ${eq} を見積もり依頼するには？`,
    };
    return formats[locale];
  }

  const equipDescMatch = normalized.match(
    /^(.+) forma parte de la (.+) de VT Ingequipos S\.A\.S\., disponible para alquiler, venta y soporte de mantenimiento técnico en Bogotá, Soacha y Sibaté\. Solicite disponibilidad inmediata en el \+57 316 2948000\.$/,
  );
  if (equipDescMatch?.[1] && equipDescMatch[2]) {
    const rawEq = equipDescMatch[1];
    const rawCat = equipDescMatch[2];
    const eq = dict[rawEq] ?? rawEq;
    const cat = dict[rawCat] ?? rawCat;
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: `${eq} faz parte da ${cat} da VT Ingequipos S.A.S., disponível para locação, venda e suporte de manutenção técnica em Bogotá, Soacha e Sibaté. Solicite disponibilidade imediata pelo +57 316 2948000.`,
      en: `${eq} is part of VT Ingequipos S.A.S.'s ${cat}, available for rental, sale, and technical maintenance support in Bogotá, Soacha, and Sibaté. Request immediate availability at +57 316 2948000.`,
      fr: `${eq} fait partie de la gamme ${cat} de VT Ingequipos S.A.S., disponible à la location, à la vente et avec support de maintenance technique à Bogotá, Soacha et Sibaté. Demandez la disponibilité immédiate au +57 316 2948000.`,
      it: `${eq} fa parte della ${cat} di VT Ingequipos S.A.S., disponibile per noleggio, vendita e supporto di manutenzione tecnica a Bogotá, Soacha e Sibaté. Richieda disponibilità immediata al +57 316 2948000.`,
      zh: `${eq} 属于 VT Ingequipos S.A.S. 的 ${cat}，在 Bogotá、Soacha 和 Sibaté 提供租赁、销售及技术维护支持。请致电 +57 316 2948000 查询即时库存。`,
      ja: `${eq} は VT Ingequipos S.A.S. の ${cat} に属し、Bogotá、Soacha、Sibaté にてレンタル・販売・技術メンテナンス対応可能です。即時在庫は +57 316 2948000 までお問い合わせください。`,
    };
    return formats[locale];
  }

  // 3. Contadores y botones dinámicos numéricos
  const ofMatch = normalized.match(/^(\d+) de (\d+) equipos$/);
  if (ofMatch?.[1] && ofMatch[2]) {
    const [, a, b] = ofMatch;
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: `${a} de ${b} equipamentos`,
      en: `${a} of ${b} equipment items`,
      fr: `${a} sur ${b} équipements`,
      it: `${a} di ${b} attrezzature`,
      zh: `${a} / ${b} 台设备`,
      ja: `${b}台中 ${a}台`,
    };
    return formats[locale];
  }

  const basketBtn = normalized.match(/^Solicitar cotización \((\d+)\)$/);
  if (basketBtn?.[1]) {
    const n = basketBtn[1];
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: `Solicitar orçamento (${n})`,
      en: `Request quote (${n})`,
      fr: `Demander un devis (${n})`,
      it: `Richiedi preventivo (${n})`,
      zh: `申请报价 (${n})`,
      ja: `見積りを依頼 (${n})`,
    };
    return formats[locale];
  }

  const catBtn = normalized.match(/^Catálogo \((\d+)\)$/);
  if (catBtn?.[1]) {
    const n = catBtn[1];
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: `Catálogo (${n})`,
      en: `Catalog (${n})`,
      fr: `Catalogue (${n})`,
      it: `Catalogo (${n})`,
      zh: `设备目录 (${n})`,
      ja: `カタログ (${n})`,
    };
    return formats[locale];
  }

  const yearsPlus = normalized.match(/^(\+?)(\d+)(\+?)\s+años$/);
  if (yearsPlus?.[2]) {
    const prefix = yearsPlus[1] || yearsPlus[3] ? "+" : "";
    const n = yearsPlus[2];
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: `${prefix}${n} anos`,
      en: `${prefix}${n} years`,
      fr: `${prefix}${n} ans`,
      it: `${prefix}${n} anni`,
      zh: `${prefix}${n} 年`,
      ja: `${prefix}${n} 年`,
    };
    return formats[locale];
  }

  const eqCount = normalized.match(/^(\d+)\s+equipos(\s+disponibles)?$/);
  if (eqCount?.[1]) {
    const n = eqCount[1];
    const avail = Boolean(eqCount[2]);
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: avail ? `${n} equipamentos disponíveis` : `${n} equipamentos`,
      en: avail ? `${n} equipment items available` : `${n} equipment items`,
      fr: avail ? `${n} équipements disponibles` : `${n} équipements`,
      it: avail ? `${n} attrezzature disponibili` : `${n} attrezzature`,
      zh: avail ? `${n} 台可用设备` : `${n} 台设备`,
      ja: avail ? `利用可能な機器 ${n} 台` : `${n} 台の機器`,
    };
    return formats[locale];
  }

  const seeCount = normalized.match(/^Ver los (\d+) equipos$/);
  if (seeCount?.[1]) {
    const n = seeCount[1];
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: `Ver todos os ${n} equipamentos`,
      en: `View all ${n} equipment items`,
      fr: `Voir les ${n} équipements`,
      it: `Vedi tutte le ${n} attrezzature`,
      zh: `查看全部 ${n} 台设备`,
      ja: `全 ${n} 台の機器を見る`,
    };
    return formats[locale];
  }

  const elementMatch = normalized.match(/^Elemento\s+(\d+)$/);
  if (elementMatch?.[1]) {
    const n = elementMatch[1];
    const formats: Record<Exclude<LocaleCode, "es">, string> = {
      pt: `Elemento ${n}`,
      en: `Element ${n}`,
      fr: `Élément ${n}`,
      it: `Elemento ${n}`,
      zh: `构件 ${n}`,
      ja: `部材 ${n}`,
    };
    return formats[locale];
  }

  // 4. Composición con separadores comunes (" · " y " | ")
  if (normalized.includes(" | ")) {
    const parts = normalized.split(" | ");
    const mapped = parts.map((p) => translateDynamicPattern(p.trim(), dict, locale) ?? p.trim());
    if (mapped.some((m, i) => m !== (parts[i] ?? "").trim())) {
      return mapped.join(" | ");
    }
  }

  if (normalized.includes(" · ")) {
    const parts = normalized.split(" · ");
    const mapped = parts.map((p) => translateDynamicPattern(p.trim(), dict, locale) ?? p.trim());
    if (mapped.some((m, i) => m !== (parts[i] ?? "").trim())) {
      return mapped.join(" · ");
    }
  }

  return null;
}

function translateRawPreserveSpace(
  raw: string,
  dict: Dictionary,
  locale: Exclude<LocaleCode, "es">,
): string | null {
  const leading = raw.match(/^\s*/)?.[0] ?? "";
  const trailing = raw.match(/\s*$/)?.[0] ?? "";
  const normalized = normalizeText(raw);
  if (normalized.length < 2) return null;

  const translated = translateDynamicPattern(normalized, dict, locale);
  if (!translated) return null;
  return `${leading}${translated}${trailing}`;
}

function isIgnoredElement(el: Element | null): boolean {
  let curr: Element | null = el;
  while (curr) {
    if (SKIP_TAGS.has(curr.tagName)) return true;
    if (curr.getAttribute("data-no-translate") === "true") return true;
    curr = curr.parentElement;
  }
  return false;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<LocaleCode>("es");
  const [isLoading, setIsLoading] = useState(false);

  const dictCacheRef = useRef<Partial<Record<Exclude<LocaleCode, "es">, Dictionary>>>({});
  const originalTextMapRef = useRef(new WeakMap<Text, string>());
  const lastAppliedTextMapRef = useRef(new WeakMap<Text, string>());
  const originalAttrMapRef = useRef(new WeakMap<Element, Record<string, string>>());
  const lastAppliedAttrMapRef = useRef(new WeakMap<Element, Record<string, string>>());
  const originalTitleRef = useRef<string | null>(null);
  const lastAppliedTitleRef = useRef<string | null>(null);
  const isApplyingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const applyDomTranslation = useCallback(
    (targetLocale: LocaleCode, dict?: Dictionary) => {
      if (typeof document === "undefined") return;
      isApplyingRef.current = true;

      try {
        const option =
          LOCALE_OPTIONS.find((item) => item.code === targetLocale) ?? DEFAULT_LOCALE_OPTION;
        document.documentElement.lang = option.htmlLang;
        document.documentElement.setAttribute("data-lang", targetLocale);

        // Título de pestaña (<title>)
        if (targetLocale === "es") {
          if (originalTitleRef.current && document.title !== originalTitleRef.current) {
            document.title = originalTitleRef.current;
            lastAppliedTitleRef.current = null;
          }
        } else if (dict) {
          if (!originalTitleRef.current || lastAppliedTitleRef.current !== document.title) {
            originalTitleRef.current = document.title;
          }
          const nextTitle = translateDynamicPattern(
            normalizeText(originalTitleRef.current),
            dict,
            targetLocale,
          );
          if (nextTitle && document.title !== nextTitle) {
            document.title = nextTitle;
            lastAppliedTitleRef.current = nextTitle;
          }
        }

        // Recorrido seguro por nodos Text sin envolver ni alterar el árbol DOM de React
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let currentNode: Node | null = walker.nextNode();
        while (currentNode) {
          const textNode = currentNode as Text;
          currentNode = walker.nextNode();

          if (isIgnoredElement(textNode.parentElement)) continue;
          const currentVal = textNode.nodeValue ?? "";
          if (!currentVal.trim()) continue;

          if (targetLocale === "es") {
            const orig = originalTextMapRef.current.get(textNode);
            if (orig !== undefined && currentVal !== orig) {
              textNode.nodeValue = orig;
            }
            lastAppliedTextMapRef.current.delete(textNode);
          } else if (dict) {
            const prevOrig = originalTextMapRef.current.get(textNode);
            const lastApplied = lastAppliedTextMapRef.current.get(textNode);
            if (prevOrig === undefined || (lastApplied !== undefined && lastApplied !== currentVal)) {
              originalTextMapRef.current.set(textNode, currentVal);
            }
            const source = originalTextMapRef.current.get(textNode) ?? currentVal;
            const translated = translateRawPreserveSpace(source, dict, targetLocale);
            if (translated && translated !== currentVal) {
              textNode.nodeValue = translated;
              lastAppliedTextMapRef.current.set(textNode, translated);
            } else if (!translated) {
              lastAppliedTextMapRef.current.set(textNode, currentVal);
            }
          }
        }

        // Atributos accesibles y placeholders
        const attrEls = document.querySelectorAll(
          "[placeholder], [title], [aria-label]",
        );
        attrEls.forEach((el) => {
          if (isIgnoredElement(el)) return;
          for (const attr of TRANSLATABLE_ATTRS) {
            const currentAttr = el.getAttribute(attr);
            if (!currentAttr || !currentAttr.trim()) continue;

            const origStore = originalAttrMapRef.current.get(el) ?? {};
            const lastStore = lastAppliedAttrMapRef.current.get(el) ?? {};

            if (targetLocale === "es") {
              if (origStore[attr] !== undefined && currentAttr !== origStore[attr]) {
                el.setAttribute(attr, origStore[attr]);
              }
              delete lastStore[attr];
              lastAppliedAttrMapRef.current.set(el, lastStore);
            } else if (dict) {
              if (
                origStore[attr] === undefined ||
                (lastStore[attr] !== undefined && lastStore[attr] !== currentAttr)
              ) {
                origStore[attr] = currentAttr;
                originalAttrMapRef.current.set(el, origStore);
              }
              const translated = translateRawPreserveSpace(
                origStore[attr],
                dict,
                targetLocale,
              );
              if (translated && translated !== currentAttr) {
                el.setAttribute(attr, translated);
                lastStore[attr] = translated;
              } else {
                lastStore[attr] = currentAttr;
              }
              lastAppliedAttrMapRef.current.set(el, lastStore);
            }
          }
        });
      } finally {
        isApplyingRef.current = false;
      }
    },
    [],
  );

  const loadAndApply = useCallback(
    async (targetLocale: LocaleCode) => {
      if (targetLocale === "es") {
        setIsLoading(false);
        applyDomTranslation("es");
        return;
      }

      const cached = dictCacheRef.current[targetLocale];
      if (cached) {
        applyDomTranslation(targetLocale, cached);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/i18n/${targetLocale}.json`, {
          cache: "force-cache",
        });
        if (!res.ok) return;
        const loaded = (await res.json()) as Dictionary;
        dictCacheRef.current[targetLocale] = loaded;
        applyDomTranslation(targetLocale, loaded);
      } catch {
        // Mantener idioma actual si falla la red
      } finally {
        setIsLoading(false);
      }
    },
    [applyDomTranslation],
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isValidLocale(saved) && saved !== "es") {
        setLocaleState(saved);
      }
    } catch {
      // Ignorar si localStorage está bloqueado
    }
  }, []);

  useEffect(() => {
    void loadAndApply(locale);
  }, [locale, pathname, loadAndApply]);

  useEffect(() => {
    if (locale === "es" || typeof MutationObserver === "undefined") return;

    const scheduleApply = () => {
      if (isApplyingRef.current) return;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const dict = dictCacheRef.current[locale];
        if (dict) {
          applyDomTranslation(locale, dict);
        }
      });
    };

    const observer = new MutationObserver(() => {
      if (!isApplyingRef.current) {
        scheduleApply();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [locale, applyDomTranslation]);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Ignorar si localStorage está restringido
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, isLoading, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}
