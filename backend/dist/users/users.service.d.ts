import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { EmailService } from '../email/email.service';
export declare class UsersService {
    private userModel;
    private emailService;
    constructor(userModel: Model<UserDocument>, emailService: EmailService);
    registerUser(firebaseUid: string, email: string, nickname: string): Promise<UserDocument>;
    findByFirebaseUid(uid: string): Promise<UserDocument | null>;
    updatePaymentScreenshot(uid: string, screenshotUrl: string): Promise<UserDocument>;
    approveRegistration(userId: string): Promise<UserDocument>;
    confirmPayment(userId: string): Promise<UserDocument>;
    getUsersByStatus(status: string | string[]): Promise<UserDocument[]>;
    rejectUser(userId: string): Promise<UserDocument>;
    checkIn(firebaseUid: string): Promise<UserDocument>;
}
