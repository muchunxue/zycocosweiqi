const mysql = require('mysql')

const db = mysql.createPool(
    {
        host: '127.0.0.1',//数据库ip地址
        user: 'root',//登录数控账号
        password: 'admin123',//登录数据库密码
        database: 'username'//指定哪个数据库
    }
);

function sqld(data, meth) {
    return new Promise((yes, no) => {
        const player = { id: data.id, password: data.password, name: data.name };

        //插入属性方法
        const sqlstr = 'INSERT INTO user(id,password,name) VALUES(?,?,?)';

        //查询属性方法
        const sql = 'SELECT * FROM user WHERE id = ?';

        //更新在线状态
        const online = 'UPDATE user SET state = online, WHERE id = ?';

        //更新离线状态
        const unonline = 'UPDATE user SET state = unonline, WHERE id = ?';

        //获取name方法
        const getname = 'SELECT name FROM user WHERE id = ?';
        if (meth === '1') {
            //插入值
            db.query(sqlstr, [player.id, player.password, player.name], (err, results) => {
                if (err) return console.log(err.message);//添加失败

                //注意：执行insert into插入语句，results是一个对象
                //可以通过affectedRows属性，来判断是否插入数据成功
                if (results.affectedRows === 1) {
                    console.log('修改数据成功');
                    yes('yes');
                }
            })
        }
        else {
            //查询值
            db.query(sql, [player.id], (err, results) => {
                if (results.length === 0) {
                    console.log('用户名不存在');
                    no('no')
                } else {
                    // 如果用户名存在，检查密码
                    const user = results[0];
                    if (user.password === player.password) {
                        db.query(getname, [player.id], (error, results) => {
                            const nameValue = results[0].name;
                            yes(nameValue);
                        })

                    } else {
                        console.log('密码不正确');
                        no('no')
                    }

                }
            })
        }
    });
};

module.exports = {
    sqld
};