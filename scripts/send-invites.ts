import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);

// Define the interface for a guest
interface Guest {
  id: string;
  name: string;
  hasTicket: boolean;
  email: string;
}

// Load guests data
const guestsPath = path.resolve(process.cwd(), 'src/data/guests.json');
const guestsData = JSON.parse(fs.readFileSync(guestsPath, 'utf-8')) as { guests: Guest[] };
const guests = guestsData.guests;

const BASE_URL = 'https://grannybar.xyz'; // Change this to your actual domain if different
const SENDER_EMAIL = 'noreply@grannybar.xyz';
const SUBJECT = '【老奶奶酒會3rd：酒廠大亨】專屬邀請函';

async function sendInvites() {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Please set a valid RESEND_API_KEY in .env.local');
    process.exit(1);
  }

  const guestsWithEmail = guests.filter((g) => g.email && g.email.trim() !== '');

  if (guestsWithEmail.length === 0) {
    console.log('ℹ️ No guests with a valid email address found in src/data/guests.json');
    return;
  }

  console.log(`📨 Preparing to send invitations to ${guestsWithEmail.length} guests...`);

  for (const guest of guestsWithEmail) {
    try {
      const inviteUrl = `${BASE_URL}/invite/${guest.id}`;
      
      const { data, error } = await resend.emails.send({
        from: `老奶奶酒會<${SENDER_EMAIL}>`,
        to: guest.email,
        subject: SUBJECT,
        html: `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root {
      color-scheme: light dark;
    }
    @media (prefers-color-scheme: dark) {
      body, .email-wrapper {
        background-color: #050505 !important;
      }
      .email-container {
        background-color: #0a0a0a !important;
        border-color: #D4AF37 !important;
      }
      .text-main { color: #fdfaf0 !important; }
      .text-muted { color: #cccccc !important; }
      .text-accent { color: #D4AF37 !important; }
      .btn { border-color: #D4AF37 !important; color: #D4AF37 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; -webkit-font-smoothing: antialiased; background-color: #f9f7f1;">
  <div class="email-wrapper" style="background-color: #f9f7f1; padding: 30px 10px;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; padding: 35px 20px; border: 1px solid #b58d27; background-color: #ffffff;">
      
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 class="text-accent" style="color: #b58d27; letter-spacing: 4px; font-weight: normal; margin: 0; font-size: 22px;">GRANNY BAR</h1>
        <p class="text-muted" style="color: #666666; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">3rd Anniversary Exclusive</p>
      </div>
      
      <h2 class="text-main" style="color: #1a1a1a; text-align: center; font-weight: normal; letter-spacing: 2px; font-size: 17px; margin-bottom: 30px;">致 尊貴的 ${guest.name}</h2>
      
      <div class="text-muted" style="line-height: 1.8; font-size: 15px; color: #444444; text-align: justify; padding: 0 5px;">
        <p style="margin-top: 0;">我們誠摯地通知您，一份來自老奶奶酒會的機密包裹已經悄然送達。</p>
        <p>今年，我們將迎來一場關乎財富與權力的頂級盛宴——「<strong class="text-main" style="color: #1a1a1a; font-weight: bold;">酒廠大亨</strong>」。您的身分已被主辦方確認，這場只屬於少數人的私密集會，正等待著您的正式表態。</p>
        <p style="margin-bottom: 0;">請點擊下方專屬通道，啟動您的虛擬信封，並領取您的入場身分憑證。</p>
      </div>
      
      <div style="width: 40px; height: 1px; background-color: #D4AF37; margin: 35px auto; opacity: 0.5;"></div>
      
      <div style="text-align: center; margin-top: 25px; margin-bottom: 35px;">
        <a href="${inviteUrl}" class="btn" style="display: inline-block; padding: 12px 24px; background-color: transparent; color: #b58d27; text-decoration: none; font-size: 14px; letter-spacing: 3px; border: 1px solid #b58d27;">
          檢視機密信件
        </a>
      </div>
      
      <p class="text-muted" style="text-align: center; margin-top: 40px; margin-bottom: 0; font-size: 11px; color: #888888; letter-spacing: 2px;">
        © 2026 GRANNY BAR • 期待您的蒞臨
      </p>
      
    </div>
  </div>
</body>
</html>
        `,
      });

      if (error) {
        console.error(`❌ Failed to send to ${guest.name} (${guest.email}):`, error);
      } else {
        console.log(`✅ Sent to ${guest.name} (${guest.email}) - ID: ${data?.id}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error sending to ${guest.name} (${guest.email}):`, err);
    }
  }

  console.log('🎉 Finished processing invitations.');
}

sendInvites();
