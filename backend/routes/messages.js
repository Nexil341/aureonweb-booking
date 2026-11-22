const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");

const upload = require("../middlewares/messageUpload");

const messagesController = require("../controllers/messagesController");

router.use(requireAuth);

router.get(
    "/admin/conversations",
    requireAdmin,
    messagesController.getConversations
);

router.get(
    "/attachments/:attachmentId",
    messagesController.getAttachment
);

router.get(
    "/orders/:orderId",
    messagesController.getMessages
);

router.post(
    "/orders/:orderId",
    (req, res, next) => {
        const contentType =
            req.headers["content-type"] || "";

        if (
            !contentType.startsWith(
                "multipart/form-data"
            )
        ) {
            return next();
        }

        upload.array("images", 4)(
            req,
            res,
            (error) => {
                if (error) {
                    return res.status(400).json({
                        error:
                            error.code === "LIMIT_FILE_SIZE"
                                ? "Zdjęcie nie może przekraczać 5 MB"
                                : error.message,
                    });
                }

                next();
            }
        );
    },
    messagesController.sendMessage
);

module.exports = router;