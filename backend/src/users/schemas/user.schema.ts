import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  firebaseUid: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({
    type: String,
    enum: ['PENDING_REVIEW', 'PENDING_PAYMENT', 'PAYMENT_UPLOADED', 'APPROVED', 'REJECTED'],
    default: 'PENDING_REVIEW'
  })
  status: string;

  @Prop()
  paymentScreenshotUrl: string;

  @Prop({ default: false })
  checkedIn: boolean;

  @Prop({ enum: ['CLIENT', 'RECEPTIONIST', 'BARTENDER', 'SERVER', 'ADMIN'], default: 'CLIENT' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
