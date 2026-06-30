export declare class EmailService {
    private resend;
    private readonly logger;
    constructor();
    sendPaymentRequestEmail(to: string, nickname: string): Promise<void>;
}
