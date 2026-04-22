FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./


RUN npm cache clean --force
RUN npm install --no-optional

COPY . .

CMD ["npm", "run", "dev"]