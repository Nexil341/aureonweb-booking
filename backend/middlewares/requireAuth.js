
const { auth } = require("../config/auth");
const { fromNodeHeaders } = require("better-auth/node");
const prisma = require("../config/prisma");

const requireAuth = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({
                message: "Musisz być zalogowany"
            });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        if (!dbUser) {
            return res.status(401).json({
                message: "Użytkownik nie istnieje"
            });
        }

        req.user = dbUser;
        req.session = session.session;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = requireAuth;
