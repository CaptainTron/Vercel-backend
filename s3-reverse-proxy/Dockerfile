FROM node:20-alpine
WORKDIR /home/s3_reverse_proxy


COPY index.js index.js
COPY package*.json .

RUN npm install
EXPOSE 5001

CMD ["npm", "start"]