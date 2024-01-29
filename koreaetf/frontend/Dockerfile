FROM node:20-alpine
COPY ./package*.json ./
COPY ./ ./
RUN npm install
RUN npm run build
ENTRYPOINT ["npm", "run", "start"]