"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const producer_controller_1 = require("../controllers/producer.controller");
const router = (0, express_1.Router)();
router.get('/', producer_controller_1.getProducers);
router.get('/:slug', producer_controller_1.getProducer);
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, producer_controller_1.createProducer);
router.patch('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, producer_controller_1.updateProducer);
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminMiddleware, producer_controller_1.deleteProducer);
exports.default = router;
//# sourceMappingURL=producer.routes.js.map