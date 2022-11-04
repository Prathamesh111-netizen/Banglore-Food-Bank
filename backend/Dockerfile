FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install --silent

COPY . .

EXPOSE 2525

CMD [ "npm", "start" ]