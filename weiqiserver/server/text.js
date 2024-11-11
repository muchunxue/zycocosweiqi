//--
console.log(request.input);
var info = request.input;
var client_data = info.split(',')

if (client_data[0] == 'login') {
    data = {
        'name': client_data[1],
        'password': client_data[2],
        'success': function (jasondata) {
            console.log('登录成功' + jasondata)
            res.write(jasondata);
            res.end();
        },
        'fail': function (jasondata) {
            console.log('登录失败' + jasondata)
            res.write(jasondata);
            res.end();
        },
    };
}
//--