
const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");
const ordersService = require("../services/ordersService");

const validate = require("../middlewares/validate");
const { orderStatusSchema } = require("../validators/orderStatusSchema");
const { orderProgressSchema } = require("../validators/orderProgressSchema");

// Każdy endpoint administratora jest chroniony
router.use(requireAuth, requireAdmin);

// Test uprawnień
router.get("/health", (req, res) => {
    return res.status(200).json({
        message: "Panel administratora działa",
        admin: {
            id: req.user.id,
            email: req.user.email
        }
    });
});

// Wszystkie zamówienia
router.get("/orders", async (req, res, next) => {
    try {
        const orders = await ordersService.getAllOrders();

        return res.status(200).json({ orders });
    } catch (error) {
        next(error);
    }
});



router.patch(
    "/orders/:id/status",
    validate(orderStatusSchema),
    async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "Niepoprawne ID zamówienia"
                });
            }

            const order = await ordersService.updateOrderStatus(
                id,
                req.body.status
            );

            return res.status(200).json({
                message: "Status zamówienia zaktualizowany",
                order
            });
        } catch (error) {
            next(error);
        }
    }
);



router.get("/stats", async (req, res, next) => {
    try {
        const stats = await ordersService.getOrderStats();

        return res.status(200).json({ stats });
    } catch (error) {
        next(error);
    }
});

router.patch(
    "/orders/:id/progress",
    validate(orderProgressSchema),
    async (req, res, next) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isSafeInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "Niepoprawne ID zamówienia"
                });
            }

            const order = await ordersService.updateOrderProgress(
                id,
                req.body
            );

            return res.status(200).json({
                message: "Postęp projektu zaktualizowany",
                order
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
