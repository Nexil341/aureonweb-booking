const { z } = require("zod");
const {
    WEBSITE_TYPES,
    MATERIALS,
    normalizePhone,
    normalizeDomain,
    parseDesiredDeadline,
} = require("./orderFields");

const orderSchema = z.strictObject({
    package: z.enum([
        "basic",
        "standard",
        "premium",
    ]),

    hosting: z.boolean(),

    seo: z.boolean(),

    business_name: z
        .string()
        .trim()
        .min(2, "Nazwa firmy musi mieć minimum 2 znaki")
        .max(150, "Nazwa firmy jest za długa"),

    description: z
        .string()
        .trim()
        .min(20, "Opis projektu musi mieć minimum 20 znaków")
        .max(5000, "Opis projektu jest za długi"),

    contact_email: z
        .email("Nieprawidłowy adres e-mail")
        .max(255, "Adres e-mail jest za długi"),

    inspiration: z
        .union([
            z.url({ protocol: /^https?$/ }),
            z.literal(""),
        ])
        .optional()
        .default(""),

    // ===== DODATKOWE DANE ZAMÓWIENIA =====

    website_type: z
        .enum(WEBSITE_TYPES)
        .nullable()
        .optional()
        .default(null),

    // Opcjonalny. Pusty → null, niepoprawny → błąd.
    phone: z
        .string()
        .optional()
        .default("")
        .transform((value, ctx) => {
            if (value.trim() === "") return null;

            const normalized = normalizePhone(value);

            if (!normalized) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nieprawidłowy numer telefonu",
                });
                return z.NEVER;
            }

            return normalized;
        }),

    // Opcjonalna. "https://www.firma.pl/kontakt" → "firma.pl"
    domain: z
        .string()
        .max(300)
        .optional()
        .default("")
        .transform((value, ctx) => {
            const normalized = normalizeDomain(value);

            if (normalized === null) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nieprawidłowa domena",
                });
                return z.NEVER;
            }

            return normalized === "" ? null : normalized;
        }),

    // Opcjonalny, format RRRR-MM-DD, od dziś do 2 lat w przód.
    desired_deadline: z
        .string()
        .optional()
        .default("")
        .transform((value, ctx) => {
            const result = parseDesiredDeadline(value);

            if (!result.ok) {
                ctx.addIssue({
                    code: "custom",
                    message: "Nieprawidłowy termin",
                });
                return z.NEVER;
            }

            return result.value;
        }),

    // Lista bez duplikatów
    materials: z
        .array(z.enum(MATERIALS))
        .max(MATERIALS.length)
        .optional()
        .default([])
        .transform((items) => [...new Set(items)]),
});

module.exports = { orderSchema };