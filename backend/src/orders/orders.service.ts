import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private inventoryService: InventoryService
  ) {}

  async createOrder(userId: string, drinkName: string): Promise<OrderDocument> {
    const inStock = await this.inventoryService.isDrinkInStock(drinkName);
    if (!inStock) {
      throw new BadRequestException(`抱歉，${drinkName} 已經售完或暫停供應`);
    }

    const activeOrder = await this.orderModel.findOne({
      userId: new Types.ObjectId(userId),
      status: { $in: ['QUEUE', 'MAKING'] },
    }).exec();

    if (activeOrder) {
      throw new BadRequestException('You already have an active order. Limit is 1 cup at a time.');
    }

    const order = new this.orderModel({ userId: new Types.ObjectId(userId), drinkName, status: 'QUEUE' });
    return order.save();
  }

  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ userId: new Types.ObjectId(userId) }).sort({ orderTime: -1 }).exec();
  }

  // Bartender uses this to get the next orders
  async getQueue(): Promise<any[]> {
    // Return queue aggregated by drinkName or just the oldest ones
    return this.orderModel
      .find({ status: 'QUEUE' })
      .populate('userId', 'nickname')
      .sort({ orderTime: 1 })
      .exec();
  }

  async markAsMaking(orderId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findByIdAndUpdate(orderId, { status: 'MAKING' }, { new: true });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async getServedOrders(): Promise<OrderDocument[]> {
    return this.orderModel.find({ status: 'SERVED' }).populate('userId', 'nickname').sort({ servedTime: 1 }).exec();
  }

  async serveOrder(orderId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: 'SERVED', servedTime: new Date() },
      { new: true }
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async markAsDone(orderId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: 'DONE' },
      { new: true }
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async skipOrder(orderId: string): Promise<OrderDocument | null> {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    order.status = 'CANCELLED';
    await order.save();

    // The logic to "serve the next person who ordered the same drink"
    // will be handled by the queue automatically fetching the next one.
    // If the front-end just calls getQueue() again, the next person in line for that drink will show up.
    // However, if we specifically want to find the next person with the *same* drink:
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
}
