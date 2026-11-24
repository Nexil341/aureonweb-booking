
// Wspólne reguły dla nowych pól formularza zamówienia.
// Używane zarówno w schemacie zod, jak i w serwisie zamówień.

const WEBSITE_TYPES = [
    "landing",
    "business",
    "shop",
    "booking",
    "other",
];

const MATERIALS = [
    "logo",
    "photos",
    "texts",
    "need_help",
];

// Maksymalnie ile dni w przód klient może wskazać termin.
const MAX_DEADLINE_DAYS = 730;

// Telefon: opcjonalny "+" na początku, potem cyfry, spacje,
// myślniki i nawiasy. W sumie 9–15 cyfr.
// Zwraca oczyszczony numer albo null, gdy jest niepoprawny.
const normalizePhone = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();

    if (!/^\+?[\d\s\-()]{7,25}$/.test(trimmed)) {
        return null;
    }

    const digits = trimmed.replace(/\D/g, "");

    if (digits.length < 9 || digits.length > 15) {
        return null;
    }

    return trimmed.replace(/\s+/g, " ");
};

// Domena: usuwamy protokół, "www." i ścieżkę.
// Zwraca "" dla pustej wartości (klient nie ma domeny),
// null dla niepoprawnej albo oczyszczoną domenę.
const normalizeDomain = (value) => {
    if (value === undefined || value === null) {
        return "";
    }

    if (typeof value !== "string") {
        return null;
    }

    let domain = value.trim().toLowerCase();

    if (domain === "") {
        return "";
    }

    domain = domain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split(/[/?#]/)[0];

    const valid =
        /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{1,62}$/.test(
            domain
        );

    return valid ? domain : null;
};

// Preferowany termin w formacie RRRR-MM-DD.
// Pusta wartość oznacza "bez preferencji".
// Zwraca { ok, value }, gdzie value to Date (UTC) albo null.
const parseDesiredDeadline = (input) => {
    if (
        input === undefined ||
        input === null ||
        input === ""
    ) {
        return { ok: true, value: null };
    }

    if (
        typeof input !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(input)
    ) {
        return { ok: false, value: null };
    }

    const date = new Date(`${input}T00:00:00.000Z`);

    // Odrzuca daty, które nie istnieją, np. 2026-02-31
    if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== input
    ) {
        return { ok: false, value: null };
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const max = new Date(today);
    max.setUTCDate(max.getUTCDate() + MAX_DEADLINE_DAYS);

    if (date < today || date > max) {
        return { ok: false, value: null };
    }

    return { ok: true, value: date };
};

// Usuwa duplikaty i sprawdza, czy wszystkie wartości są dozwolone.
// Zwraca tablicę albo null, gdy coś jest niepoprawne.
const normalizeMaterials = (value) => {
    if (value === undefined || value === null) {
        return [];
    }

    if (!Array.isArray(value)) {
        return null;
    }

    const unique = [...new Set(value)];

    if (
        unique.some((item) => !MATERIALS.includes(item))
    ) {
        return null;
    }

    return unique;
};

module.exports = {
    WEBSITE_TYPES,
    MATERIALS,
    MAX_DEADLINE_DAYS,
    normalizePhone,
    normalizeDomain,
    parseDesiredDeadline,
    normalizeMaterials,
};
