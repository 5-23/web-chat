const WebSocket = require('ws');
const express = require('express'); const app = express();
var cors = require('cors')

// WebSocket 서버 생성
const wss = new WebSocket.Server({ port: 3001 });

// 연결된 모든 클라이언트 저장할 배열
const clients = [];
const userInfo = [];
const channelInfo = {};

// 클라이언트 연결 시 이벤트 리스너
wss.on('connection', function connection(ws) {
  // 연결된 클라이언트를 배열에 추가
  clients.push(ws);
  // 클라이언트로부터 메시지 수신 시 이벤트 리스너
  ws.on('message', function incoming(message) {
    date = JSON.parse(message.toString())
    if (date.type == 'join') {
      if (!channelInfo[date.channel]) {
        channelInfo[date.channel] = {user: 0, date: new Date()};
      }
      userInfo.push({name: date.name, channel: date.channel});
      channelInfo[date.channel].user += 1;
      console.log("JOIN", channelInfo)
    }
    clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN) {
          if (userInfo[clients.indexOf(client)] && date.channel == userInfo[clients.indexOf(client)].channel) {
            client.send(message.toString());
          }
        }
    });
  });

  // 클라이언트 연결 종료 시 이벤트 리스너
  ws.on('close', function close() {
    channelInfo[userInfo[clients.indexOf(ws)].channel].user -= 1;
    if (channelInfo[userInfo[clients.indexOf(ws)].channel].user == 0) {
      delete channelInfo[userInfo[clients.indexOf(ws)].channel];
    }
    
    clients.forEach(function(client) {
      if (client.readyState === WebSocket.OPEN &&
        userInfo[clients.indexOf(ws)] && userInfo[clients.indexOf(client)] &&
        userInfo[clients.indexOf(ws)].channel == userInfo[clients.indexOf(client)].channel) {
          client.send(JSON.stringify({type: "exit", name: userInfo[clients.indexOf(ws)].name, channel: userInfo[clients.indexOf(ws)].channel}));
      }
    });
    userInfo.splice(clients.indexOf(ws), 1);
    clients.splice(clients.indexOf(ws), 1);
    console.log("EXIT", channelInfo)
  });
});


var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.get('/channelInfo', cors(corsOptions), (req, res) => { res.json(channelInfo); });

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.listen(3002, () => { console.log('Server is running on port 3002'); });