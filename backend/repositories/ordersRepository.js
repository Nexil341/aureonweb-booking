
const prisma = require("../config/prisma");

const createOrder = async (orderData) => {
    const {
        customer_name,
        customer_email,
        selectedPackage,
        website_type,
        hosting,
        seo,
        business_name,
        description,
        inspiration,
        contact_email,
        phone,
        domain,
        desired_deadline,
        materials,
        price,
        userId,
    } = orderData;

    return prisma.orders.create({
        data: {
            customer_name,
            customer_email,
            package: selectedPackage,
            website_type,
            hosting,
            seo,
            business_name,
            description,
            inspiration,
            contact_email,
            phone,
            domain,
            desired_deadline,
            materials,
            price,
            userId,
        },
    });
};

const getOrderById = async (id) => {
    return prisma.orders.findUnique({
        where: { id },
    });
};

const getMyOrders = async (userId) => {
    return prisma.orders.findMany({
        where: { userId },
        orderBy: {
            created_at: "desc",
        },
    });
};

const getAllOrders = async () => {
    return prisma.orders.findMany({
        orderBy: {
            created_at: "desc",
        },
    });
};

const updateOrderStatus = async (id, status) => {
    return prisma.orders.update({
        where: { id },
        data: {
            order_status: status,
        },
    });
};

const updateOrderProgress = async (id, data) => {
    return prisma.orders.update({
        where: { id },
        data: {
            order_status: data.order_status,
            progress: data.progress,
            stage: data.stage,
            deadline: data.deadline,
        },
    });
};

const getOrderStats = async () => {
    const [
        totalOrders,
        newOrders,
        inProgressOrders,
        completedOrders,
        cancelledOrders,
        paidOrders,
    ] = await Promise.all([
        prisma.orders.count(),

        prisma.orders.count({
            where: { order_status: "NEW" },
        }),

        prisma.orders.count({
            where: { order_status: "IN_PROGRESS" },
        }),

        prisma.orders.count({
            where: { order_status: "COMPLETED" },
        }),

        prisma.orders.count({
            where: { order_status: "CANCELLED" },
        }),

        prisma.orders.aggregate({
            where: { payment_status: "PAID" },
            _count: { id: true },
            _sum: { price: true },
        }),
    ]);

    return {
        totalOrders,
        newOrders,
        inProgressOrders,
        completedOrders,
        cancelledOrders,
        paidOrders: paidOrders._count.id,
        paidAmount: paidOrders._sum.price ?? 0,
    };
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
