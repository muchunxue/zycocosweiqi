
var wskdata = require("./wskdata.js");

var id = 0;
window.chatbox = cc.Class({
    extends: cc.Component,
    properties: {
        edbox: {
            default: null,
            type: cc.EditBox
        },
        content: {
            default: null,
            type: cc.Node
        },
        newitem: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.ws = new WebSocket('ws://127.0.0.1:8182');
        //开启websocket

        //websocket服务器连接时启用
        this.ws.onopen = (event) => {
            console.log("event========");
            console.log(event);
            console.log("event+++++++++");
            this.chushihua();
        }

        let that = this;

        //接受websocket的数据
        this.ws.onmessage = (event) => {
            console.log("boxonmessage========");
            console.log(event);
            console.log("onmessage========");

            var dataes = JSON.parse(event.data);

            if (dataes.type === "chat") {
                var item = cc.instantiate(this.newitem)
                var label = item.getComponent(cc.Label);
                label.string = dataes.text;
                this.content.addChild(item);
            }
            else if (dataes.type === "pipei") {
                var gameid = dataes.gameid;
                var roomid = dataes.roomid;
                this.datagame(gameid, roomid);
                this.qiehuan();
                console.log("匹配成功");
            }
            else if (dataes.type === "id") {
                id = dataes.id;
                console.log("id========");
                console.log(id);
                this.data(id);
            }
        }
        this.touxiang();
    },

    start() {
    },

    wsRequest() {
        const wskdata = cc.find("wskdata");
        const names = wskdata.names;
        const text = `${names}:` + this.edbox.string;
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'chat';
            const newdata = {
                type,
                id,
                text
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
        }
        this.edbox.string = '';
    },
    pipei() {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'pipei'; //请求类型
            const newdata = {
                type,
                id
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
        }
    },

    chushihua() {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'id'; //请求类型
            const wskdata = cc.find("wskdata");
            id = wskdata.id;
            const newdata = {
                type,
                id,
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
        }
    },
    quxiaopipei() {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'quxiaopipei'; //请求类型
            const newdata = {
                type,
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
            console.log("成功取消匹配")
        }
    },

    qiehuan() {
        cc.director.loadScene("qipan")
    },

    datagame(id, roomid) {
        const wskdata = cc.find("wskdata");
        wskdata.gameid = id
        wskdata.roomid = roomid
        console.log("chatbox已经给wskdata传输gameid");
        console.log(wskdata.gameid);
        console.log(wskdata.roomid);
    },

    touxiang() {
        const wskdata = cc.find("wskdata");
        const names = wskdata.names;
        id = wskdata.id;
        console.log("name为");
        console.log(names);
        const namess = cc.find("Canvas/names")
        const ids = cc.find("Canvas/ids")
        var namesstr = namess.getComponent(cc.Label);
        var idsstr = ids.getComponent(cc.Label);
        namesstr.string = '用户名:' + `${names}`
        idsstr.string = 'id:' + `${id}`
    },
    // update (dt) {},
});