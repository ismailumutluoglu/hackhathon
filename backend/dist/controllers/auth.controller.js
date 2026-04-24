"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const error_middleware_1 = require("../middlewares/error.middleware");
async function register(req, res, next) {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            throw new error_middleware_1.AppError('Ad, email ve şifre zorunludur.', 400);
        const existing = await User_1.User.findOne({ email });
        if (existing)
            throw new error_middleware_1.AppError('Bu email adresi zaten kullanımda.', 400);
        const user = await User_1.User.create({ name, email, password, phone });
        const token = (0, jwt_1.signToken)(user._id.toString(), user.role);
        res.status(201).json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new error_middleware_1.AppError('Email ve şifre zorunludur.', 400);
        const user = await User_1.User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            throw new error_middleware_1.AppError('Email veya şifre hatalı.', 401);
        }
        if (!user.isActive)
            throw new error_middleware_1.AppError('Hesabınız aktif değil.', 403);
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        const token = (0, jwt_1.signToken)(user._id.toString(), user.role);
        res.json({
            success: true,
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
        });
    }
    catch (err) {
        next(err);
    }
}
async function getMe(req, res, next) {
    try {
        const user = await User_1.User.findById(req.userId).select('-__v');
        if (!user)
            throw new error_middleware_1.AppError('Kullanıcı bulunamadı.', 404);
        res.json({ success: true, user });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=auth.controller.js.map