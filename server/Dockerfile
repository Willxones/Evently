FROM node:22.14

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install

RUN npm install -g nodemon

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["nodemon", "src/server.js"]