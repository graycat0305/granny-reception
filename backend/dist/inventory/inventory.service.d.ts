import { Model } from 'mongoose';
import { InventoryDocument } from './schemas/inventory.schema';
export declare class InventoryService {
    private inventoryModel;
    constructor(inventoryModel: Model<InventoryDocument>);
    private initializeInventory;
    getAllInventory(): Promise<InventoryDocument[]>;
    toggleStock(drinkName: string, inStock: boolean): Promise<InventoryDocument>;
    isDrinkInStock(drinkName: string): Promise<boolean>;
}
