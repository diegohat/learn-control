// mock-server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Envia dados mockados a cada 2 segundos
  const interval = setInterval(() => {
    const mockData = JSON.stringify({
      kp: Math.random().toFixed(2),
      ki: Math.random().toFixed(2),
      kd: Math.random().toFixed(2),
      tau: 1,
      ts: 1,
    });
    ws.send(mockData);
  }, 2000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
