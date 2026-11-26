const { z } = require("zod");

const contactSchema = z.strictObject({
    name: z
        .string()
        .trim()
        .min(2, "Imię musi mieć minimum 2 znaki")
        .max(100, "Imię jest za długie"),

    email: z
        .email("Nieprawidłowy adres e-mail")
        .max(254, "Adres e-mail jest za długi"),

    projectType: z.enum([
        "website",
        "webapp",
        "automation",
        "other",
    ]),

    budget: z
        .union([
            z.enum([
                "under500",
                "500to1500",
                "1500to5000",
                "over5000",
                "unknown",
            ]),
            z.literal(""),
        ])
        .optional()
        .default(""),

    message: z
        .string()
        .trim()
        .min(10, "Wiadomość musi mieć minimum 10 znaków")
        .max(5000, "Wiadomość jest za długa"),

    // Honeypot: prawdziwy użytkownik zostawia to pole puste
    website: z.string().max(500).optional().default(""),
});

module.exports = { contactSchema };