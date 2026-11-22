
const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const paymentsController = require("../controllers/paymentsController");

router.post(
    "/checkout/:orderId",
    requireAuth,
    paymentsController.createCheckout
);

router.get(
    "/session/:sessionId",
    requireAuth,
    paymentsController.getPaymentSession
);

module.exports = router;
