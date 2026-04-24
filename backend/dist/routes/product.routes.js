"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const product_controller_1 = require("../controllers/product.controller");
const router = (0, express_1.Router)();
router.get('/', product_controller_1.getProducts);
router.get('/featured', product_controller_1.getFeaturedProducts);
router.get('/campaigns', product_controller_1.getCampaignProducts);
router.get('/:slug', product_controller_1.getProduct);
router.post('/', auth_middleware_1.authMiddleware, auth_middleware_1.adminOrProducerMiddleware, product_controller_1.createProduct);
router.patch('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminOrProducerMiddleware, product_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.authMiddleware, auth_middleware_1.adminOrProducerMiddleware, product_controller_1.deleteProduct);
router.post('/:id/reviews', auth_middleware_1.authMiddleware, product_controller_1.addReview);
exports.default = router;
//# sourceMappingURL=product.routes.js.map