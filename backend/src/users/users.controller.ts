import { Controller, Post, Body, Get, UseGuards, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('register')
  async register(@Req() req: any, @Body() body: { nickname: string }) {
    const firebaseUser = req.user;
    return this.usersService.registerUser(firebaseUser.uid, firebaseUser.email, body.nickname);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    return user || { registered: false };
  }

  @UseGuards(FirebaseAuthGuard)
  @Put('payment')
  async updatePayment(@Req() req: any, @Body() body: { screenshotUrl: string }) {
    return this.usersService.updatePaymentScreenshot(req.user.uid, body.screenshotUrl);
  }
}
