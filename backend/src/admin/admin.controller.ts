import { Controller, Get, Post, Param, UseGuards, Put } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Roles('ADMIN')
  @Get('users/pending-review')
  async getPendingReviewUsers() {
    return this.usersService.getUsersByStatus(['PENDING', 'PENDING_REVIEW']);
  }

  @Roles('ADMIN')
  @Get('users/pending-payment')
  async getPendingPaymentUsers() {
    return this.usersService.getUsersByStatus('PAYMENT_UPLOADED');
  }

  @Roles('ADMIN')
  @Put('users/:id/approve-registration')
  async approveRegistration(@Param('id') id: string) {
    return this.usersService.approveRegistration(id);
  }

  @Roles('ADMIN')
  @Put('users/:id/confirm-payment')
  async confirmPayment(@Param('id') id: string) {
    return this.usersService.confirmPayment(id);
  }

  @Roles('ADMIN')
  @Put('users/:id/reject')
  async rejectUser(@Param('id') id: string) {
    return this.usersService.rejectUser(id);
  }

  @Roles('ADMIN', 'RECEPTIONIST')
  @Put('users/checkin/:firebaseUid')
  async checkInUser(@Param('firebaseUid') firebaseUid: string) {
    return this.usersService.checkIn(firebaseUid);
  }

  @Roles('ADMIN', 'BARTENDER')
  @Get('bartender/queue')
  async getQueue() {
    const queue = await this.ordersService.getQueue();
    // Group them if necessary (e.g. x3) in the frontend or backend
    // Since the logic is to show one drink at a time, but if next 2-3 are same, display x3
    // We can just return the sorted queue and let frontend group it, or do it here.
    const grouped = [];
    for (const order of queue) {
      if (grouped.length > 0 && grouped[grouped.length - 1].drinkName === order.drinkName) {
        grouped[grouped.length - 1].count += 1;
        grouped[grouped.length - 1].orders.push(order);
      } else {
        grouped.push({ drinkName: order.drinkName, count: 1, orders: [order] });
      }
    }
    return grouped;
  }

  @Roles('ADMIN', 'BARTENDER')
  @Put('bartender/serve/:orderId')
  async serveOrder(@Param('orderId') orderId: string) {
    return this.ordersService.serveOrder(orderId);
  }

  @Roles('ADMIN', 'BARTENDER', 'RECEPTIONIST')
  @Get('bartender/served')
  async getServedOrders() {
    return this.ordersService.getServedOrders();
  }

  @Roles('ADMIN', 'BARTENDER', 'RECEPTIONIST')
  @Put('bartender/done/:orderId')
  async markAsDone(@Param('orderId') orderId: string) {
    return this.ordersService.markAsDone(orderId);
  }

  @Roles('ADMIN', 'BARTENDER')
  @Put('bartender/skip/:orderId')
  async skipOrder(@Param('orderId') orderId: string) {
    return this.ordersService.skipOrder(orderId);
  }
}
