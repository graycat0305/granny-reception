import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { UsersModule } from '../users/users.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UsersModule,
    InventoryModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
