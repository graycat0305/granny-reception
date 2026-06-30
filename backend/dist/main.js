"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_1 = require("firebase-admin/app");
async function bootstrap() {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccount) {
        (0, app_1.initializeApp)({
            credential: (0, app_1.cert)(JSON.parse(serviceAccount)),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
    }
    else {
        (0, app_1.initializeApp)();
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
//# sourceMappingURL=main.js.map