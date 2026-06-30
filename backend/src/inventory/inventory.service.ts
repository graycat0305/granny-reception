import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory, InventoryDocument } from './schemas/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<InventoryDocument>,
  ) {
    this.initializeInventory();
  }

  // 自動初始化已知酒單
  private async initializeInventory() {
    const defaultDrinks = ['夏日回憶', '命運', '猛毒9502', '機會', '房地產', '短島冰茶', '環遊世界'];
    for (const name of defaultDrinks) {
      const exists = await this.inventoryModel.findOne({ drinkName: name });
      if (!exists) {
        await new this.inventoryModel({ drinkName: name, inStock: true }).save();
      }
    }
  }

  async getAllInventory(): Promise<InventoryDocument[]> {
    return this.inventoryModel.find().exec();
  }

  async toggleStock(drinkName: string, inStock: boolean): Promise<InventoryDocument> {
    const item = await this.inventoryModel.findOneAndUpdate(
      { drinkName },
      { inStock },
      { new: true, upsert: true }
    );
    return item;
  }

  async isDrinkInStock(drinkName: string): Promise<boolean> {
    const item = await this.inventoryModel.findOne({ drinkName });
    if (!item) return false;
    return item.inStock;
  }
}
