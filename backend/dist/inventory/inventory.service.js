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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const inventory_schema_1 = require("./schemas/inventory.schema");
let InventoryService = class InventoryService {
    inventoryModel;
    constructor(inventoryModel) {
        this.inventoryModel = inventoryModel;
        this.initializeInventory();
    }
    async initializeInventory() {
        const defaultDrinks = ['夏日回憶', '命運', '猛毒9502', '機會', '房地產', '短島冰茶', '環遊世界'];
        for (const name of defaultDrinks) {
            const exists = await this.inventoryModel.findOne({ drinkName: name });
            if (!exists) {
                await new this.inventoryModel({ drinkName: name, inStock: true }).save();
            }
        }
    }
    async getAllInventory() {
        return this.inventoryModel.find().exec();
    }
    async toggleStock(drinkName, inStock) {
        const item = await this.inventoryModel.findOneAndUpdate({ drinkName }, { inStock }, { new: true, upsert: true });
        return item;
    }
    async isDrinkInStock(drinkName) {
        const item = await this.inventoryModel.findOne({ drinkName });
        if (!item)
            return false;
        return item.inStock;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map