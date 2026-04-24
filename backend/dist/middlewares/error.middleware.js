"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.errorMiddleware = errorMiddleware;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
        return;
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        res.status(400).json({ success: false, message: `Bu ${field} zaten kullanımda.` });
        return;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        res.status(400).json({ success: false, message: messages.join(', ') });
        return;
    }
    console.error('Beklenmeyen hata:', err);
    res.status(500).json({ success: false, message: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.' });
}
//# sourceMappingURL=error.middleware.js.map