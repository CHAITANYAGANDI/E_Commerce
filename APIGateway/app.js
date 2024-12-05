const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const cors = require('cors');

app.use(cors());


app.set('trust proxy', true);

app.use((req, res, next) => {

    req.headers['x-original-url'] = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    next();
});

app.use('/api/user', createProxyMiddleware({
    target: 'http://localhost:7001',
    changeOrigin: true,
    pathRewrite: { '^/api/user': '/' },

}));

app.use('/api/amazon/products', createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    pathRewrite: { '^/api/amazon/products': '/' },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('x-original-url', req.headers['x-original-url']);
    }

}));

app.use('/api/walmart/products', createProxyMiddleware({
    target: 'http://127.0.0.1:8001',
    changeOrigin: true,
    pathRewrite: { '^/api/walmart/products': '/' },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('x-original-url', req.headers['x-original-url']);
    }

}));



app.listen(7000, () => {
    console.log('API Gateway running on http://localhost:7000');
});
