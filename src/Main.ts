import koa = require('koa');
import * as fs from 'fs';
import { Socket } from './net/Socket'
import { RedisCore } from './core/RedisCore';
import { UserData } from './data/UserData';

//开启redis
RedisCore.instance.init();

//设置用户列表数据
RedisCore.instance.getData('users', (val) => {
    let users = [];
    if (val) {
        users = JSON.parse(val);
    }
    UserData.instance.setUsers(users);
})

const app = new koa();

//socket 服务
new Socket({ port: 3001 });


app.use(async (ctx, next) => {
    await next();
    console.log(ctx.request.path)
    ctx.response.type = 'text/html';
    switch (ctx.request.path) {
        case '/':
            ctx.response.body = fs.createReadStream('./index.html');
            break;
        case '/1':
            ctx.response.body = fs.createReadStream('./index2.html');
            break;
    }

});

app.listen(3000);
console.log('app started at port 3000...');

