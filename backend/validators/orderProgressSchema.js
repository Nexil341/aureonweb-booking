const { z } = require("zod");

// Aktualizacja postępu realizacji projektu.
const orderProgressSchema = z.strictObject({
    status: z.enum([
        "NEW",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
    ]),
    progress: z.number().int().min(0).max(100),
    stage: z.number().int().min(0).max(5),
    deadline: z.iso.datetime().nullable()
}).superRefine((data, ctx) => {
    if (data.status === "COMPLETED" && data.progress !== 100) {
        ctx.addIssue({
            code: "custom",
            path: ["progress"],
            message: "Ukończony projekt musi mieć 100% postępu"
        });
    }
});

module.exports = { orderProgressSchema };