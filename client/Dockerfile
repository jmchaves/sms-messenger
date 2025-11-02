FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
EXPOSE 4200
CMD ["npm","run","start","--","--host","0.0.0.0"]
