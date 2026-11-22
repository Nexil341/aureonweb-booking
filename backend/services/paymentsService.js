
const prisma = require("../config/prisma");
const stripe = require("../config/stripe");

const FRONTEND_URL = (
    process.env.FRONTEND_URL || "http://localhost:3000"
).replace(/\/$/, "");

const createError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const createCheckoutSession = async (orderId, user) => {
    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        throw createError("Nieprawidłowe ID zamówienia");
    }

    const order = await prisma.orders.findUnique({
        where: { id: orderId }
    });

    if (!order) {
        throw createError("Nie znaleziono zamówienia", 404);
    }

    if (order.userId !== user.id) {
        throw createError("Brak dostępu do zamówienia", 403);
    }

    if (order.payment_status !== "PENDING") {
        throw createError(
            "Zamówienie nie oczekuje na płatność",
            409
        );
    }

    if (order.order_status === "CANCELLED") {
        throw createError("Zamówienie anulowane", 409);
    }

    if (
        !Number.isSafeInteger(order.price) ||
        order.price <= 0
    ) {
        throw createError(
            "Nieprawidłowa kwota zamówienia",
            409
        );
    }

    // Ponowne wykorzystanie istniejącej sesji
    if (order.stripe_checkout_session_id) {
        const existing = await stripe.checkout.sessions.retrieve(
            order.stripe_checkout_session_id
        );

        if (
            existing.status === "open" &&
            existing.url
        ) {
            return {
                url: existing.url,
                sessionId: existing.id
            };
        }

        if (existing.status === "complete") {
            throw createError(
                "Płatność została zakończona lub jest przetwarzana",
                409
            );
        }
    }

    const session = await stripe.checkout.sessions.create(
        {
            mode: "payment",

            customer_email: order.customer_email,

            client_reference_id: String(order.id),

            line_items: [
                {
                    price_data: {
                        currency: "pln",
                        unit_amount: order.price,
                        product_data: {
                            name:
                                `AUREONWEB - ${order.package.toUpperCase()}`,
                            description:
                                "Realizacja projektu strony internetowej"
                        }
                    },
                    quantity: 1
                }
            ],

            metadata: {
                orderId: String(order.id),
                userId: user.id
            },

            success_url:
                `${FRONTEND_URL}/pl/zamowienie/sukces` +
                `?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
                `${FRONTEND_URL}/pl/moje-zamowienia` +
                `?payment=cancelled`
        },
        {
            // Ponowienie tego samego żądania nie powinno
            // tworzyć drugiej sesji przy problemach z siecią.
            idempotencyKey:
                `aureonweb_checkout_${order.id}_${order.stripe_checkout_session_id || "initial"}`
        }
    );

    if (!session.url) {
        throw createError(
            "Stripe nie zwrócił adresu płatności",
            502
        );
    }

    await prisma.orders.update({
        where: { id: order.id },
        data: {
            stripe_checkout_session_id: session.id
        }
    });

    return {
        url: session.url,
        sessionId: session.id
    };
};

const handleCheckoutCompleted = async (session) => {
    if (session.payment_status !== "paid") {
        return;
    }

    const rawOrderId = session.metadata?.orderId;

    if (!rawOrderId) {
        console.log(
            `[STRIPE] Pominięto sesję ${session.id} — brak orderId`
        );
        return;
    }

    const orderId = Number(rawOrderId);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        throw new Error("Niepoprawne ID zamówienia w webhooku");
    }

    const order = await prisma.orders.findUnique({
        where: { id: orderId }
    });

    if (!order) {
        throw new Error(
            `Zamówienie #${orderId} nie istnieje`
        );
    }

    if (
        session.id !== order.stripe_checkout_session_id ||
        session.currency?.toLowerCase() !== "pln" ||
        session.amount_total !== order.price ||
        session.client_reference_id !== String(order.id)
    ) {
        throw new Error(
            "Niezgodność danych płatności Stripe"
        );
    }

    const paymentIntentId =
        typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

    // Aktualizacja tylko zamówień oczekujących
    const result = await prisma.orders.updateMany({
        where: {
            id: orderId,
            payment_status: "PENDING",
            stripe_checkout_session_id: session.id
        },
        data: {
            payment_status: "PAID",
            stripe_payment_intent_id: paymentIntentId,
            paid_at: new Date()
        }
    });

    if (result.count === 1) {
        console.log(
            `[STRIPE] Opłacono zamówienie #${orderId}`
        );
    }
};

module.exports = {
    createCheckoutSession,
    handleCheckoutCompleted
};
