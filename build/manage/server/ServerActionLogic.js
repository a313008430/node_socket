"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**事件行为 */
const NetEvent_1 = require("../../net/NetEvent");
/**用户 */
const UserData_1 = require("../../data/UserData");
/**房间逻辑 */
const RoomData_1 = require("../../data/RoomData");
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
            case NetEvent_1.ServerAction.enter_room: //进入房间
                this.onEnterRoom(data);
                break;
        }
    }
    /**
     * 进入房间
     * @param id 用户id
     */
    onEnterRoom(id) {
        let user = UserData_1.UserData.instance.getUerObjByUserId(id);
        // console.log(user)
        if (user) { //向当前 用户发送信息
            let room = RoomData_1.RoomData.instance.getRoomByRoomId(user['user']['base']['room_id']);
            console.log(room);
            let data = {
                action: NetEvent_1.ServerAction.enter_room,
                data: {
                    room_info: room['room_info'],
                    user_list: room['user_list']
                },
                error_code: 0
            };
            console.log('%c ==> ', 'color:red;background-color:rgba(167, 167, 167, 0.2)', data);
            user['socket'].send(JSON.stringify(data));
            //临时写法获取房间里面当前 加入房间的用户信息 ============================
            let roomUser;
            for (let x = 0, l = room['user_list'].length; x < l; x++) {
                if (room['user_list'][x]['base']['user_id'] == id) {
                    roomUser = room['user_list'][x];
                }
            }
            //如果房间内已经有其它人，则向其它人推送有人进入房间
            for (let x = 0, l = room['user_list'].length; x < l; x++) {
                if (room['user_list'][x]['base']['user_id'] != id) {
                    let data = {
                        action: NetEvent_1.ServerAction.user_enter,
                        data: roomUser,
                        error_code: 0
                    };
                    console.log('%c ==> ', 'color:red;background-color:rgba(167, 167, 167, 0.2)', data);
                    UserData_1.UserData.instance.getUerObjByUserId(room['user_list'][x]['base']['user_id'])['socket'].send(JSON.stringify(data));
                }
            }
        }
    }
}
exports.ServerActionLogic = ServerActionLogic;
