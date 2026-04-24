"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/env");
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const env_1 = require("./config/env");
async function start() {
    await (0, database_1.connectDB)();
    app_1.default.listen(env_1.ENV.PORT, () => {
        console.log(`TAZEKÖY Backend çalışıyor → http://localhost:${env_1.ENV.PORT}`);
    });
}
start().catch(err => {
    console.error('Başlatma hatası:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map