# Vercel-backend
Vercel backend clone is designed to automatically build and deploy sites based on a given URL, such as a GitHub repository URL. The clone is built using various technologies, including 
- AWS ECS, ECR, and S3,
- Redis,
- Docker,
- Socket.io,
- JavaScript,
- Express.js,
- Node.js.
- reverse-proxy.



## Directory Structure
```
.
├── README.md
├── api-server          - Express Server that will expose endpoint to fetch codebase.
│   ├── Dockerfile      - Docker file
│   ├── index.js        - Script file
│   ├── package-lock.json
│   └── package.json
├── build-server
│   ├── Dockerfile      - Dockerfile
│   ├── main.sh         - .sh file
│   ├── package-lock.json
│   ├── package.json
│   └── script.js       - This Will build logs and publish it on redis server
├── s3-reverse-proxy
    ├── Dockerfile      - Dockerfile
    ├── index.js        - this will help us to view the webpage.
    ├── package-lock.json
    └── package.json


3 directories, 15 files
```

## How to get started?

To get started with the Vercel backend clone, follow these steps:

1. Clone this repository to your local machine.
2. Set up your ECR, ECS, and S3 configurations and update the script file accordingly.
3. Start Docker on your machine.
4. In the `build-server` directory, create a `.env` file and save the required environment variables.
5. Start both servers.
6. Open Postman and send a `POST` request to `http://localhost:5000/project` with the following URL:
  - Request Body:
    - `GitURL`: Specify the URL of the GitHub page you want to publish.

  ![Screenshot 2024-02-14 103401](https://github.com/CaptainTron/Vercel-backend/assets/94986377/e2695ee3-9b7f-46ef-a2c1-122048d631d9)

7. Go to the socket.io method and subscribe to `logs:<<YOUR_PROJECT_ID>>`, then click connect.

  ![Screenshot 2024-02-14 103354](https://github.com/CaptainTron/Vercel-backend/assets/94986377/df4043fe-1b07-499c-abd3-96c0142d7a78)

### High-Level Design
The following image provides a high-level overview of the design:

![image](https://github.com/CaptainTron/Vercel-backend/assets/94986377/b35bc33f-8bd0-4ec4-9e45-cbb8c0bc6d1f)
