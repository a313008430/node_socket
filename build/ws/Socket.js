"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * socket模块
 */
const wsServer = __importStar(require("ws"));
const url = __importStar(require("url"));
const querystring = __importStar(require("querystring"));
const utils = __importStar(require("../utils/Utils"));
const Config_1 = require("../Config");
const request = require("request");
class Socket {
    constructor(data) {
        this.socket = new wsServer.Server({ port: data.port });
        //成功建立连接
        this.socket.on('connection', (ws, request) => this.onConnection(ws, request));
    }
    /**
     * 连接事件
     */
    onConnection(ws, req) {
        console.log(`[SERVER] connection()`);
        let a = querystring.parse(url.parse(req.url).query);
        console.log(a); //socket后面的地址
        let time = Math.ceil(Date.now() / 1000);
        console.log(time);
        console.log(utils.paramsSign({ user_id: 31438, sid: a['sid'], code: a['code'], ts: time }, Config_1.Config.key));
        //去别的服务器请求数据
        request(`${}/game/users/detail?sid=31438sb40f33ea82c191633b00beff88794b4712&code=yuewan&ts=1534930900&h=d69804e709669a427c946bf97381c469&user_id=31438`, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                console.log(JSON.parse(body)); // 请求成功的处理逻辑
            }
        });
        this.ws = ws;
        ws.on('message', (data) => this.onMessage(data));
    }
    /**
     * socket信息接受
     * @param data 数据
     */
    onMessage(data) {
        console.log(data);
    }
}
exports.Socket = Socket;
