"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.get('/profile', user_controller_1.getProfile);
router.patch('/profile', user_controller_1.updateProfile);
router.patch('/health-profile', user_controller_1.updateHealthProfile);
router.post('/addresses', user_controller_1.addAddress);
router.patch('/addresses/:id', user_controller_1.updateAddress);
router.delete('/addresses/:id', user_controller_1.deleteAddress);
exports.default = router;
//# sourceMappingURL=user.routes.js.map