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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let EmailService = EmailService_1 = class EmailService {
    resend;
    logger = new common_1.Logger(EmailService_1.name);
    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
        }
        else {
            this.logger.warn('RESEND_API_KEY is not set. Emails will only be logged, not sent.');
        }
    }
    async sendPaymentRequestEmail(to, nickname) {
        const subject = '【老奶奶酒會】初審通過！請完成轉帳';
        const html = `
      <h2>嗨，${nickname}！</h2>
      <p>恭喜您通過了老奶奶酒會的初步審核。</p>
      <p>為了完成報名程序，請盡速進行轉帳。轉帳資訊如下：</p>
      <ul>
        <li>銀行代碼：000</li>
        <li>帳號：12345678901234</li>
        <li>金額：NT$ 500</li>
      </ul>
      <p>轉帳完成後，請回到 <a href="https://your-domain.com/auth">報名網站</a> 上傳您的匯款明細截圖或末五碼，等待我們做最後覆核。</p>
      <br />
      <p>期待您的蒞臨！</p>
    `;
        if (!this.resend) {
            this.logger.log(`[Mock Email] To: ${to} | Subject: ${subject}`);
            return;
        }
        try {
            await this.resend.emails.send({
                from: 'Grandma Bar <noreply@resend.dev>',
                to: [to],
                subject,
                html,
            });
            this.logger.log(`Payment request email sent to ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map