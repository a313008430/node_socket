"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SystemData_1 = require("../../data/SystemData");
/**事件行为 */
const NetEvent_1 = require("../../net/NetEvent");
/**用户 */
const UserData_1 = require("../../data/UserData");
/**socket 数据 */
const SocketData_1 = require("../../data/SocketData");
/**
 * 服务端行为事件处理返回
 */
class ServerActionLogic {
    //单例实例化
    static get instance() {
        if (!this._instance) {
            this._instance = new ServerActionLogic();
        }
        return this._instance;
    }
    /**
     * 发送
     * @param action 事件行为名称
     * @param data 带过来的数据 格式不定 根据对应的方法来定
     */
    sendAction(action, data) {
        switch (action) {
            case NetEvent_1.ServerAction.enter_room://进入房间
                this.onEnterRoom(data);
                break;
        }
    }
    /**
     * 进入房间
     * @param id 用户id
     */
    onEnterRoom(id) {
        console.log(id);
        let userBase = {}, users = UserData_1.UserData.instance.getUerList(), ws;
        for (let x = 0, l = users.length; x < l; x++) {
            ws = SocketData_1.SocketData.instance.getSocketById(users[x]['id']);
            if (users[x]['id'] == id) {
                if (ws) {
                    userBase['ai'] = 0;
                    userBase['avatar_url'] = users[x]['avatar_url'];
                    userBase['mark'] = SystemData_1.SystemData.user_mark_1;
                    userBase['room_id'] = 12312;
                    userBase['game_history_id'] = 12312;
                    userBase['sex'] = users[x]['sex'];
                    userBase['user_id'] = users[x]['id'];
                    userBase['user_name'] = users[x]['nickname'];
                    let data = {
                        action: NetEvent_1.ServerAction.enter_room,
                        data: {
                            room_info: { room_id: 12312 },
                            user_list: [{ base: userBase, is_play: 1 }]
                        },
                        error_code: 0
                    };
                    ws.send(JSON.stringify(data));
                }
            }
            else {
                if (ws) {
                    let userObj = UserData_1.UserData.instance.getUerObjByUserId(id);
                    userBase['ai'] = 0;
                    userBase['avatar_url'] = userObj['avatar_url'];
                    userBase['mark'] = SystemData_1.SystemData.user_mark_1;
                    userBase['room_id'] = 12312;
                    userBase['game_history_id'] = 12312;
                    userBase['sex'] = userObj['sex'];
                    userBase['user_id'] = userObj['id'];
                    userBase['user_name'] = userObj['nickname'];
                    let data = {
                        action: NetEvent_1.ServerAction.user_enter,
                        data: { base: userBase },
                        error_code: 0
                    };
                    ws.send(JSON.stringify(data));
                }
            }
        }
        console.log(UserData_1.UserData.instance.getUerList());
    }
}
exports.ServerActionLogic = ServerActionLogic;
