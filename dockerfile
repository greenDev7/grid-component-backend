FROM node:16-alpine
WORKDIR /grid-component-backend
COPY package*.json ./
RUN npm install
COPY . .
CMD npm run start:dev
EXPOSE 3000