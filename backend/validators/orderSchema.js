
const { z } = require("zod");

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
});

module.exports = { orderSchema };
