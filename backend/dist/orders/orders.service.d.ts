import { Model } from 'mongoose';
import { OrderDocument } from './schemas/order.schema';
import { InventoryService } from '../inventory/inventory.service';
export declare class OrdersService {
    private orderModel;
    private inventoryService;
    constructor(orderModel: Model<OrderDocument>, inventoryService: InventoryService);
    createOrder(userId: string, drinkName: string): Promise<OrderDocument>;
    getUserOrders(userId: string): Promise<OrderDocument[]>;
    getQueue(): Promise<any[]>;
    markAsMaking(orderId: string): Promise<OrderDocument>;
    getServedOrders(): Promise<OrderDocument[]>;
    serveOrder(orderId: string): Promise<OrderDocument>;
    markAsDone(orderId: string): Promise<OrderDocument>;
    skipOrder(orderId: string): Promise<OrderDocument | null>;
}
