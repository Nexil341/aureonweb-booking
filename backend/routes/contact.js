const express = require("express");
const rateLimit = require("express-rate-limit");

const validate = require("../middlewares/validate");
const { contactSchema } = require("../validators/contactSchema");
const contactController = require("../controllers/contactController");

const router = express.Router();

// Ostry limit: formularz bez logowania to łatwy cel dla spamu.
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 godzina
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        error: "Zbyt wiele wiadomości. Spróbuj ponownie za godzinę."
    }
});

router.post(
    "/",
    contactLimiter,
    validate(contactSchema),
    contactController.sendContactMessage
);

module.exports = router;