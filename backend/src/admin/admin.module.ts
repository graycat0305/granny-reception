import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [UsersModule, OrdersModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
