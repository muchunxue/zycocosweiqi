import http from './network/httpServer';

window.wskdata = cc.Class({
    extends: cc.Component,

    properties: {
        id: {
            default: 0,
            type: cc.Integer
        },
        gameid: {
            default: 0,
            type: cc.Integer
        },
        roomid: {
            default: 0,
            type: cc.Integer
        },
        chatbox_liaotian: {
            default: "",
        },
        names: {
            default: "",
        },
    },


    onLoad() {
        wskdata.instance = this
        //将当前实例标记为全局实例 

        cc.game.addPersistRootNode(this.node);
        //将节点设置为常驻
    },

    start() {

    },

    // update (dt) {},
});