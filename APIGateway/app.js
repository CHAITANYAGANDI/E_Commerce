const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


app.use('/api/user', createProxyMiddleware({
    target: 'http://localhost:7001',
    changeOrigin: true,
    pathRewrite: { '^/api/user': '/' },
}));


app.use('/api/admin', createProxyMiddleware({
    target: 'http://localhost:7002',
    changeOrigin: true,
    pathRewrite: { '^/api/admin': '/' },
}));


app.use('/api/products', createProxyMiddleware({
    target: 'http://localhost:7003',
    changeOrigin: true,
    pathRewrite: { '^/api/products': '/' },
}));


// app.use('/api/inventory', createProxyMiddleware({
//     target: 'http://localhost:7004',
//     changeOrigin: true,
//     pathRewrite: { '^/api/inventory': '/' },
// }));


// app.use('/api/orders', createProxyMiddleware({
//     target: 'http://localhost:7005',
//     changeOrigin: true,
//     pathRewrite: { '^/api/orders': '/' },
// }));

// app.use('/api/cart', createProxyMiddleware({
//     target: 'http://localhost:7006',
//     changeOrigin: true,
//     pathRewrite: { '^/api/cart': '/' },
// }));



app.listen(7000, () => {
    console.log('API Gateway running on http://localhost:7000');
});
