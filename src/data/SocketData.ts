/**
 * socket 数据缓存
 */
class SocketData {
    private static _instance: SocketData;
    //单例实例化
    public static get instance(): SocketData {
        if (!this._instance) {
            this._instance = new SocketData();
        }
        return this._instance;
    }

    /**已连接socket列表 */
    private sockets: any[] = [];

    /**
     * 添加socket
     * @param id 用户id
     */
    public add(id: any, ws): void {
        this.sockets.push({
            id: id,
            ws: ws
        });
    }

    /**
     * 通过id获取 socket
     */
    public getSocketById(id: any): WebSocket {
        let list = this.sockets;
        for (let x = 0, l = list.length; x < l; x++) {
            if (list[x]['id'] == id) return list[x]['ws'];
        }
        return null;
    }

    /**
     * 更新用户socket
     */
    public updateById(id: any, ws): void {
        let list = this.sockets;
        for (let x = 0, l = list.length; x < l; x++) {
            if (list[x]['id'] == id) {
                list[x]['ws'].close();
                list[x]['ws'] = ws;
            }
        }
    }
}

export { SocketData }