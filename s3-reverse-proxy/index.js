const app = require('express')();
const httpProxy = require("http-proxy")

// YOUR S3 PATH GOES HERE
const BASE_S3_PATH = 'https://<<BUCKET-NAME>>.s3.<<REGEION_NAME>>.amazonaws.com/__outputs'

// YOUR PROXY SERVER
const proxy = httpProxy.createProxy();

// LISTEN ON AnY Path
app.use((req, res) => {
    // take hostname
    const hostname = req.hostname;
    // take subdomain
    const subdomain = hostname.split('.')[0];
    // Create a url for s3 bucket
    const resolveTo = `${BASE_S3_PATH}/${subdomain}`
    // prxoy the web
    proxy.web(req, res, { target: resolveTo, changeOrigin: true })
})

// if index.html is not present then add .index.html
proxy.on("proxyReq", (proxyRed, req, res)=>{
    const url = req.url
    if(url=='/'){
        proxyRed.req+='index.html';
    }
})


// Start the proxy server .....
app.listen(5001, () => {
    console.log("Reverse Proxy Running on port 5001....")
})