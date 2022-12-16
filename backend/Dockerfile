FROM node:19-alpine3.16
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install --force

COPY . .

EXPOSE 2525

CMD [ "npm", "start" ]