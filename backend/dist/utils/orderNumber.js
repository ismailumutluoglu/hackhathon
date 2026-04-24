"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
function generateOrderNumber() {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    return `TAZE-${year}-${timestamp}${random}`;
}
//# sourceMappingURL=orderNumber.js.map