const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        console.error(`Port ${port} requires elevated privileges`);
    } else if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
    } else {
        console.error(`Error: ${err.message}`);
    }
});
