import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  drinkName: string;

  @Prop({ enum: ['QUEUE', 'MAKING', 'SERVED', 'DONE', 'CANCELLED'], default: 'QUEUE' })
  status: string;

  @Prop({ default: Date.now })
  orderTime: Date;

  @Prop()
  servedTime: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
