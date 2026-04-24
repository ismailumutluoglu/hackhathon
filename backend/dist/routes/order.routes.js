"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_controller_1 = require("../controllers/order.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/', order_controller_1.getUserOrders);
router.post('/', order_controller_1.createOrder);
router.get('/:id', order_controller_1.getOrder);
router.patch('/:id/cancel', order_controller_1.cancelOrder);
router.get('/admin/all', auth_middleware_1.adminMiddleware, order_controller_1.getAllOrders);
router.patch('/admin/:id/status', auth_middleware_1.adminMiddleware, order_controller_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=order.routes.js.map