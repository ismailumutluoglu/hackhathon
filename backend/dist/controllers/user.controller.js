"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.updateHealthProfile = updateHealthProfile;
exports.addAddress = addAddress;
exports.updateAddress = updateAddress;
exports.deleteAddress = deleteAddress;
const User_1 = require("../models/User");
const error_middleware_1 = require("../middlewares/error.middleware");
async function getProfile(req, res, next) {
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
async function updateProfile(req, res, next) {
    try {
        const { name, phone, avatar } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.userId, { name, phone, avatar }, { new: true, runValidators: true }).select('-__v');
        res.json({ success: true, user });
    }
    catch (err) {
        next(err);
    }
}
async function updateHealthProfile(req, res, next) {
    try {
        const user = await User_1.User.findByIdAndUpdate(req.userId, { healthProfile: req.body }, { new: true, runValidators: true }).select('healthProfile');
        res.json({ success: true, healthProfile: user?.healthProfile });
    }
    catch (err) {
        next(err);
    }
}
async function addAddress(req, res, next) {
    try {
        const user = await User_1.User.findById(req.userId);
        if (!user)
            throw new error_middleware_1.AppError('Kullanıcı bulunamadı.', 404);
        // İlk adres otomatik varsayılan olsun
        if (user.addresses.length === 0)
            req.body.isDefault = true;
        user.addresses.push(req.body);
        await user.save();
        res.status(201).json({ success: true, addresses: user.addresses });
    }
    catch (err) {
        next(err);
    }
}
async function updateAddress(req, res, next) {
    try {
        const user = await User_1.User.findById(req.userId);
        if (!user)
            throw new error_middleware_1.AppError('Kullanıcı bulunamadı.', 404);
        const addr = user.addresses.find((a) => a._id?.toString() === req.params.id);
        if (!addr)
            throw new error_middleware_1.AppError('Adres bulunamadı.', 404);
        Object.assign(addr, req.body);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    }
    catch (err) {
        next(err);
    }
}
async function deleteAddress(req, res, next) {
    try {
        const user = await User_1.User.findById(req.userId);
        if (!user)
            throw new error_middleware_1.AppError('Kullanıcı bulunamadı.', 404);
        user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.id);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=user.controller.js.map