## Vercel-backend
This is Scalable Vercel backend Clone that takes following values as Environment Variable
- ```GIT_REPO_URL``` as github url to clone
- ```PROJECT_ID``` as projectID


### How to start ?
- Clone this Repo
- Start your Docker
- In ```build-server``` create a ```.env``` file and save above environment variable.
- start both servers.
- Go to postman hit ```POST``` Request with following URL ```http://localhost:5000/project```
  - BODY
    - ```GitURL``` which specifies the url of Github page you want to publish
![Screenshot 2024-02-14 103401](https://github.com/CaptainTron/Vercel-backend/assets/94986377/e2695ee3-9b7f-46ef-a2c1-122048d631d9)


- Go to socket.io Method and subscribe to ```logs:<<YOUR_PROJECT_ID>>``` and click connect. 
![Screenshot 2024-02-14 103354](https://github.com/CaptainTron/Vercel-backend/assets/94986377/df4043fe-1b07-499c-abd3-96c0142d7a78)


This project uses of AWS ECS, ECR, S3, REDIS, Docker, socket.io as Techstack.   
### Architecture
![image](https://github.com/CaptainTron/Vercel-backend/assets/94986377/861f7d49-3113-41ed-95bb-5a57751e8a5e)
