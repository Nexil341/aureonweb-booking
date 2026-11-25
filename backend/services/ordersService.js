
const ordersRepository = require("../repositories/ordersRepository");

// Ceny pakietów w groszach
const PACKAGE_PRICES = {
    basic: 9999,
    standard: 19999,
    premium: 39999,
};

const SEO_PRICE = 9900;
const HOSTING_MONTHLY_PRICE = 5000;

const createError = (message, status = 400) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const createOrder = async (orderData, user) => {
    const selectedPackage = orderData.package;

    // Sprawdzenie pakietu
    if (!Object.hasOwn(PACKAGE_PRICES, selectedPackage)) {
        throw createError("Nieprawidłowy pakiet");
    }

    // Sprawdzenie dodatków
    if (
        typeof orderData.hosting !== "boolean" ||
        typeof orderData.seo !== "boolean"
    ) {
        throw createError("Nieprawidłowe opcje dodatkowe");
    }

    // Dane projektu
    const businessName = orderData.business_name?.trim();
    const description = orderData.description?.trim();
    const contactEmail = orderData.contact_email?.trim();
    const inspiration = orderData.inspiration?.trim() || null;

    if (
        typeof businessName !== "string" ||
        businessName.length < 2 ||
        businessName.length > 150
    ) {
        throw createError("Nieprawidłowa nazwa firmy");
    }

    if (
        typeof description !== "string" ||
        description.length < 20 ||
        description.length > 5000
    ) {
        throw createError("Opis musi mieć od 20 do 5000 znaków");
    }

    if (
        typeof contactEmail !== "string" ||
        contactEmail.length > 255 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
    ) {
        throw createError("Nieprawidłowy adres e-mail");
    }

    if (inspiration) {
        if (inspiration.length > 2000) {
            throw createError("Link do inspiracji jest za długi");
        }

        try {
            const url = new URL(inspiration);

            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error("Nieprawidłowy protokół");
            }
        } catch {
            throw createError("Nieprawidłowy link do inspiracji");
        }
    }

    // Cena obliczana wyłącznie na backendzie
    const packagePrice = PACKAGE_PRICES[selectedPackage];
    const seoPrice = orderData.seo ? SEO_PRICE : 0;

    const price = packagePrice + seoPrice;

    // Hosting rozliczymy osobną subskrypcją
    const hostingMonthlyPrice = orderData.hosting
        ? HOSTING_MONTHLY_PRICE
        : 0;

    const order = await ordersRepository.createOrder({
        customer_name: user.name,
        customer_email: user.email,
        selectedPackage,
        website_type: null,
        hosting: orderData.hosting,
        seo: orderData.seo,
        business_name: businessName,
        description,
        inspiration,
        contact_email: contactEmail,
        price,
        userId: user.id,
    });

    return {
        ...order,
        hosting_monthly_price: hostingMonthlyPrice,
    };
};

const getOrderById = async (id, user) => {
    const order = await ordersRepository.getOrderById(id);

    if (!order) {
        return null;
    }

    if (order.userId !== user.id && user.role !== "ADMIN") {
        throw createError("Brak dostępu do zamówienia", 403);
    }

    return order;
};

const getMyOrders = async (userId) => {
    return ordersRepository.getMyOrders(userId);
};

const getAllOrders = async () => {
    return ordersRepository.getAllOrders();
};

// Statusy, które wymagają opłaconego zamówienia.
const STATUSES_REQUIRING_PAYMENT = ["IN_PROGRESS", "COMPLETED"];

const updateOrderStatus = async (id, status) => {
    const order = await ordersRepository.getOrderById(id);

    if (!order) {
        throw createError("Nie znaleziono zamówienia", 404);
    }

    // Ta sama reguła co w updateOrderProgress:
    // nie zaczynamy ani nie kończymy pracy bez płatności.
    if (
        STATUSES_REQUIRING_PAYMENT.includes(status) &&
        order.payment_status !== "PAID"
    ) {
        throw createError(
            "Nie można zmienić statusu nieopłaconego zamówienia na realizowane lub ukończone",
            409
        );
    }

    return ordersRepository.updateOrderStatus(id, status);
};

const getOrderStats = async () => {
    return ordersRepository.getOrderStats();
};

const updateOrderProgress = async (id, data) => {
    const order = await ordersRepository.getOrderById(id);

    if (!order) {
        throw createError("Nie znaleziono zamówienia", 404);
    }

    if (order.payment_status !== "PAID") {
        throw createError(
            "Nie można rozpocząć realizacji nieopłaconego zamówienia",
            409
        );
    }

    return ordersRepository.updateOrderProgress(id, {
        order_status: data.status,
        progress: data.progress,
        stage: data.stage,
        deadline: data.deadline ? new Date(data.deadline) : null
    });
};

module.exports = {
    createOrder,
    getOrderById,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
    updateOrderProgress,
};
