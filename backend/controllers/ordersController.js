
const ordersService = require("../services/ordersService");

const createOrder = async (req, res, next) => {
    try {
        const order = await ordersService.createOrder(
            req.body,
            req.user
        );

        return res.status(201).json({
            message: "Zamówienie utworzone",
            order
        });
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Niepoprawne ID zamówienia"
            });
        }

        const order = await ordersService.getOrderById(
            id,
            req.user
        );

        if (!order) {
            return res.status(404).json({
                message: "Nie znaleziono zamówienia"
            });
        }

        return res.status(200).json({ order });
    } catch (error) {
        next(error);
    }
};


const getMyOrders = async (req, res, next) => {
    try {
        const orders = await ordersService.getMyOrders(
            req.user.id
        );

        return res.status(200).json({ orders });
    } catch (error) {
        next(error);
    }
};


module.exports = { createOrder, getOrderById, getMyOrders };
