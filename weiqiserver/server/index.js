const http = require('http');
const url = require('url');
const sqld = require("./mysqln.js");
const wss = require("./websocketServer.js");


//ws.createServer();

http.createServer(function (req, res) {
    var request = url.parse(req.url, true).query
    res.setHeader("Access-Control-Allow-Origin", "*");//跨域

    //获取传入的三个值，用户id，密码，方法
    const nameid = request.inputuser;
    const passwordid = request.inputpassword;
    const meth = request.methodid;
    const name = request.name;
    console.log(`id为${nameid}的用户发来了http请求`)

    //接收对象
    const player = { id: nameid, password: passwordid, name: name };

    //传入用户的数据，自动执行注册或登录操作
    sqld.sqld(player, meth)
        .then(result => {
            const jsonData = {
                message: 'online',
                name: result,
            };
            res.write(JSON.stringify(jsonData));
            res.end();
            console.log(`向di为${nameid}的用户发送了http响应`)
        })
        .catch(error => {
            // 处理错误情况，error 包含 Promise 的 rejection 原因
            const jsonData = { messgae: 'unonline' };
            console.log(jsonData);
            res.write(JSON.stringify(jsonData));
            res.end();
            console.log(`向di为${nameid}的用户发送了http响应`)
        });

}).listen(8181);

wss.createServer();
//res.write(JSON.stringify(req));


console.log('服务器启动成功！');