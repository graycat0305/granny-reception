import { OrdersService } from './orders.service';
import { UsersService } from '../users/users.service';
export declare class OrdersController {
    private readonly ordersService;
    private readonly usersService;
    constructor(ordersService: OrdersService, usersService: UsersService);
    createOrder(req: any, body: {
        drinkName: string;
    }): Promise<import("./schemas/order.schema").OrderDocument>;
    getMyOrders(req: any): Promise<import("./schemas/order.schema").OrderDocument[]>;
}
