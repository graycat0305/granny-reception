import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getInventory(): Promise<import("./schemas/inventory.schema").InventoryDocument[]>;
    toggleStock(drinkName: string, body: {
        inStock: boolean;
    }): Promise<import("./schemas/inventory.schema").InventoryDocument>;
}
