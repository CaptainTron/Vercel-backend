const express = require('express');
const app = express();
const { generateSlug } = require("random-word-slugs");
app.use(express.json());
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs")

const { Server } = require('socket.io')
const Redis = require('ioredis')

const subscriber = new Redis("rediss://default:AVNS_kO-aNMqbhnkdkGi9N5S@redis-b2160cd-vaibhavwateam-0bb0.a.aivencloud.com:15904")
const io = new Server({ cors: '*' });

io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

io.listen(5002, console.log("socket server 9001..."))


const ecsClient = new ECSClient({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: 'AKIARFPSHFLDBFML4RPE',
        secretAccessKey: '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'
    }
})

const config = {
    CLUSTER: "arn:aws:ecs:ap-south-1:080501746374:cluster/build-cluster",
    TASK: "arn:aws:ecs:ap-south-1:080501746374:task-definition/builder-task"
}


app.use('/project', async (req, res) => {
    const slugword = generateSlug();
    const { GitURL } = req.body;

    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: ['subnet-0e4c73e2e518ee82c', 'subnet-016aa1b18228fbed7', 'subnet-087f0767af471e7dd'],
                securityGroups: ['sg-099fd7762fcde6c08']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'builder-image',
                    environment: [
                        { name: 'GIT_REPO_URL', value: GitURL },
                        { name: 'PROJECT_ID', value: slugword }
                    ]
                }
            ]
        }
    })

    await ecsClient.send(command);
    return res.status(200).json({ status: "queued", data: { slugword, url: `http://${slugword}/localhost:9000` } })
})

async function initRedisSubscribe() {
    console.log('Subscribed to logs....')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        io.to(channel).emit('message', message)
    })
}
initRedisSubscribe();


app.listen(5000, console.log("API SERVER RUNNING ON 5000..."))