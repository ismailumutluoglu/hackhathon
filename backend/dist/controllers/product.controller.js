"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getFeaturedProducts = getFeaturedProducts;
exports.getCampaignProducts = getCampaignProducts;
exports.getProduct = getProduct;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.addReview = addReview;
const Product_1 = require("../models/Product");
const error_middleware_1 = require("../middlewares/error.middleware");
const slugify_1 = require("../utils/slugify");
async function getProducts(req, res, next) {
    try {
        const { category, search, minPrice, maxPrice, page = 1, limit = 12, sort = '-createdAt' } = req.query;
        const filter = { isActive: true };
        if (category)
            filter.category = category;
        if (search)
            filter.$text = { $search: search };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            Product_1.Product.find(filter)
                .populate('producer', 'name slug avatar location.city isVerified')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit))
                .select('-reviews -__v'),
            Product_1.Product.countDocuments(filter),
        ]);
        res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    }
    catch (err) {
        next(err);
    }
}
async function getFeaturedProducts(req, res, next) {
    try {
        const products = await Product_1.Product.find({ isFeatured: true, isActive: true, stock: { $gt: 0 } })
            .populate('producer', 'name slug avatar location.city isVerified')
            .limit(8)
            .select('-reviews -__v');
        res.json({ success: true, products });
    }
    catch (err) {
        next(err);
    }
}
async function getCampaignProducts(req, res, next) {
    try {
        const now = new Date();
        const products = await Product_1.Product.find({
            isCampaign: true,
            isActive: true,
            stock: { $gt: 0 },
            campaignEndsAt: { $gt: now },
        })
            .populate('producer', 'name slug avatar location.city isVerified')
            .sort('campaignEndsAt')
            .select('-reviews -__v');
        res.json({ success: true, products });
    }
    catch (err) {
        next(err);
    }
}
async function getProduct(req, res, next) {
    try {
        const product = await Product_1.Product.findOne({ slug: req.params.slug, isActive: true })
            .populate('producer', '-__v')
            .populate('reviews.user', 'name avatar');
        if (!product)
            throw new error_middleware_1.AppError('Ürün bulunamadı.', 404);
        res.json({ success: true, product });
    }
    catch (err) {
        next(err);
    }
}
async function createProduct(req, res, next) {
    try {
        const slug = (0, slugify_1.slugify)(req.body.name);
        const product = await Product_1.Product.create({ ...req.body, slug });
        res.status(201).json({ success: true, product });
    }
    catch (err) {
        next(err);
    }
}
async function updateProduct(req, res, next) {
    try {
        if (req.body.name)
            req.body.slug = (0, slugify_1.slugify)(req.body.name);
        const product = await Product_1.Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product)
            throw new error_middleware_1.AppError('Ürün bulunamadı.', 404);
        res.json({ success: true, product });
    }
    catch (err) {
        next(err);
    }
}
async function deleteProduct(req, res, next) {
    try {
        await Product_1.Product.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ success: true, message: 'Ürün silindi.' });
    }
    catch (err) {
        next(err);
    }
}
async function addReview(req, res, next) {
    try {
        const product = await Product_1.Product.findById(req.params.id);
        if (!product)
            throw new error_middleware_1.AppError('Ürün bulunamadı.', 404);
        const alreadyReviewed = product.reviews.some(r => r.user.toString() === req.userId);
        if (alreadyReviewed)
            throw new error_middleware_1.AppError('Bu ürüne zaten yorum yaptınız.', 400);
        product.reviews.push({ user: req.userId, rating: req.body.rating, comment: req.body.comment, createdAt: new Date() });
        product.reviewCount = product.reviews.length;
        product.rating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ success: true, message: 'Yorumunuz eklendi.' });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=product.controller.js.map