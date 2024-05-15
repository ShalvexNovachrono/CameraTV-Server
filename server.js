console.clear();
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        if (data.type === 'image') {
            const newData = {
                "type": "image",
                "data": Buffer.from(data.image, 'base64').toString('base64')
            }
            
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(newData));
                }
            });

        } else if (data.type === 'setUsernameToWs') {
            const username = data.username;
            clients.set(ws, username);
            console.log(`User ${username} has joined, username: ${username} -> ${ws}`);
        }
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
        clients.forEach((value, key) => {
            if (key === ws) {
                clients.delete(key);
                console.log(`User ${value} disconnected`);
            }
        });
    });
});
