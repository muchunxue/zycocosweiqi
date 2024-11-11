import http from './network/httpServer';
cc.Class({
    extends: cc.Component,

    properties: {
        subButton: {
            default: null,
            type: cc.Button
        },

        user: {
            default: null,
            type: cc.EditBox
        },

        password: {
            default: null,
            type: cc.EditBox
        },

        namebox: {
            default: null,
            type: cc.EditBox
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    start() {

    },

    // update (dt) {},

    httpRequest() {
        const inputuser = this.user.string;
        const inputpassword = this.password.string;
        const name = this.namebox.string;
        const methodid = '1';
        let obj = {
            url: 'http://175.24.183.104:8181',
            data: {
                methodid,
                inputuser,
                inputpassword,
                name,
            },
            success: (res) => {
                // this.tipLabel.string = res.info;
                // console.log(inputuser);
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
