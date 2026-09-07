FROM node:20-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY src ./src
COPY index.html ./

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
