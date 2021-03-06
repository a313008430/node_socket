import { SystemData } from "../../data/SystemData";
/**事件行为 */
import { ServerAction } from '../../net/NetEvent';
/**用户 */
import { UserData } from '../../data/UserData';
/**房间逻辑 */
import { RoomData } from '../../data/RoomData';
/**socket 数据 */
import { SocketData } from '../../data/SocketData';

/**
 * 服务端行为事件处理返回
 */

class ServerActionLogic {
    private static _instance: ServerActionLogic;
    //单例实例化
    public static get instance(): ServerActionLogic {
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
    public sendAction(action: string, data: any): void {
        switch (action) {
            case ServerAction.enter_room://进入房间
                this.onEnterRoom(data);
                break;
        }
    }

    /**
     * 进入房间
     * @param id 用户id 
     */
    private onEnterRoom(id: any): void {
        console.log(id)
        let userBase: userBase = {},
            users: any[] = UserData.instance.getUerList(),
            ws: WebSocket;
        for (let x = 0, l = users.length; x < l; x++) {
            ws = SocketData.instance.getSocketById(users[x]['id']);

            if (users[x]['id'] == id) {
                if (ws) {
                    userBase['ai'] = 0;
                    userBase['avatar_url'] = users[x]['avatar_url'];
                    userBase['mark'] = SystemData.user_mark_1;
                    userBase['room_id'] = 12312;
                    userBase['game_history_id'] = 12312;
                    userBase['sex'] = users[x]['sex'];
                    userBase['user_id'] = users[x]['id'];
                    userBase['user_name'] = users[x]['nickname'];
                    let data = {
                        action: ServerAction.enter_room,
                        data: {
                            room_info: { room_id: 12312 },
                            user_list: [{ base: userBase , is_play:1}]
                        },
                        error_code: 0
                    };
                    ws.send(JSON.stringify(data));
                }
            } else {//给其它人推有人进入房间
                if (ws) {
                    let userObj = UserData.instance.getUerObjByUserId(id);
                    userBase['ai'] = 0;
                    userBase['avatar_url'] = userObj['avatar_url'];
                    userBase['mark'] = SystemData.user_mark_1;
                    userBase['room_id'] = 12312;
                    userBase['game_history_id'] = 12312;
                    userBase['sex'] = userObj['sex'];
                    userBase['user_id'] = userObj['id'];
                    userBase['user_name'] =userObj['nickname'];

                    let data = {
                        action: ServerAction.user_enter,
                        data: { base: userBase },
                        error_code: 0
                    };
                    ws.send(JSON.stringify(data));
                }
            }
        }
        console.log(UserData.instance.getUerList())
    }

    // private onEnterRoom(id: any): void {
    //     let user = UserData.instance.getUerObjByUserId(id);
    //     // console.log(user)
    //     if (user) {//向当前 用户发送信息
    //         let room = RoomData.instance.getRoomByRoomId(user['user']['base']['room_id']);
    //         console.log(room)
    //         let data = {
    //             action: ServerAction.enter_room,
    //             data: {
    //                 room_info: room['room_info'],
    //                 user_list: room['user_list']
    //             },
    //             error_code: 0
    //         };
    //         console.log('%c ==> ', 'color:red;background-color:rgba(167, 167, 167, 0.2)', data);
    //         user['socket'].send(JSON.stringify(data));




    //         //临时写法获取房间里面当前 加入房间的用户信息 ============================
    //         let roomUser;
    //         for (let x = 0, l = room['user_list'].length; x < l; x++) {
    //             if (room['user_list'][x]['base']['user_id'] == id) {
    //                 roomUser = room['user_list'][x];
    //             }
    //         }
    //         //如果房间内已经有其它人，则向其它人推送有人进入房间
    //         for (let x = 0, l = room['user_list'].length; x < l; x++) {
    //             if (room['user_list'][x]['base']['user_id'] != id) {
    //                 let data = {
    //                     action: ServerAction.user_enter,
    //                     data: roomUser,
    //                     error_code: 0
    //                 };
    //                 console.log('%c ==> ', 'color:red;background-color:rgba(167, 167, 167, 0.2)', data);
    //                 UserData.instance.getUerObjByUserId(room['user_list'][x]['base']['user_id'])['socket'].send(JSON.stringify(data))
    //             }
    //         }
    //     }
    // }
}

export { ServerActionLogic }