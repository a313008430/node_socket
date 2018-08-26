"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const koa = require("koa");
const fs = __importStar(require("fs"));
const Socket_1 = require("./net/Socket");
const RedisCore_1 = require("./core/RedisCore");
const UserData_1 = require("./data/UserData");
//开启redis
RedisCore_1.RedisCore.instance.init();
//设置用户列表数据
RedisCore_1.RedisCore.instance.getData('users', (val) => {
    let users = [];
    if (val) {
        users = JSON.parse(val);
    }
    UserData_1.UserData.instance.setUsers(users);
});
const app = new koa();
//socket 服务
new Socket_1.Socket({ port: 3001 });
app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield next();
    console.log(ctx.request.path);
    ctx.response.type = 'text/html';
    switch (ctx.request.path) {
        case '/':
            ctx.response.body = fs.createReadStream('./index.html');
            break;
        case '/1':
            ctx.response.body = fs.createReadStream('./index2.html');
            break;
    }
}));
app.listen(3000);
console.log('app started at port 3000...');
