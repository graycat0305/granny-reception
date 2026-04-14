FROM node:20-alpine
WORKDIR /app

# 先複製所有文件 (跳過單獨複製 lockfile，避免檔案不存在導致中斷)
COPY . .

# 安裝依賴
RUN npm install

# 執行構建
RUN npm run build

# 設定環境變數
ENV NODE_ENV=production

EXPOSE 3000

# 啟動應用
CMD ["npm", "start"]
