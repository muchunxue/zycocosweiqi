import http from './network/httpServer';

var wskdata = require("./wskdata.js");
cc.Class({
    extends: cc.Component,

    properties: {

        tipLabel: {
            default: null,
            type: cc.Label
        },

        user: {
            default: null,
            type: cc.EditBox
        },

        password: {
            default: null,
            type: cc.EditBox
        },
        datanode: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.ws = new WebSocket('ws://175.24.183.104:8182');
        //开启websocket

        //websocket服务器连接时启用
        this.ws.onopen = (event) => {
            console.log("event========");
            console.log(event);
            console.log("event+++++++++");
        }

        let that = this;

        //接受websocket的数据
        this.ws.onmessage = (event) => {
            console.log("onmessage========");
            console.log(event);
            console.log("onmessage========");
        }

    },

    start() {

    },

    // update (dt) {},

    httpRequest() {
        const type = 'login';
        const inputuser = this.user.string;
        const inputpassword = this.password.string;
        const methodid = '0';
        let obj = {
            url: 'http://175.24.183.104:8181',
            data: {
                type,
                methodid,
                inputuser,
                inputpassword,
            },
            success: (res) => {
                var yess = res.info;
                console.log(yess)
            },
            fail: (res) => {
                console.log(res);
                var respar = JSON.parse(res)
                if (respar.message == 'online') {
                    console.log('允许登录')
                    const namevalue = respar.name;
                    console.log(namevalue);
                    this.chushihua(inputuser, namevalue);
                    this.qiehuanchat();
                }
                else { console.log('不允许登录') }
            }
        }
        http.request(obj);
    },

    qiehuanchat() {
        cc.director.loadScene("chat")
    },
    chushihua(id, names) {
        const data = cc.find("wskdata");
        data.id = id;
        //将id传给常驻节点
        data.names = names;

        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'id'; //请求类型
            const newdata = {
                type,
                id,
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
            console.log("发出消息测试");
        }
    },
});
//respar
