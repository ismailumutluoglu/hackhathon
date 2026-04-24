"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
const Order_1 = require("../models/Order");
async function generateOrderNumber() {
    const year = new Date().getFullYear();
    const count = await Order_1.Order.countDocuments();
    const padded = String(count + 1).padStart(5, '0');
    return `TAZE-${year}-${padded}`;
}
//# sourceMappingURL=orderNumber.js.map