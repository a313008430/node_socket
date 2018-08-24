/**
 * socket模块
 */
import * as wsServer from 'ws';
import { IncomingMessage } from 'http';
import * as url from 'url';
import * as querystring from 'querystring';
import * as utils from '../utils/Utils'
import { Config } from '../Config'
import { NetEvent } from './NetEvent'
import request = require('request');//服务器和服务器通信组件 
import { UserData } from '../data/UserData';
/** 收到服务的行为数据 */
import { ClientActionLogic } from '../manage/client/ClientActionLogic';


/**接口 */
interface param {
    port: number
}



class Socket {
    /**socket 实例 */
    private socket: wsServer.Server;
    /**缓存socket 事件推送啥的 */
    private ws;
    constructor(data: param) {
        this.socket = new wsServer.Server({ port: data.port });

        //成功建立连接
        this.socket.on('connection', (ws: wsServer, request: IncomingMessage) => this.onConnection(ws, request));
    }

    /**
     * 连接事件
     * @param
     */
    private onConnection(ws: wsServer, req: IncomingMessage): void {
        console.log(`[SERVER] connection()`);
        let client_url_param = querystring.parse(url.parse(req.url).query);//客户端连接带入的数据
        let server_time = Math.ceil(Date.now() / 1000);//服务器时间
        let user_d = client_url_param['sid'].toString().match(/\d+/)[0];
        let sign_code = utils.paramsSign({ user_id: user_d, sid: client_url_param['sid'], code: client_url_param['code'], ts: server_time }, Config.key);//服务器签名
        console.log(client_url_param)

        let getUrl = `${Config.server_url}${NetEvent.user_detail}?sid=${client_url_param['sid']}&code=yuewan&ts=${server_time}&h=${sign_code}&user_id=${user_d}`;
        console.log(getUrl)

        //去别的服务器请求数据
        request(getUrl, (err, response, data) => {
            if (!err && response.statusCode == 200) {
                console.log(JSON.parse(data)) // 请求成功的处理逻辑
                // ws.send(data);
                UserData.instance.addUser({
                    userData: JSON.parse(data),
                    game_history_id: client_url_param['game_history_id']
                }, ws)
            }
        })


        this.ws = ws;
        ws.on('message', (data) => this.onMessage(data, {
            game_history_id: client_url_param['game_history_id'],
            user_id:user_d
        }));
    }

    /**
     * socket信息接受
     * @param data 数据
     */
    private onMessage(data, d): void {
        data = JSON.parse(data);
        console.log('%c <== ', "color:green;background-color:rgba(167, 167, 167, 0.2)", data);
        ClientActionLogic.instance.getAction(data, d);
    }

}

export { Socket };