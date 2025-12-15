FROM node:20-alpine
WORKDIR /app

# зависимости
COPY package*.json ./
RUN npm install

# prisma (если есть)
COPY prisma ./prisma

# остальной код
COPY . .

# prisma generate (часто нужно)
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
