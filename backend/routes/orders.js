
const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/ordersController");
const requireAuth = require("../middlewares/requireAuth");
const validate = require("../middlewares/validate");
const { orderSchema } = require("../validators/orderSchema");

// Wszystkie endpointy wymagają zalogowania
router.use(requireAuth);

// Tworzenie zamówienia
router.post(
    "/",
    validate(orderSchema),
    ordersController.createOrder
);

// Lista zamówień zalogowanego klienta
router.get("/my", ordersController.getMyOrders);

// Pobieranie konkretnego zamówienia
router.get("/:id", ordersController.getOrderById);

module.exports = router;
