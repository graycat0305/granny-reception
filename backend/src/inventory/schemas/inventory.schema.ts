import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ required: true, unique: true })
  drinkName: string;

  @Prop({ default: true })
  inStock: boolean;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
