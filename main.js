const WebSocket = require('ws');

// WebSocket 서버 생성
const wss = new WebSocket.Server({ port: 3001 });

// 연결된 모든 클라이언트 저장할 배열
const clients = [];
const nameFound = [];

// 클라이언트 연결 시 이벤트 리스너
wss.on('connection', function connection(ws) {
  // 연결된 클라이언트를 배열에 추가
  clients.push(ws);
  // 클라이언트로부터 메시지 수신 시 이벤트 리스너
  ws.on('message', function incoming(message) {
    date = JSON.parse(message.toString())
    if (date.type == 'join') {
      nameFound.push(date.name)
    }
    ws.send(message.toString().replace("<script>", ""));
    // 연결된 모든 클라이언트에게 메시지 전송
    clients.forEach(function(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString()); // Send message to each client except the sender
        }
    });
  });

  // 클라이언트 연결 종료 시 이벤트 리스너
  ws.on('close', function close() {
    // 배열에서 해당 클라이언트 제거

    // 연결된 모든 클라이언트에게 메시지 전송

    clients.forEach(function(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({type: "exit", name: nameFound[clients.indexOf(ws)]})); // Send message to each client except the sender
      }
    });
    nameFound.splice(clients.indexOf(ws), 1);
    clients.splice(clients.indexOf(ws), 1);
  });
});
