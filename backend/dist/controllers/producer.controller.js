"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducers = getProducers;
exports.getProducer = getProducer;
exports.createProducer = createProducer;
exports.updateProducer = updateProducer;
exports.deleteProducer = deleteProducer;
const Producer_1 = require("../models/Producer");
const Product_1 = require("../models/Product");
const error_middleware_1 = require("../middlewares/error.middleware");
const slugify_1 = require("../utils/slugify");
async function getProducers(req, res, next) {
    try {
        const { city, page = 1, limit = 12 } = req.query;
        const filter = { isActive: true };
        if (city)
            filter['location.city'] = city;
        const skip = (Number(page) - 1) * Number(limit);
        const [producers, total] = await Promise.all([
            Producer_1.Producer.find(filter).skip(skip).limit(Number(limit)).select('-story -__v'),
            Producer_1.Producer.countDocuments(filter),
        ]);
        res.json({ success: true, producers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    }
    catch (err) {
        next(err);
    }
}
async function getProducer(req, res, next) {
    try {
        const producer = await Producer_1.Producer.findOne({ slug: req.params.slug, isActive: true });
        if (!producer)
            throw new error_middleware_1.AppError('Üretici bulunamadı.', 404);
        const products = await Product_1.Product.find({ producer: producer._id, isActive: true })
            .select('-reviews -__v')
            .limit(12);
        res.json({ success: true, producer, products });
    }
    catch (err) {
        next(err);
    }
}
async function createProducer(req, res, next) {
    try {
        const slug = (0, slugify_1.slugify)(req.body.name);
        const producer = await Producer_1.Producer.create({ ...req.body, slug });
        res.status(201).json({ success: true, producer });
    }
    catch (err) {
        next(err);
    }
}
async function updateProducer(req, res, next) {
    try {
        if (req.body.name)
            req.body.slug = (0, slugify_1.slugify)(req.body.name);
        const producer = await Producer_1.Producer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!producer)
            throw new error_middleware_1.AppError('Üretici bulunamadı.', 404);
        res.json({ success: true, producer });
    }
    catch (err) {
        next(err);
    }
}
async function deleteProducer(req, res, next) {
    try {
        await Producer_1.Producer.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Üretici silindi.' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=producer.controller.js.map