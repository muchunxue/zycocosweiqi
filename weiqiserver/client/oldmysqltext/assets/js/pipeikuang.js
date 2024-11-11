
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.active = false;
    },

    // update (dt) {},
    pipei() {
        this.node.active = true;
    },
    quxiaopipei() {
        this.node.active = false;
    }
});
