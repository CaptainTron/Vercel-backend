const { exec } = require("child_process");
const path = require('path');
const fs = require('fs')
const mime = require('mime-types');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
// EXPORT .env file
require('dotenv').config();

// CONNECT to REDIS SERVER
const Redis = require("ioredis");
// CREATE A PUBLISHER
const publisher = new Redis(`<< REDIS URL GOES HERE >>`)




// Connect to S3 Bucket
const s3Client = new S3Client({
    region: '<<YOUR_REGION>>',
    credentials: {
        accessKeyId: '<<ACCESSKEYID>>',
        secretAccessKey: '<<YOUR_SECRET_ACCESS_KEY>>'
    }
})

// Get project ID
const PROJECT_ID = process.env.PROJECT_ID


// Publish the logs
function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
}

async function init() {
    console.log('Executing script.js')
    publishLog('Build Started...')
    // Get the output DIr
    const outDirPath = path.join(__dirname, 'output')

    // Execute the function
    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    // A Readable Stream that represents the child process's stdout.
    p.stdout.on('data', function (data) {
        console.log(data.toString())
        publishLog(data.toString())
    })

    // A Readable Stream that represents the child process's stdout.
    p.stdout.on('error', function (data) {
        console.log('Error', data.toString())
        publishLog(`error: ${data.toString()}`)
    })

    p.on('close', async function () {
        console.log('Build Complete')
        publishLog(`Build Complete`)
        const distFolderPath = path.join(__dirname, 'output', 'build')
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

        publishLog(`Starting to upload`)
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)
            publishLog(`uploading ${file}`)

            // upload the file one-one
            const command = new PutObjectCommand({
                Bucket: 'notetaking123',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            // Send the fiel
            await s3Client.send(command)
            publishLog(`uploaded ${file}`)
            console.log('uploaded', filePath)
        }
        publishLog(`Done`)
        console.log('Done...')

        // Disconnect the Redis Server so that docker can shutdown :) 
        publisher.disconnect();
        console.log("Container Closed Successfully!!")
    })
}

// Call the function

init()