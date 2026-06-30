import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private emailService: EmailService
  ) {}

  async registerUser(firebaseUid: string, email: string, nickname: string): Promise<UserDocument> {
    const existing = await this.userModel.findOne({ firebaseUid });
    if (existing) throw new Error('User already registered');

    const newUser = new this.userModel({
      firebaseUid,
      email,
      nickname,
      status: 'PENDING_REVIEW',
      role: 'CLIENT'
    });
    return newUser.save();
  }

  async findByFirebaseUid(uid: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ firebaseUid: uid });
  }

  async updatePaymentScreenshot(uid: string, screenshotUrl: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ firebaseUid: uid });
    if (!user) throw new NotFoundException('User not found');
    if (user.status !== 'PENDING_PAYMENT') throw new Error('Not expecting payment');

    user.paymentScreenshotUrl = screenshotUrl;
    user.status = 'PAYMENT_UPLOADED';
    return user.save();
  }

  async approveRegistration(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    
    user.status = 'PENDING_PAYMENT';
    await user.save();

    await this.emailService.sendPaymentRequestEmail(user.email, user.nickname);
    return user;
  }

  async confirmPayment(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { status: 'APPROVED' },
      { new: true }
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getUsersByStatus(status: string | string[]): Promise<UserDocument[]> {
    if (Array.isArray(status)) {
      return this.userModel.find({ status: { $in: status } }).exec();
    }
    return this.userModel.find({ status }).exec();
  }



  async rejectUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { status: 'REJECTED' },
      { new: true }
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async checkIn(firebaseUid: string): Promise<UserDocument> {
    const user = await this.userModel.findOneAndUpdate(
      { firebaseUid, status: 'APPROVED' },
      { checkedIn: true },
      { new: true }
    );
    if (!user) throw new BadRequestException('User cannot be checked in or not found');
    return user;
  }
}
