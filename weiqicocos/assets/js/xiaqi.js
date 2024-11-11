var id = 0;
var onlyid = 0;
var roomid = 0;

var state = 0;
//标识是否可以下子的状态
console.log()
var h = 0;
var b = 0;
var a = 0;
//分别代表自己和对手的分数,以及场上棋子的数量

// 建立一个二维数组来存储棋盘状态
var chessarr = new Array();

for (let row = 0; row < 19; row++) {
    chessarr[row] = new Array();
    for (let col = 0; col < 19; col++) {
        chessarr[row][col] = 0; // 初始化为0，表示没有棋子
    }
}

// 建立一个二维数组来存储棋盘上每一个棋子的气
var qiarr = new Array();

for (let row = 0; row < 19; row++) {
    qiarr[row] = new Array();
    for (let col = 0; col < 19; col++) {
        qiarr[row][col] = 4; // 初始化为4，表示每一个棋子的初始气为4
    }
}

//建立一个二维数组用来代表双方在棋盘上的领地
var fenarr = new Array();

for (let row = 0; row < 19; row++) {
    fenarr[row] = new Array();
    for (let col = 0; col < 19; col++) {
        fenarr[row][col] = 0; // 初始化为0，1表示自己的领地，2表示敌人的领地
    }
}
//------------------------------------------------------------------------

cc.Class({
    extends: cc.Component,

    properties: {
        qizi: {
            default: null,
            type: cc.Prefab,
        },
        qizibai: {
            default: null,
            type: cc.Prefab,
        },
        biaozhu: {
            default: null,
            type: cc.Prefab,
        },
        //预制体

        biaozhu: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        for (let row = 0; row < 19; row++) {
            for (let col = 0; col < 19; col++) {
                chessarr[row][col] = 0; // 初始化为0，表示没有棋子
            }
        }
        console.log("xiaqi已经从wskdata获取gameid和roomid");
        const wskdata = cc.find("wskdata");
        id = wskdata.gameid
        roomid = wskdata.roomid
        console.log(id);
        console.log(roomid);
        if (id === 1) {
            state = 0;
            const zhuangtai = cc.find("Canvas/qipan/zhuangtai")
            var zhuangtaistr = zhuangtai.getComponent(cc.Label);
            zhuangtaistr.string = '请下子'
        }
        else if (id === 2) {
            state = 1;
            const zhuangtai = cc.find("Canvas/qipan/zhuangtai")
            var zhuangtaistr = zhuangtai.getComponent(cc.Label);
            zhuangtaistr.string = '请等待'
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        //监听触摸开始
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        //监听触摸移动
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        //监听触摸释放
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
        //监听触摸取消


        this.ws = new WebSocket('ws://175.24.183.104:8182');
        //开启websocket

        //websocket服务器连接时启用
        this.ws.onopen = (event) => {
            console.log("event========");
            console.log(event);
            console.log("event+++++++++");
            this.chushihua();
            //this.touxiangchushihua();
        }

        // let that = this;

        //接受websocket的数据
        this.ws.onmessage = (event) => {
            console.log("xiaqionmessage========");
            console.log(event);
            var dataes = JSON.parse(event.data);
            console.log("dataes.type");
            console.log(dataes.type);
            console.log("onmessage========");

            //执行下棋
            if (dataes.type == "pos") {
                console.log('已经接收到服务器传来的pos')
                var position = dataes.pos;
                var color = dataes.color;
                console.log("pos");
                console.log(color);
                console.log(position);
                this.createnewqizi(position, color);
                state = 0;
                const zhuangtai = cc.find("Canvas/qipan/zhuangtai")
                var zhuangtaistr = zhuangtai.getComponent(cc.Label);
                zhuangtaistr.string = '请下子'
            }

            //结束请求
            if (dataes.type == "renshu") {
                const jieshu = cc.find("Canvas/qipan/renshukuang");
                jieshu.active = true;
                console.log(jieshu)
            }
            //同意
            if (dataes.type == "yes") {
                const dengdai = cc.find("Canvas/qipan/dengdaikuang");
                const renshu = cc.find("Canvas/qipan/renshukuang");
                dengdai.active = false;
                renshu.active = false;
                state = 1;
                this.quxiao()
                this.jieshuxiaohui()
                h = 0;
                b = 0;
            }
            //拒绝
            if (dataes.type == "no") {
                const jieshu = cc.find("Canvas/qipan/dengdaikuang");
                jieshu.active = false;
            }
            if (dataes.type == "name") {
                this.touxiang(dataes.id, dataes.names)
                console.log('接收到name了')
            }
        }
    },

    start() {

    },

    // update (dt) {},
    onTouchStart(e) {
        //显示位置标注
        // const pos = e.getLocation()
        // const nodepos = this.xyposition(pos);
        // this.newbiaozhu(nodepos);
    },

    //-------------
    onTouchMove(e) {
        //显示位置标注
        // const pos = e.getLocation()
        // const nodepos = this.xyposition(pos);
        // this.newbiaozhu(nodepos);
    },

    //---------------
    onTouchEnd(e) {
        //执行下子
        console.log('准备执行下棋')
        const wskdata = cc.find("wskdata");
        id = wskdata.gameid
        roomid = wskdata.roomid
        onlyid = wskdata.id
        console.log(id)
        console.log(state)
        const pos = e.getLocation()
        const nodepos = this.xyposition(pos);
        const x = ((nodepos.x - 2.5) / 31.5);
        const y = ((nodepos.y - 2.5) / 31.5);
        if (id == 1 && state == 0 && chessarr[x][y] === 0) {
            this.createnewqizi(nodepos, 'hei');
            this.qizipos(nodepos, 'hei');
            console.log('已经执行下棋')
        }
        else if (id == 2 && state == 0 && chessarr[x][y] === 0) {
            this.createnewqizi(nodepos, 'bai');
            this.qizipos(nodepos, 'bai');
            console.log('已经执行下棋')
        };
    },

    //----------------
    onTouchCancel() {
    },

    //实例化棋子并加启用chucun函数
    createnewqizi(pos, color) {
        a++;
        state = 1;
        const zhuangtai = cc.find("Canvas/qipan/zhuangtai")
        var zhuangtaistr = zhuangtai.getComponent(cc.Label);
        zhuangtaistr.string = '请等待'
        var x = pos.x;
        var y = pos.y;
        console.log(x, y);
        //获取触摸事件e的触摸位置，赋值给pos
        if (color === 'hei') {
            const newqizi = cc.instantiate(this.qizi);
            newqizi.setPosition(x, y);
            this.node.addChild(newqizi);
            //将棋子部署在棋盘上
            console.log("已经部署")
            const tag = this.cunchu(pos, color);
            //将棋子的信息存储在二维数组中并返回棋子在数组中的位置
            // console.log("tag");
            // console.log(tag);

            const chartag = tag.join('_');
            newqizi.name = chartag;
            //将返回的值转换成字符串，赋值给newqizi.name
        }
        else {
            const newqizi = cc.instantiate(this.qizibai);
            newqizi.setPosition(x, y);
            this.node.addChild(newqizi);
            //将棋子部署在棋盘上

            console.log("已经部署")
            const tag = this.cunchu(pos, color);
            //将棋子的信息存储在二维数组中并返回棋子在数组中的位置

            const chartag = tag.join('_');
            newqizi.name = chartag;
            //将返回的值转换成字符串，赋值给newqizi.name
        }
        if (a === 361) {
            this.quxiao();
        }
    },

    //将位置存储在一个二维函数中，并返回一个位置
    cunchu(pos, color) {
        const x = ((pos.x - 2.5) / 31.5);
        const y = ((pos.y - 2.5) / 31.5);
        console.log("棋子坐标：", x, y);

        if (color === 'hei')
            chessarr[x][y] = 1;
        else
            chessarr[x][y] = 2;
        //给数组存值以代表黑白棋子，1黑2白

        const newtag = [x, y];
        console.log('位置：');
        console.log(newtag);

        this.qi();
        this.count();
        this.gengxin();
        console.log('销毁前');
        console.log(chessarr);
        return newtag;
    },

    //世界坐标转换节点坐标再转换为棋子坐标tag
    xyposition(pos) {

        //坐标转换
        const nodepos = this.node.convertToNodeSpaceAR(pos);
        console.log("转换前坐标")
        console.log(nodepos.x, nodepos.y);
        var x = nodepos.x;
        var y = nodepos.y;
        //将大坐标转换成小的坐标便于计算
        if (x >= 2.5) {
            x = (x - 10) / 31.5;
        }
        else {
            s
            x = 0;
        }
        if (y >= 2.5) {
            y = (y - 15) / 31.5;
        }
        else {
            x = 0;
        }

        x = Math.round(x);
        y = Math.round(y);


        nodepos.x = x * 31.5 + 2.5;
        nodepos.y = y * 31.5 + 2.5;

        console.log("转换后坐标")
        console.log(nodepos.x, nodepos.y,);
        return nodepos;
    },

    ////位置标注
    newbiaozhu(pos) {
        var x = pos.x;
        var y = pos.y;
        console.log(x, y);
        //获取触摸事件e的触摸位置，赋值给pos
        const biaozhu = cc.instantiate(this.biaozhu);
        biaozhu.setPosition(x, y);
        this.node.addChild(biaozhu);
    },

    //棋子销毁
    tizi(x, y) {
        const tag = [x, y];
        const charnewtag = tag.join('_');
        const myNode = this.node.getChildByName(charnewtag);
        //根据名称找到节点
        if (myNode) {
            myNode.destroy();
        }
    },

    //判定棋子的气，遍历数组，并根据数组内存入的是1还是2进行不同操作
    qi() {
        for (let row = 0; row < 19; row++) {
            for (let col = 0; col < 19; col++) {
                if (chessarr[row][col] === 1 || chessarr[row][col] === 2) {
                    this.jianqi(row, col);
                    console.log(qiarr[row][col])
                }
            }
        }
        //先完成初步计算每一个棋子的气

        for (let row = 0; row < 19; row++) {
            for (let col = 0; col < 19; col++) {
                if (chessarr[row][col] === 1 && qiarr[row][col] <= 0) {
                    this.yanshen(row, col, 1)
                    console.log(qiarr[row][col])
                }
                else if (chessarr[row][col] === 2 && qiarr[row][col] <= 0) {
                    this.yanshen(row, col, 2)
                    console.log(qiarr[row][col])
                }
            }
        }
        //完成每一个棋子生死的判定

        for (let row = 0; row < 19; row++) {
            for (let col = 0; col < 19; col++) {
                if (qiarr[row][col] == 0) {
                    console.log("执行销毁判断")
                    if (chessarr[row][col] == 1) {
                        chessarr[row][col] = 2;
                    }
                    else if (chessarr[row][col] == 2) {
                        chessarr[row][col] = 1;
                    }
                    this.tizi(row, col);
                }
            }
        }
        //完成死亡棋子的节点销毁

        for (let row = 0; row < 19; row++) {
            qiarr[row] = new Array();
            for (let col = 0; col < 19; col++) {
                qiarr[row][col] = 4; // 初始化为4，表示每一个棋子的初始气为4
            }
        }
        //初始化气数组，以便后续继续进行此函数
    },
    //辅助qi函数的运算-----------------------------

    //计算每一个单独棋子的气1
    jianqi(row, col) {
        console.log("执行jianqi函数")
        var rown = row - 1
        var coln = col - 1
        var rowa = row + 1
        var cola = col + 1

        if (rown < 0 || chessarr[rown][col] === 1 || chessarr[rown][col] === 2) {
            qiarr[row][col] = qiarr[row][col] - 1
        }
        //向上查询

        if (rowa > 18 || chessarr[rowa][col] === 1 || chessarr[rowa][col] === 2) {
            qiarr[row][col] = qiarr[row][col] - 1
        }
        //向下查询

        if (coln < 0 || chessarr[row][coln] === 1 || chessarr[row][coln] === 2) {
            qiarr[row][col] = qiarr[row][col] - 1
        }
        //向左查询

        if (cola > 18 || chessarr[row][cola] === 1 || chessarr[row][cola] === 2) {
            qiarr[row][col] = qiarr[row][col] - 1
        }
        //向右查询
    },


    //调用辅助函数来判断当前选中的这个棋子是否有气或者可以通过相邻棋子获得气，如果有气，则设置该位置qiarr数组内的值为1
    yanshen(row, col, type) {
        console.log("执行yanshen函数")
        this.up(row, col, type, row, col)
        this.down(row, col, type, row, col)
        this.left(row, col, type, row, col)
        this.right(row, col, type, row, col)
    },

    up(row, col, type, rown, coln) {
        row = row - 1;
        if (type === chessarr[row][col]) {
            if (qiarr[row][col] > 0) {
                qiarr[rown][coln] = 1;
            }
            else {
                this.up(row, col, type, rown, coln)
                this.left(row, col, type, rown, coln)
                this.right(row, col, type, rown, coln)
            }
        }
        else {
            return 0;
        }
    },

    down(row, col, type, rown, coln) {
        row = row + 1;
        if (type === chessarr[row][col]) {
            if (qiarr[row][col] > 0) {
                qiarr[rown][coln] = 1;
            }
            else {
                this.down(row, col, type, rown, coln)
                this.left(row, col, type, rown, coln)
                this.right(row, col, type, rown, coln)
            }
        }
        else {
            return 0;
        }
    },
    left(row, col, type, rown, coln) {
        col = col - 1;
        if (type === chessarr[row][col]) {
            if (qiarr[row][col] > 0) {
                qiarr[rown][coln] = 1;
            }
            else {
                this.up(row, col, type, rown, coln)
                this.left(row, col, type, rown, coln)
                this.down(row, col, type, rown, coln)
            }
        }
        else {
            return 0;
        }
    },
    right(row, col, type, rown, coln) {
        col = col + 1;
        if (type === chessarr[row][col]) {
            if (qiarr[row][col] > 0) {
                qiarr[rown][coln] = 1;
            }
            else {
                this.up(row, col, type, rown, coln)
                this.right(row, col, type, rown, coln)
                this.down(row, col, type, rown, coln)
            }
        }
        else {
            return 0;
        }
    },

    //辅助qi函数的运算-----------------------------

    qizipos(pos, color) {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'pos'; //请求类型
            const newdata = {
                type,
                pos,
                color,
                roomid,
                gameid: id,
                id: onlyid
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
        }
    },

    quxiao() {
        const jieshu = cc.find("Canvas/qipan/quxiao");
        jieshu.active = true;
        this.count();
        this.jieshu();
    },
    count() {
        var hh = 0;
        var bb = 0;
        for (let row = 0; row < 19; row++) {
            for (let col = 0; col < 19; col++) {
                if (chessarr[row][col] === 1) {
                    hh = hh + 1;
                }
                else if (chessarr[row][col] === 2) {
                    bb = bb + 1;
                }
            }
        }
        //黑白双方站点得分计算
        h = hh;
        b = bb;
        const hei = cc.find("Canvas/qipan/quxiao/hei")
        const bai = cc.find("Canvas/qipan/quxiao/bai")
        var labelhei = hei.getComponent(cc.Label);
        var labelbai = bai.getComponent(cc.Label);
        labelhei.string = '黑方得分为：' + h;
        labelbai.string = '白方得分为：' + b;
    },

    jieshu() {
        if ((h - 7) > b) {
            if (id === 1) {
                console.log('你赢了')
                const win = cc.find("Canvas/qipan/quxiao/shengfu")
                console.log(win)
                var winstr = win.getComponent(cc.Label);
                winstr.string = '恭喜你，你赢下了本场对局'
            }
            else {
                console.log('你输了')
                const win = cc.find("Canvas/qipan/quxiao/shengfu")
                console.log(win)
                var winstr = win.getComponent(cc.Label);
                winstr.string = '很遗憾，你输掉了本场对局'
            }
        }
        else {
            if (id === 1) {
                console.log('你输了')
                const win = cc.find("Canvas/qipan/quxiao/shengfu")
                console.log(win)
                var winstr = win.getComponent(cc.Label);
                winstr.string = '很遗憾，你输掉了本场对局'
            }
            else {
                console.log('你赢了')
                const win = cc.find("Canvas/qipan/quxiao/shengfu")
                console.log(win)
                var winstr = win.getComponent(cc.Label);
                winstr.string = '恭喜你，你赢下了本场对局'
            }
        }
    },

    qiehuanchat() {
        cc.director.loadScene("chat")
    },

    chushihua() {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'id'; //请求类型
            const wskdata = cc.find("wskdata");
            const ids = wskdata.id;
            const newdata = {
                type,
                id: ids,
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
        }
    },

    renshu() {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'renshu'; //请求类型
            const newdata = {
                type,
                roomid,
                gameid: id
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
            const jieshu = cc.find("Canvas/qipan/dengdaikuang");
            jieshu.active = true;
        }
    },

    yes() {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'yes'; //请求类型
            const newdata = {
                type,
                roomid,
                gameid: id
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
            //const yes = cc.find("Canvas/qipan/dengdaikuang");
            const jieshu = cc.find("Canvas/qipan/renshukuang");
            jieshu.active = false;
            //console.log('yes')
            //console.log(yes)
            //yes.active = false;
            this.quxiao();
        }
    },

    no() {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'no'; //请求类型
            const newdata = {
                type,
                roomid,
                gameid: id
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
            const jieshu = cc.find("Canvas/qipan/renshukuang");
            jieshu.active = false;
            console.log('no')
        }
    },
    gengxin() {
        const heifang = cc.find("Canvas/qipan/heifangshimu")
        var heistr = heifang.getComponent(cc.Label);
        heistr.string = '黑方实目:' + `${h}` + '个'

        const baifang = cc.find("Canvas/qipan/baifangshimu")
        var baistr = baifang.getComponent(cc.Label);
        baistr.string = '白方实目:' + `${b}` + '个'
    },
    touxiang(otherid, othername) {
        const wskdata = cc.find("wskdata");
        const myname = wskdata.names;
        const myid = wskdata.id;
        const mygameid = wskdata.gameid;
        const mynames = cc.find("Canvas/myname")
        const myids = cc.find("Canvas/myid")
        const othernames = cc.find("Canvas/othername")
        const otherids = cc.find("Canvas/otherid")
        const myfang = cc.find("Canvas/myfang")
        const otherfang = cc.find("Canvas/otherfang")
        var mynamestr = mynames.getComponent(cc.Label);
        var myidstr = myids.getComponent(cc.Label);
        var myfangstr = myfang.getComponent(cc.Label);
        var otherfangstr = otherfang.getComponent(cc.Label);
        var othernamestr = othernames.getComponent(cc.Label);
        var otheridstr = otherids.getComponent(cc.Label);
        mynamestr.string = '用户名:' + `${myname}`
        myidstr.string = 'id:' + `${myid}`
        othernamestr.string = '用户名:' + `${othername}`
        otheridstr.string = 'id:' + `${otherid}`
        if (mygameid === 1) {
            myfangstr.string = '黑方'
            otherfangstr.string = '白方'
        }
        else {
            myfangstr.string = '白方'
            otherfangstr.string = '黑方'
        }

    },
    touxiangchushihua() {
        if (this.ws.readyState === WebSocket.OPEN) {
            const type = 'name'; //请求类型
            const wskdata = cc.find("wskdata");
            const ids = wskdata.id;
            const names = wskdata.names;
            const roomid = wskdata.roomid;
            const gameid = wskdata.gameid
            const newdata = {
                type,
                id: ids,
                names,
                roomid,
                gameid: gameid
            };
            const data = JSON.stringify(newdata);
            this.ws.send(data);
            console.log('发送name请求啦')
            console.log(roomid)
            console.log(ids)
        }
    },

    jieshuxiaohui() {
        //执行最终销毁
        console.log('最终销毁')
        for (let row = 0; row < 19; row++) {
            for (let col = 0; col < 19; col++) {
                if (chessarr[row][col] != 0) {
                    this.tizi(row, col);
                }
            }
        }
        //完成死亡棋子的节点销毁
    },
});