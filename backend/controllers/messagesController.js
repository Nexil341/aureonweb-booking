
const prisma = require("../config/prisma");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");
const { randomUUID } = require("crypto");

const UPLOAD_DIR = path.resolve(
    __dirname,
    "../uploads/messages"
);

const parseOrderId = (value) => {
    const id = Number(value);

    return Number.isSafeInteger(id) && id > 0
        ? id
        : null;
};

const checkOrderAccess = async (orderId, user) => {
    const order = await prisma.orders.findUnique({
        where: { id: orderId },
        select: {
            id: true,
            userId: true,
            customer_name: true,
            business_name: true,
        },
    });

    if (!order) {
        const error = new Error(
            "Nie znaleziono zamówienia"
        );
        error.status = 404;
        throw error;
    }

    if (
        user.role !== "ADMIN" &&
        order.userId !== user.id
    ) {
        const error = new Error(
            "Brak dostępu do rozmowy"
        );
        error.status = 403;
        throw error;
    }

    return order;
};

const attachmentSelect = {
    id: true,
    filename: true,
    mimeType: true,
    size: true,
};

const messageSelect = {
    id: true,
    senderId: true,
    content: true,
    createdAt: true,
    attachments: {
        select: attachmentSelect,
    },
};

// GET /api/messages/orders/:orderId
exports.getMessages = async (req, res, next) => {
    try {
        const orderId = parseOrderId(
            req.params.orderId
        );

        if (!orderId) {
            return res.status(400).json({
                error: "Niepoprawne ID zamówienia",
            });
        }

        await checkOrderAccess(orderId, req.user);

        const messages =
            await prisma.orderMessage.findMany({
                where: { orderId },
                orderBy: [
                    { createdAt: "desc" },
                    { id: "desc" },
                ],
                take: 100,
                select: messageSelect,
            });

        return res.status(200).json({
            messages: messages.reverse(),
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/messages/orders/:orderId
// Obsługuje JSON oraz multipart/form-data.
exports.sendMessage = async (req, res, next) => {
    const savedFiles = [];

    try {
        const orderId = parseOrderId(
            req.params.orderId
        );

        if (!orderId) {
            return res.status(400).json({
                error: "Niepoprawne ID zamówienia",
            });
        }

        await checkOrderAccess(orderId, req.user);

        const rawContent = req.body?.content ?? "";

        if (typeof rawContent !== "string") {
            return res.status(400).json({
                error: "Niepoprawna treść wiadomości",
            });
        }

        const content = rawContent.trim();
        const files = req.files || [];

        if (content.length > 2000) {
            return res.status(400).json({
                error: "Maksymalnie 2000 znaków",
            });
        }

        if (!content && files.length === 0) {
            return res.status(400).json({
                error: "Dodaj tekst lub zdjęcie",
            });
        }

        if (files.length > 4) {
            return res.status(400).json({
                error: "Maksymalnie 4 zdjęcia",
            });
        }

        const attachments = [];

        if (files.length > 0) {
            await fs.mkdir(UPLOAD_DIR, {
                recursive: true,
            });
        }

        for (const file of files) {
            // Sprawdzamy rzeczywistą zawartość obrazu,
            // nie tylko rozszerzenie pliku.
            const image = sharp(file.buffer, {
                limitInputPixels: 40_000_000,
                failOn: "error",
            });

            const metadata = await image.metadata();

            if (
                !["jpeg", "png", "webp"].includes(
                    metadata.format
                )
            ) {
                const error = new Error(
                    "Dozwolone formaty: JPG, PNG, WebP"
                );
                error.status = 400;
                throw error;
            }

            const storageKey = `${randomUUID()}.webp`;
            const filePath = path.join(
                UPLOAD_DIR,
                storageKey
            );

            const output = await sharp(file.buffer, {
                limitInputPixels: 40_000_000,
            })
                .rotate()
                .resize({
                    width: 2400,
                    height: 2400,
                    fit: "inside",
                    withoutEnlargement: true,
                })
                .webp({
                    quality: 85,
                    effort: 4,
                })
                .toBuffer();

            await fs.writeFile(filePath, output, {
                flag: "wx",
            });

            savedFiles.push(filePath);

            attachments.push({
                filename: path.basename(
                    file.originalname
                ).slice(0, 200),
                storageKey,
                mimeType: "image/webp",
                size: output.length,
            });
        }

        const message =
            await prisma.orderMessage.create({
                data: {
                    orderId,
                    senderId: req.user.id,
                    content,
                    attachments: {
                        create: attachments,
                    },
                },
                select: messageSelect,
            });

        return res.status(201).json({
            message,
        });
    } catch (error) {
        // Jeśli zapis wiadomości się nie uda,
        // sprzątamy zapisane wcześniej pliki.
        await Promise.allSettled(
            savedFiles.map((filePath) =>
                fs.unlink(filePath)
            )
        );

        if (
            error.status === 400 ||
            error.name === "Error" &&
            /image|input buffer|unsupported|corrupt/i.test(
                error.message
            )
        ) {
            return res.status(400).json({
                error: "Niepoprawny lub nieobsługiwany obraz",
            });
        }

        next(error);
    }
};

// GET /api/messages/attachments/:attachmentId
// Prywatny dostęp do zdjęcia.
exports.getAttachment = async (req, res, next) => {
    try {
        const attachment =
            await prisma.messageAttachment.findUnique({
                where: {
                    id: req.params.attachmentId,
                },
                select: {
                    storageKey: true,
                    mimeType: true,
                    filename: true,
                    message: {
                        select: {
                            orderId: true,
                        },
                    },
                },
            });

        if (!attachment) {
            return res.status(404).json({
                error: "Nie znaleziono zdjęcia",
            });
        }

        await checkOrderAccess(
            attachment.message.orderId,
            req.user
        );

        const filePath = path.join(
            UPLOAD_DIR,
            attachment.storageKey
        );

        res.setHeader(
            "Content-Type",
            attachment.mimeType
        );

        res.setHeader(
            "Cache-Control",
            "private, no-store"
        );

        res.setHeader(
            "X-Content-Type-Options",
            "nosniff"
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename="${attachment.storageKey}"`
        );

        return res.sendFile(filePath, (error) => {
            if (error && !res.headersSent) {
                next(error);
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/messages/admin/conversations
exports.getConversations = async (
    req,
    res,
    next
) => {
    try {
        const orders = await prisma.orders.findMany({
            where: {
                messages: {
                    some: {},
                },
            },
            select: {
                id: true,
                customer_name: true,
                customer_email: true,
                business_name: true,
                messages: {
                    orderBy: [
                        { createdAt: "desc" },
                        { id: "desc" },
                    ],
                    take: 1,
                    select: {
                        content: true,
                        senderId: true,
                        createdAt: true,
                        attachments: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        const conversations = orders
            .map((order) => ({
                id: order.id,
                customer_name: order.customer_name,
                customer_email: order.customer_email,
                business_name: order.business_name,
                lastMessage: order.messages[0]
                    ? {
                        content:
                            order.messages[0].content ||
                            (order.messages[0].attachments
                                .length > 0
                                ? "📷 Zdjęcie"
                                : ""),
                        senderId:
                            order.messages[0].senderId,
                        createdAt:
                            order.messages[0].createdAt,
                    }
                    : null,
            }))
            .sort((a, b) => {
                const aTime = a.lastMessage
                    ? new Date(
                        a.lastMessage.createdAt
                    ).getTime()
                    : 0;

                const bTime = b.lastMessage
                    ? new Date(
                        b.lastMessage.createdAt
                    ).getTime()
                    : 0;

                return bTime - aTime;
            });

        return res.status(200).json({
            conversations,
        });
    } catch (error) {
        next(error);
    }
};
