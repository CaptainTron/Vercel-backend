const app = require('express')();
const httpProxy = require("http-proxy")

const BASE_S3_PATH = 'https://notetaking123.s3.ap-south-1.amazonaws.com/__outputs'
const proxy = httpProxy.createProxy();
app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    console.log(subdomain);
    const resolveTo = `${BASE_S3_PATH}/${subdomain}`
    proxy.web(req, res, { target: resolveTo, changeOrigin: true })
})

proxy.on("proxyReq", (proxyRed, req, res)=>{
    const url = req.url
    if(url=='/'){
        proxyRed.req+='index.html';
    }
})

app.listen(5001, () => {
    console.log("Reverse Proxy Running on port 5001....")
})