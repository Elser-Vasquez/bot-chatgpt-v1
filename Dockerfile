FROM node:18-bullseye as bot
WORKDIR /app
COPY package*.json ./
RUN npm install pm2 -g
RUN npm i
COPY . .
ARG RAILWAY_STATIC_URL
ARG PUBLIC_URL
ARG PORT
#CMD ["npm", "start"]
CMD ["pm2-runtime", "app.js"]
