const express = require('express');
const app = express();
const { generateSlug } = require("random-word-slugs");
app.use(express.json());
const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs")

const { Server } = require('socket.io')
const Redis = require('ioredis')

const subscriber = new Redis("<< REDIS URL GOES HERE >>");
const io = new Server({ cors: '*' });


// On connection emit the message
io.on('connection', socket => {
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

// Start socket.io
io.listen(5002, console.log("socket server 9001..."))

// Connect to ecsClient
const ecsClient = new ECSClient({
    region: '<<YOUR_REGION>>',
    credentials: {
        accessKeyId: '<<ACCESSKEYID>>',
        secretAccessKey: '<<YOUR_SECRET_ACCESS_KEY>>'
    }
})

// YOUR Cluster and task ARN
const config = {
    CLUSTER: "<<YOUR_CLUSTER_ARN>>",
    TASK: "<<YOUR_TASK_ARN>>"
}


// Listen on /project route
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
                subnets: ['<<SUBNETS>>', '<<SUBNETID>>', '<<SUBNETID>>'],
                securityGroups: ['<<SECURITYGROUP>>']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: '<<IMAGENAME>>',
                    environment: [
                        { name: 'GIT_REPO_URL', value: GitURL },
                        { name: 'PROJECT_ID', value: slugword }
                    ]
                }
            ]
        }
    })

    // Send the command query
    await ecsClient.send(command);
    return res.status(200).json({ status: "queued", data: { slugword, url: `http://${slugword}/localhost:5001` } })
})

// Subscribe to logs and stream the logs
async function initRedisSubscribe() {
    console.log('Subscribed to logs....')
    subscriber.psubscribe('logs:*')
    subscriber.on('pmessage', (pattern, channel, message) => {
        // Emit the message
        io.to(channel).emit('message', message)
    })
}
// Call this functions
initRedisSubscribe();


// Listen on this server...
app.listen(5000, console.log("API SERVER RUNNING ON 5000..."))