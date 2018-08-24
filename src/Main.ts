import koa = require('koa');
import * as fs from 'fs';
import { Socket } from './net/Socket'

const app = new koa();

//socket 服务
new Socket({ port: 3001 });


app.use(async (ctx, next) => {
    await next();
    // console.log(ctx.request.path)
    ctx.response.type = 'text/html';
    ctx.response.body = fs.createReadStream('./index.html');
});

app.listen(3000);
console.log('app started at port 3000...');

