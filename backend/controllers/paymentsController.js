
const paymentsService = require("../services/paymentsService");
const stripe = require("../config/stripe");

const createCheckout = async (req, res, next) => {
    try {
        const orderId = Number(req.params.orderId);

        if (!Number.isSafeInteger(orderId) || orderId <= 0) {
            return res.status(400).json({
                error: "Niepoprawne ID zamówienia"
            });
        }

        const result =
            await paymentsService.createCheckoutSession(
                orderId,
                req.user
            );

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const handleWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(400).send(
            "Brak podpisu lub konfiguracji webhooka"
        );
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Niepoprawny podpis Stripe:", error.message);
        return res.status(400).send("Invalid signature");
    }

    try {
        if (event.type === "checkout.session.completed") {
            await paymentsService.handleCheckoutCompleted(
                event.data.object
            );
        }

        if (
            event.type ===
            "checkout.session.async_payment_succeeded"
        ) {
            await paymentsService.handleCheckoutCompleted(
                event.data.object
            );
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error("Błąd webhooka Stripe:", error);
        return res.status(500).send("Webhook processing failed");
    }
};


const prisma = require("../config/prisma");

const getPaymentSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        if (
            typeof sessionId !== "string" ||
            !sessionId.startsWith("cs_") ||
            sessionId.length > 255
        ) {
            return res.status(400).json({
                error: "Niepoprawny identyfikator sesji"
            });
        }

        const order = await prisma.orders.findFirst({
            where: {
                stripe_checkout_session_id: sessionId,
                userId: req.user.id
            },
            select: {
                id: true,
                package: true,
                price: true,
                payment_status: true,
                order_status: true,
                paid_at: true
            }
        });

        if (!order) {
            return res.status(404).json({
                error: "Nie znaleziono płatności"
            });
        }

        return res.status(200).json({
            orderId: order.id,
            package: order.package,
            amount: order.price,
            currency: "PLN",
            paymentStatus: order.payment_status,
            orderStatus: order.order_status,
            paidAt: order.paid_at
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createCheckout,
    handleWebhook,
    getPaymentSession
};