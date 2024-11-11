//const { Module } = require('module');
const ws = require("nodejs-websocket");

var number = 0;
var countid = 0;
var countroom = 0;
//计数需要

const clients = {}
var playerarr = new Array()
//存值需要

var roomarr = new Array();
for (let row = 0; row < 100; row++) {
    roomarr[row] = new Array();
    for (let col = 0; col < 2; col++) {
        roomarr[row][col] = 0; // 初始化为0
    }
}
//特殊数组


function createServer() {
    let server = ws.createServer(connection => {
        console.log('websocket已连接');


        function sendToClient(clientId, data) {
            const client = clients[clientId]
            if (client) {
                client.send(data)
            }
        }
        //创建发送消息的方法

        function pipeiroom(roomid) {
            var ressone = {
                type: "pipei",
                gameid: 1,
                roomid
            }
            var resstwo = {
                type: "pipei",
                gameid: 2,
                roomid
            }
            var resone = JSON.stringify(ressone);
            var restwo = JSON.stringify(resstwo);
            //创建对象并转换成json格式

            //将数据传给对应房间内的两个玩家
            sendToClient(roomarr[roomid][1], resone)
            sendToClient(roomarr[roomid][2], restwo)
        }

        //客户端向服务器发送字符的监听函数--------------------------------------------
        connection.on("text", result => {
            console.log('connection.on -> text', result)

            var dataes = JSON.parse(result);
            //接受并解析传来的数据

            if (dataes.type === "chat") {
                var ress = {
                    id: dataes.id,
                    type: "chat",
                    text: dataes.text
                }

                var res = JSON.stringify(ress);
                //接受客户端发来的消息，统一发送到所有连接到websocket的客户端
                server.connections.forEach((client) => {
                    client.sendText(res);
                });
            }
            //聊天室回复方法

            if (dataes.type == "pipei") {
                number++;
                playerarr[number] = dataes.id
                console.log('pipei')
                console.log(playerarr[number])
                if (number >= 2) {
                    number = 0;
                    //初始化number以便下次执行
                    countroom = countroom + 1;
                    roomarr[countroom][0] = countroom;
                    var i = Math.floor(Math.random() * 10) + 1;
                    //创建一个1到10之间的随机数
                    if (i / 2 != 0) {
                        roomarr[countroom][1] = playerarr[1]
                        roomarr[countroom][2] = playerarr[2]
                        console.log('roomarr1')
                        console.log(roomarr[countroom][1])
                        console.log(roomarr[countroom][2])
                        pipeiroom(countroom)
                    }
                    else {
                        roomarr[countroom][1] = playerarr[2]
                        roomarr[countroom][2] = playerarr[1]
                        console.log('roomarr2')
                        console.log(roomarr[countroom][1])
                        console.log(roomarr[countroom][2])
                        pipeiroom(countroom)
                    }
                    //在房间二维数组中依次存入新房间编号，以及房间内玩家的id以便后续找到此房间
                }
            }
            //匹配方法

            if (dataes.type === "id") {
                var gamerid = dataes.id;
                clients[gamerid] = connection;
                console.log(`id为${gamerid}上线了,已分配线路`)
            }
            //用户匹配id方法

            if (dataes.type === "pos") {
                const roomid = dataes.roomid;
                const gameid = dataes.gameid;
                const pos = dataes.pos;
                const color = dataes.color;
                //获取刚刚下棋那一方的房间号，id，房间内id
                var othergamer = 0;
                if (gameid == 1) {
                    othergamer = 2;
                }
                else if (gameid == 2) {
                    othergamer = 1;
                }
                var ida = {
                    type: "pos",
                    pos: pos,
                    color: color,
                }
                var otherid = roomarr[roomid][othergamer];
                console.log(otherid)
                var res = JSON.stringify(ida);
                sendToClient(otherid, res)
            }
            //下棋方法

            if (dataes.type === "quxiaopipei") {
                number--
            }
            //取消匹配
            if (dataes.type === "renshu") {
                const roomid = dataes.roomid;
                const gameid = dataes.gameid;
                var othergamer = 0;
                if (gameid == 1) {
                    othergamer = 2;
                }
                else if (gameid == 2) {
                    othergamer = 1;
                }
                var ida = {
                    type: "renshu",
                }
                var otherid = roomarr[roomid][othergamer];
                console.log(otherid)
                var res = JSON.stringify(ida);
                sendToClient(otherid, res)
            }
            //请求结束游戏方法
            if (dataes.type === "yes") {
                const roomid = dataes.roomid;
                const gameid = dataes.gameid;
                var othergamer = 0;
                if (gameid == 1) {
                    othergamer = 2;
                }
                else if (gameid == 2) {
                    othergamer = 1;
                }
                var ida = {
                    type: "yes",
                }
                var id = roomarr[roomid][gameid];
                var otherid = roomarr[roomid][othergamer];
                var res = JSON.stringify(ida);
                sendToClient(otherid, res)
                sendToClient(id, res)
            }
            if (dataes.type === "no") {
                const roomid = dataes.roomid;
                const gameid = dataes.gameid;
                var othergamer = 0;
                if (gameid == 1) {
                    othergamer = 2;
                }
                else if (gameid == 2) {
                    othergamer = 1;
                }
                var ida = {
                    type: "no",

                }
                var otherid = roomarr[roomid][othergamer];
                console.log(otherid)
                var res = JSON.stringify(ida);
                sendToClient(otherid, res)
            }
            //同意和拒绝结束游戏的请求

            if (dataes.type === "name") {
                const roomid = dataes.roomid;
                const gameid = dataes.gameid;
                const ids = dataes.id;
                const names = dataes.names;
                var othergamer = 0;
                if (gameid == 1) {
                    othergamer = 2;
                }
                else if (gameid == 2) {
                    othergamer = 1;
                }
                var ida = {
                    type: "name",
                    id: ids,
                    names: names
                }
                var otherid = roomarr[roomid][othergamer];
                console.log(otherid)
                var res = JSON.stringify(ida);
                sendToClient(otherid, res)
                console.log("收到name请求了")
                console.log(ids)
                console.log(otherid)
            }//发送自己id和name的方法


        })

        //客户端向服务器发送二进制时的监听函数
        connection.on("binary", result => {
            console.log('connection.on -> binary', result);
        });

        //客户端连接到服务器时的监听函数
        connection.on("connect", result => {
            console.log('connection.on -> connect', result);
        });

        //客户端断开与服务器的连接时的监听函数
        connection.on("close", result => {
            console.log('connection.on -> close', result);
        });
        //客户端与服务器的连接异常时的监听函数
        connection.on("error", result => {
            console.log('connection.on -> error', result);
        });
    }).listen(8182);
    // 1. result: 用于存储消息内容
    // 2. client: 用于迭代连接的客户端

    return server;

};


module.exports = {
    createServer
}