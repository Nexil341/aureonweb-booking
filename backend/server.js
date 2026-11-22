
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { toNodeHandler } = require("better-auth/node");
const { auth } = require("./config/auth");

const ordersRouter = require("./routes/orders");
const adminRouter = require("./routes/admin");
const paymentsRouter = require("./routes/payments");
const paymentsController = require("./controllers/paymentsController");
const messagesRouter = require("./routes/messages");

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.disable("x-powered-by");
app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
});

app.use("/api", limiter);

// STRIPE WEBHOOK
// Musi znajdować się przed express.json().
app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    paymentsController.handleWebhook
);

// Better Auth
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON parser
app.use(express.json({ limit: "10kb" }));

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK"
    });
});

// Routes
app.use("/api/orders", ordersRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/messages", messagesRouter);

// 404
app.use((req, res) => {
    res.status(404).json({
        error: "Nie znaleziono endpointu"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);

    const status =
        Number.isInteger(err.status) &&
            err.status >= 400 &&
            err.status < 500
            ? err.status
            : 500;

    res.status(status).json({
        error:
            status === 500
                ? "Wystąpił błąd serwera"
                : err.message
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
