"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
function ensureMongoDbName(uri, defaultDb = 'tazekoy') {
    // If URI already includes a DB path (e.g. /tazekoy), keep it as-is.
    const hasDbName = /mongodb(?:\+srv)?:\/\/[^/]+\/[^?]/.test(uri);
    if (hasDbName)
        return uri;
    if (uri.includes('/?'))
        return uri.replace('/?', `/${defaultDb}?`);
    if (uri.endsWith('/'))
        return `${uri}${defaultDb}`;
    if (uri.includes('?'))
        return uri.replace('?', `/${defaultDb}?`);
    return `${uri}/${defaultDb}`;
}
async function connectDB() {
    const uri = ensureMongoDbName(env_1.ENV.MONGODB_URI);
    await mongoose_1.default.connect(uri);
    console.log('MongoDB bağlantısı kuruldu.');
}
//# sourceMappingURL=database.js.map