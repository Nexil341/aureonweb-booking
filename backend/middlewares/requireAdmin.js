
const requireAdmin = (req, res, next) => {
    // Użytkownik musi być zalogowany
    if (!req.user) {
        return res.status(401).json({
            message: "Musisz być zalogowany"
        });
    }

    // Sprawdzenie roli pobranej z bazy
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Brak uprawnień administratora"
        });
    }

    next();
};

module.exports = requireAdmin;
