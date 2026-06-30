import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(req: any, body: {
        nickname: string;
    }): Promise<import("./schemas/user.schema").UserDocument>;
    getMe(req: any): Promise<import("./schemas/user.schema").UserDocument | {
        registered: boolean;
    }>;
    updatePayment(req: any, body: {
        screenshotUrl: string;
    }): Promise<import("./schemas/user.schema").UserDocument>;
}
