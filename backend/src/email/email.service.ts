import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY is not set. Emails will only be logged, not sent.');
    }
  }

  async sendPaymentRequestEmail(to: string, nickname: string) {
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
        from: 'Grandma Bar <noreply@resend.dev>', // Replace with custom domain later
        to: [to],
        subject,
        html,
      });
      this.logger.log(`Payment request email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
    }
  }
}
