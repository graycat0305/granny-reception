"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const firebase_auth_guard_1 = require("../auth/guards/firebase-auth.guard");
const users_service_1 = require("../users/users.service");
let OrdersController = class OrdersController {
    ordersService;
    usersService;
    constructor(ordersService, usersService) {
        this.ordersService = ordersService;
        this.usersService = usersService;
    }
    async createOrder(req, body) {
        const user = await this.usersService.findByFirebaseUid(req.user.uid);
        if (!user)
            throw new common_1.ForbiddenException('User not found');
        if (user.status !== 'APPROVED')
            throw new common_1.ForbiddenException('User is not APPROVED');
        if (!user.checkedIn)
            throw new common_1.ForbiddenException('User is not checked in');
        return this.ordersService.createOrder(user._id.toString(), body.drinkName);
    }
    async getMyOrders(req) {
        const user = await this.usersService.findByFirebaseUid(req.user.uid);
        if (!user)
            throw new Error('User not found');
        return this.ordersService.getUserOrders(user._id.toString());
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
__decorate([
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    (0, common_1.Get)('my-orders'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getMyOrders", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        users_service_1.UsersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map