const { z } = require("zod");

// Zmiana samego statusu (np. anulowanie nieopłaconego zamówienia).
const orderStatusSchema = z.strictObject({
    status: z.enum([
        "NEW",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
    ])
});

module.exports = { orderStatusSchema };