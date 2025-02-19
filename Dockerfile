# ใช้ Node.js เวอร์ชัน 18 บน Alpine (ขนาดเล็กกว่า ลดการใช้ RAM)
FROM node:18-alpine

# ติดตั้ง netcat สำหรับ Alpine
RUN apk add --no-cache netcat-openbsd

# ตั้งค่า Working Directory
WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package*.json yarn.lock ./
RUN yarn install --production

# คัดลอกไฟล์โค้ดทั้งหมด
COPY . .

# เปิดพอร์ต
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
