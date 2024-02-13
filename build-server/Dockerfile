# NodeJS -> DockerFile -> ECS -> aws







#Take ubuntu:focal version
FROM ubuntu:focal
RUN apt-get update
RUN apt-get install -y curl

# Download node v20
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
# Install Node v20
RUN apt-get install -y nodejs

# Install git 
RUN apt-get install git -y

# goto /home/app
WORKDIR /home/app

# copy all file to /home/app
COPY main.sh main.sh
COPY script.js script.js
COPY package*.json .

# for aws, redis, mime
RUN npm install

# Give permission to main.sh and script.js
RUN chmod +x main.sh
RUN chmod +x script.js

# Starts the container with this command
ENTRYPOINT ["/home/app/main.sh"]