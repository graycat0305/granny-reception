"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const email_service_1 = require("../email/email.service");
let UsersService = class UsersService {
    userModel;
    emailService;
    constructor(userModel, emailService) {
        this.userModel = userModel;
        this.emailService = emailService;
    }
    async registerUser(firebaseUid, email, nickname) {
        const existing = await this.userModel.findOne({ firebaseUid });
        if (existing)
            throw new Error('User already registered');
        const newUser = new this.userModel({
            firebaseUid,
            email,
            nickname,
            status: 'PENDING_REVIEW',
            role: 'CLIENT'
        });
        return newUser.save();
    }
    async findByFirebaseUid(uid) {
        return this.userModel.findOne({ firebaseUid: uid });
    }
    async updatePaymentScreenshot(uid, screenshotUrl) {
        const user = await this.userModel.findOne({ firebaseUid: uid });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.status !== 'PENDING_PAYMENT')
            throw new Error('Not expecting payment');
        user.paymentScreenshotUrl = screenshotUrl;
        user.status = 'PAYMENT_UPLOADED';
        return user.save();
    }
    async approveRegistration(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.status = 'PENDING_PAYMENT';
        await user.save();
        await this.emailService.sendPaymentRequestEmail(user.email, user.nickname);
        return user;
    }
    async confirmPayment(userId) {
        const user = await this.userModel.findByIdAndUpdate(userId, { status: 'APPROVED' }, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async getUsersByStatus(status) {
        if (Array.isArray(status)) {
            return this.userModel.find({ status: { $in: status } }).exec();
        }
        return this.userModel.find({ status }).exec();
    }
    async rejectUser(userId) {
        const user = await this.userModel.findByIdAndUpdate(userId, { status: 'REJECTED' }, { new: true });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async checkIn(firebaseUid) {
        const user = await this.userModel.findOneAndUpdate({ firebaseUid, status: 'APPROVED' }, { checkedIn: true }, { new: true });
        if (!user)
            throw new common_1.BadRequestException('User cannot be checked in or not found');
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map