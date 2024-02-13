FROM node:20-alpine

WORKDIR /home/api_server

COPY index.js index.js
COPY package*.json .

RUN npm install

# EXPOSE 5000 for api_Server and 5002 for SOCKET.io
EXPOSE 5000
EXPOSE 5002
CMD ["npm", "start"]