const koa = require('koa');
const app = new koa();
const fs = require('fs');
// const socket = require('./socket')
// console.log(new koa())
// new socket({});//开始socket

app.use(async (ctx, next) => {
  await next();
  console.log(ctx.request.path)
  ctx.response.type = 'text/html';
  ctx.response.body = fs.createReadStream('./index.html');
});

app.listen(3000);
console.log('app started at port 3000...')