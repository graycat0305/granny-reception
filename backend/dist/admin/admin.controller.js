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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const orders_service_1 = require("../orders/orders.service");
const firebase_auth_guard_1 = require("../auth/guards/firebase-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let AdminController = class AdminController {
    usersService;
    ordersService;
    constructor(usersService, ordersService) {
        this.usersService = usersService;
        this.ordersService = ordersService;
    }
    async getPendingReviewUsers() {
        return this.usersService.getUsersByStatus(['PENDING', 'PENDING_REVIEW']);
    }
    async getPendingPaymentUsers() {
        return this.usersService.getUsersByStatus('PAYMENT_UPLOADED');
    }
    async approveRegistration(id) {
        return this.usersService.approveRegistration(id);
    }
    async confirmPayment(id) {
        return this.usersService.confirmPayment(id);
    }
    async rejectUser(id) {
        return this.usersService.rejectUser(id);
    }
    async checkInUser(firebaseUid) {
        return this.usersService.checkIn(firebaseUid);
    }
    async getQueue() {
        const queue = await this.ordersService.getQueue();
        const grouped = [];
        for (const order of queue) {
            if (grouped.length > 0 && grouped[grouped.length - 1].drinkName === order.drinkName) {
                grouped[grouped.length - 1].count += 1;
                grouped[grouped.length - 1].orders.push(order);
            }
            else {
                grouped.push({ drinkName: order.drinkName, count: 1, orders: [order] });
            }
        }
        return grouped;
    }
    async serveOrder(orderId) {
        return this.ordersService.serveOrder(orderId);
    }
    async getServedOrders() {
        return this.ordersService.getServedOrders();
    }
    async markAsDone(orderId) {
        return this.ordersService.markAsDone(orderId);
    }
    async skipOrder(orderId) {
        return this.ordersService.skipOrder(orderId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)('users/pending-review'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingReviewUsers", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)('users/pending-payment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingPaymentUsers", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Put)('users/:id/approve-registration'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveRegistration", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Put)('users/:id/confirm-payment'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "confirmPayment", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Put)('users/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectUser", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'RECEPTIONIST'),
    (0, common_1.Put)('users/checkin/:firebaseUid'),
    __param(0, (0, common_1.Param)('firebaseUid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "checkInUser", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'BARTENDER'),
    (0, common_1.Get)('bartender/queue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getQueue", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'BARTENDER'),
    (0, common_1.Put)('bartender/serve/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "serveOrder", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'BARTENDER', 'RECEPTIONIST'),
    (0, common_1.Get)('bartender/served'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getServedOrders", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'BARTENDER', 'RECEPTIONIST'),
    (0, common_1.Put)('bartender/done/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markAsDone", null);
__decorate([
    (0, roles_decorator_1.Roles)('ADMIN', 'BARTENDER'),
    (0, common_1.Put)('bartender/skip/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "skipOrder", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        orders_service_1.OrdersService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map