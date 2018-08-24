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
const NetEvent_1 = require("./NetEvent");
const request = require("request"); //服务器和服务器通信组件 
const UserData_1 = require("../data/UserData");
/** 收到服务的行为数据 */
const ClientActionLogic_1 = require("../manage/client/ClientActionLogic");
class Socket {
    constructor(data) {
        this.socket = new wsServer.Server({ port: data.port });
        //成功建立连接
        this.socket.on('connection', (ws, request) => this.onConnection(ws, request));
    }
    /**
     * 连接事件
     * @param
     */
    onConnection(ws, req) {
        console.log(`[SERVER] connection()`);
        let client_url_param = querystring.parse(url.parse(req.url).query); //客户端连接带入的数据
        let server_time = Math.ceil(Date.now() / 1000); //服务器时间
        let user_d = client_url_param['sid'].toString().match(/\d+/)[0];
        let sign_code = utils.paramsSign({ user_id: user_d, sid: client_url_param['sid'], code: client_url_param['code'], ts: server_time }, Config_1.Config.key); //服务器签名
        console.log(client_url_param);
        let getUrl = `${Config_1.Config.server_url}${NetEvent_1.NetEvent.user_detail}?sid=${client_url_param['sid']}&code=yuewan&ts=${server_time}&h=${sign_code}&user_id=${user_d}`;
        console.log(getUrl);
        //去别的服务器请求数据
        request(getUrl, (err, response, data) => {
            if (!err && response.statusCode == 200) {
                console.log(JSON.parse(data)); // 请求成功的处理逻辑
                // ws.send(data);
                UserData_1.UserData.instance.addUser({
                    userData: JSON.parse(data),
                    game_history_id: client_url_param['game_history_id']
                }, ws);
            }
        });
        this.ws = ws;
        ws.on('message', (data) => this.onMessage(data, {
            game_history_id: client_url_param['game_history_id'],
            user_id: user_d
        }));
    }
    /**
     * socket信息接受
     * @param data 数据
     */
    onMessage(data, d) {
        data = JSON.parse(data);
        console.log('%c <== ', "color:green;background-color:rgba(167, 167, 167, 0.2)", data);
        ClientActionLogic_1.ClientActionLogic.instance.getAction(data, d);
    }
}
exports.Socket = Socket;
