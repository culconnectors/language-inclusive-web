/**
 * Maps language names to their corresponding ISO country codes
 * @type {Record<string, string>}
 */
export const languageToCountry = {
    Afrikaans: "ZA",
    Arabic: "SA",
    AIndLng: "IN",
    Canton: "HK",
    Mandarin: "CN",
    Croatian: "HR",
    French: "FR",
    German: "DE",
    Greek: "GR",
    Bengali: "BD",
    Guj: "IN",
    Hindi: "IN",
    Nepali: "NP",
    Punjabi: "PK",
    Sinhal: "LK",
    Urdu: "PK",
    Italian: "IT",
    Japan: "JP",
    Khmer: "KH",
    Korean: "KR",
    Macedon: "MK",
    Malayalam: "IN",
    Persian: "IR",
    Polish: "PL",
    Portuguese: "PT",
    Russian: "RU",
    Samoan: "WS",
    Serbian: "RS",
    Filipin: "PH",
    Indon: "ID",
    Tagalog: "PH",
    Spanish: "ES",
    Tamil: "IN",
    Thai: "TH",
    Turkish: "TR",
    Vietnamese: "VN",
};

/**
 * Maps ISO country codes to their flag color arrays
 * @type {Record<string, string[]>}
 */
export const flagColors = {
    CN: ["#DE2910", "#FFDE00"],
    DE: ["#000000", "#FFCE00"],
    FR: ["#0055A4", "#EF4135"],
    IN: ["#138808", "#FF9933"],
    IT: ["#008C45", "#CD212A"],
    JP: ["#FFFFFF", "#BC002D"],
    KR: ["#C60C30", "#003478"],
    SA: ["#006C35", "#FFFFFF"],
    ZA: ["#006847", "#FFB612"],
    HK: ["#DE2910", "#FFFFFF"],
    HR: ["#0000FF", "#FF0000"],
    GR: ["#0D5EAF", "#FFFFFF"],
    BD: ["#006A4E", "#F42A41"],
    NP: ["#BE1E2D", "#003893"],
    PK: ["#01411C", "#FFFFFF"],
    LK: ["#800000", "#FFB612"],
    PL: ["#DC143C", "#FFFFFF"],
    PT: ["#FF0000", "#006600"],
    RU: ["#0039A6", "#D52B1E"],
    ES: ["#AA151B", "#F1BF00"],
    TH: ["#DC241F", "#003478"],
    TR: ["#E30A17", "#FFFFFF"],
    VN: ["#DA251D", "#FFFF00"],
    PH: ["#CE1126", "#0038A8"],
    ID: ["#FF0000", "#FFFFFF"],
    RS: ["#0000C8", "#FF0000"],
    WS: ["#D21034", "#00205B"],
    MK: ["#FF0000", "#FFDA44"],
    KH: ["#ED1B24", "#032EA1"],
};

/**
 * Maps language names to their native script or display names
 * @type {Record<string, string>}
 */
export const nativeNames = {
    Afrikaans: "Afrikaans",
    Arabic: "العربية",
    AIndLng: "Aboriginal Torrest Strait Islander",
    Canton: "廣東話",
    Mandarin: "中文",
    Croatian: "hrvatski",
    French: "Français",
    German: "Deutsch",
    Greek: "Ελληνικά",
    Bengali: "বাংলা",
    Guj: "ગુજરાતી",
    Hindi: "हिन्दी",
    Nepali: "नेपाली",
    Punjabi: "ਪੰਜਾਬੀ",
    Sinhal: "සිංහල",
    Urdu: "اردو",
    Italian: "Italiano",
    Japan: "日本語",
    Khmer: "ភាសាខ្មែរ",
    Korean: "한국어",
    Macedon: "македонски",
    Malayalam: "മലയാളം",
    Persian: "فارسی",
    Polish: "Polski",
    Portuguese: "Português",
    Russian: "Русский",
    Samoan: "Gagana Samoa",
    Serbian: "српски",
    Filipin: "Filipino",
    Indon: "Bahasa Indonesia",
    Tagalog: "Tagalog",
    Spanish: "Español",
    Tamil: "தமிழ்",
    Thai: "ไทย",
    Turkish: "Türkçe",
    Vietnamese: "Tiếng Việt",
};
