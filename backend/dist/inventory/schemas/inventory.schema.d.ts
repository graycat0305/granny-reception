import { Document } from 'mongoose';
export type InventoryDocument = Inventory & Document;
export declare class Inventory {
    drinkName: string;
    inStock: boolean;
}
export declare const InventorySchema: import("mongoose").Schema<Inventory, import("mongoose").Model<Inventory, any, any, any, any, any, Inventory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inventory, Document<unknown, {}, Inventory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    drinkName?: import("mongoose").SchemaDefinitionProperty<string, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    inStock?: import("mongoose").SchemaDefinitionProperty<boolean, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Inventory>;
