"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * socket 数据缓存
 */
class SocketData {
    constructor() {
        /**已连接socket列表 */
        this.sockets = [];
    }
    //单例实例化
    static get instance() {
        if (!this._instance) {
            this._instance = new SocketData();
        }
        return this._instance;
    }
    /**
     * 添加socket
     * @param id 用户id
     */
    add(id, ws) {
        this.sockets.push({
            id: id,
            ws: ws
        });
    }
    /**
     * 通过id获取 socket
     */
    getSocketById(id) {
        let list = this.sockets;
        for (let x = 0, l = list.length; x < l; x++) {
            if (list[x]['id'] == id)
                return list[x]['ws'];
        }
        return null;
    }
    /**
     * 更新用户socket
     */
    updateById(id, ws) {
        let list = this.sockets;
        for (let x = 0, l = list.length; x < l; x++) {
            if (list[x]['id'] == id) {
                list[x]['ws'].close();
                list[x]['ws'] = ws;
            }
        }
    }
}
exports.SocketData = SocketData;
