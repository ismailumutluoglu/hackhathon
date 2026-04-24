"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.adminMiddleware = adminMiddleware;
exports.adminOrProducerMiddleware = adminOrProducerMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const error_middleware_1 = require("./error.middleware");
async function authMiddleware(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new error_middleware_1.AppError('Oturum açmanız gerekiyor.', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
        const user = await User_1.User.findById(decoded.id).select('_id role isActive');
        if (!user || !user.isActive) {
            throw new error_middleware_1.AppError('Kullanıcı bulunamadı veya hesap aktif değil.', 401);
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    }
    catch (err) {
        if (err instanceof error_middleware_1.AppError)
            return next(err);
        next(new error_middleware_1.AppError('Geçersiz veya süresi dolmuş token.', 401));
    }
}
function adminMiddleware(req, _res, next) {
    if (req.userRole !== 'admin') {
        return next(new error_middleware_1.AppError('Bu işlem için admin yetkisi gerekiyor.', 403));
    }
    next();
}
function adminOrProducerMiddleware(req, _res, next) {
    if (req.userRole !== 'admin' && req.userRole !== 'producer' && req.userRole !== 'customer') {
        return next(new error_middleware_1.AppError('Bu işlem için giriş yapmış kullanıcı olmanız gerekiyor.', 403));
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map