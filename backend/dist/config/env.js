"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000'),
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/tazekoy',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
//# sourceMappingURL=env.js.map