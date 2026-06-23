# 老奶奶酒會 3rd 待辦事項 (TODOs)

為了確保上線順利，在活動開始前請務必完成以下事項：

### 1. 環境變數設定
- [ ] 在 Zeabur 的環境變數或本地的 `.env.local` 檔案中，加入 Admin 頁面的帳號與密碼：
  ```env
  NEXT_PUBLIC_ADMIN_USER=你的自訂帳號
  ```
  *(註：如果不設定，將會採用預設的 `admin` / `admin`)*

### 2. 文案修改 (加入 QRCode 提醒)
- [ ] **Email 邀請函 (`scripts/send-invites.ts`)**：
  記得在 HTML 內文中加上提醒文字，例如：「入場時請提前將手機螢幕調亮，並準備好您的 QRCode 畫面以利工作人員掃描。」
- [ ] **網站內虛擬信件 (`src/components/InvitationLetter.tsx`)**：
  在 QRCode 上方或下方，加入類似的提醒文字，避免現場網路不佳或手忙腳亂。

### 3. 準備發送 Email
- [ ] 在 `src/data/guests.json` 中，將所有賓客的 `email` 欄位填上正確的信箱位址。
- [ ] 在環境變數中確保 `RESEND_API_KEY` 已經設定正確。
- [ ] 在終端機執行 `npm run send-invites` 來批次發送所有邀請函！
