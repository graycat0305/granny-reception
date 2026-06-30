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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const inventory_service_1 = require("../inventory/inventory.service");
let OrdersService = class OrdersService {
    orderModel;
    inventoryService;
    constructor(orderModel, inventoryService) {
        this.orderModel = orderModel;
        this.inventoryService = inventoryService;
    }
    async createOrder(userId, drinkName) {
        const inStock = await this.inventoryService.isDrinkInStock(drinkName);
        if (!inStock) {
            throw new common_1.BadRequestException(`抱歉，${drinkName} 已經售完或暫停供應`);
        }
        const activeOrder = await this.orderModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            status: { $in: ['QUEUE', 'MAKING'] },
        }).exec();
        if (activeOrder) {
            throw new common_1.BadRequestException('You already have an active order. Limit is 1 cup at a time.');
        }
        const order = new this.orderModel({ userId: new mongoose_2.Types.ObjectId(userId), drinkName, status: 'QUEUE' });
        return order.save();
    }
    async getUserOrders(userId) {
        return this.orderModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).sort({ orderTime: -1 }).exec();
    }
    async getQueue() {
        return this.orderModel
            .find({ status: 'QUEUE' })
            .populate('userId', 'nickname')
            .sort({ orderTime: 1 })
            .exec();
    }
    async markAsMaking(orderId) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { status: 'MAKING' }, { new: true });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async getServedOrders() {
        return this.orderModel.find({ status: 'SERVED' }).populate('userId', 'nickname').sort({ servedTime: 1 }).exec();
    }
    async serveOrder(orderId) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { status: 'SERVED', servedTime: new Date() }, { new: true });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async markAsDone(orderId) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { status: 'DONE' }, { new: true });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async skipOrder(orderId) {
        const order = await this.orderModel.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        order.status = 'CANCELLED';
        await order.save();
        const nextOrder = await this.orderModel
            .findOne({ status: 'QUEUE', drinkName: order.drinkName })
            .sort({ orderTime: 1 })
            .exec();
        if (nextOrder) {
            nextOrder.status = 'MAKING';
            await nextOrder.save();
            return nextOrder;
        }
        return null;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        inventory_service_1.InventoryService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map