import { Controller, Post, Body, Get, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async createOrder(@Req() req: any, @Body() body: { drinkName: string }) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) throw new ForbiddenException('User not found');
    if (user.status !== 'APPROVED') throw new ForbiddenException('User is not APPROVED');
    if (!user.checkedIn) throw new ForbiddenException('User is not checked in');
    
    return this.ordersService.createOrder(user._id.toString(), body.drinkName);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req: any) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) throw new Error('User not found');
    return this.ordersService.getUserOrders(user._id.toString());
  }
}
