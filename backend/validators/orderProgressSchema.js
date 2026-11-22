const { z } = require("zod");

const orderProgressSchema = z.strictObject({
    status: z.enum([
        "NEW",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
    ]),

    progress: z.number().int().min(0).max(100),

    stage: z.number().int().min(0).max(5),

    deadline: z.string().datetime().nullable()
});

module.exports = { orderProgressSchema };