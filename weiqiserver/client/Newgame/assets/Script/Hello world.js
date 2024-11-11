import http from './network/httpServer';
cc.Class({
    extends: cc.Component,

    properties: {
        subButton:{
            default:null,
            type: cc.Button
        },

        tipLabel:{
            default:null,
            type:cc.Label
        },

        user: {
            default:null,
            type: cc.EditBox
        },

        password:{
            default:null,
            type: cc.EditBox
        },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.ws = new WebSocket('ws://127.0.0.1:8182');
        //开启websocket

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
            that.tipLabelWS.string = event.data;
        }
     },

    start () {

    },

    // update (dt) {},

    httpRequest(){
        const inputuser = this.user.string;
        const inputpassword = this.password.string;
        let obj = {
            url: 'http://127.0.0.1:8181',
            data:{
                inputuser,
                inputpassword,
            },
            success : (res) => {
                this.tipLabel.string = res.info;
                console.log(inputuser);
            },
            fail: (res) => {
                console.log("fail!");
                console.log(res);
                console.log(inputuser);
            }
        }
        http.request(obj);
    },
});
