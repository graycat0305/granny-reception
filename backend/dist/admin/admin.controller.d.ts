import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
export declare class AdminController {
    private readonly usersService;
    private readonly ordersService;
    constructor(usersService: UsersService, ordersService: OrdersService);
    getPendingReviewUsers(): Promise<import("../users/schemas/user.schema").UserDocument[]>;
    getPendingPaymentUsers(): Promise<import("../users/schemas/user.schema").UserDocument[]>;
    approveRegistration(id: string): Promise<import("../users/schemas/user.schema").UserDocument>;
    confirmPayment(id: string): Promise<import("../users/schemas/user.schema").UserDocument>;
    rejectUser(id: string): Promise<import("../users/schemas/user.schema").UserDocument>;
    checkInUser(firebaseUid: string): Promise<import("../users/schemas/user.schema").UserDocument>;
    getQueue(): Promise<{
        drinkName: any;
        count: number;
        orders: any[];
    }[]>;
    serveOrder(orderId: string): Promise<import("../orders/schemas/order.schema").OrderDocument>;
    getServedOrders(): Promise<import("../orders/schemas/order.schema").OrderDocument[]>;
    markAsDone(orderId: string): Promise<import("../orders/schemas/order.schema").OrderDocument>;
    skipOrder(orderId: string): Promise<import("../orders/schemas/order.schema").OrderDocument | null>;
}
