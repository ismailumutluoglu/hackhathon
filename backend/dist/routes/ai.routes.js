"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post('/recommend', ai_controller_1.getRecommendations);
router.get('/history', ai_controller_1.getHistory);
router.patch('/:id/feedback', ai_controller_1.submitFeedback);
router.get('/admin/logs', auth_middleware_1.adminMiddleware, ai_controller_1.getAdminLogs);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map