FROM node:16.14.0
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "./"]

RUN npm install 

COPY . .

EXPOSE 2525

CMD [ "npm", "start" ]