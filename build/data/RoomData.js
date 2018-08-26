"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketData_1 = require("./SocketData");
const NetEvent_1 = require("../net/NetEvent");
const SystemData_1 = require("./SystemData");
const AnimalLogic_1 = require("../game/animal/AnimalLogic");
/**
 * 房间数据
 */
class RoomData {
    constructor() {
        /**房间列表 */
        this.rooms = [];
    }
    //单例实例化
    static get instance() {
        if (!this._instance) {
            this._instance = new RoomData();
        }
        return this._instance;
    }
    /**
     * 加入房间
     * @param d 远程服务器取到的用户数据
     */
    addRoom(user_id, room_id) {
        let data = {}, room = this.getRoomByRoomId(room_id);
        if (room) {
            if (room.user_list.length < 2)
                room.user_list.push({ id: user_id, is_ready: 0 });
        }
        else {
            data.room_info = { room_id: room_id };
            data.user_list = [{ id: user_id, is_ready: 0 }];
            this.rooms.push(data);
        }
    }
    /**
     * 离开房间
     */
    leaveRoom() {
    }
    /**
     * 获取房间列表
     */
    getRoomList() {
        return this.rooms;
    }
    /**
     * 通过房间id
     * @param id 房间id
     */
    getRoomByRoomId(id) {
        let list = this.rooms, l = list.length;
        for (let x = 0; x < l; x++) {
            if (list[x]['room_info']['room_id'] == id) {
                return list[x];
            }
        }
        return null;
    }
    /**
     * 给指定房间内的所有用户推消息
     * @param room_id 房间id
     * @param action 行为事件
     * @param data 需要特殊带入的数据
     */
    sendByRoomId(room_id, action, data) {
        let room = this.getRoomByRoomId(room_id), userList = room.user_list, ws, sendData;
        for (let x = 0, l = userList.length; x < l; x++) {
            ws = SocketData_1.SocketData.instance.getSocketById(userList[x]['id']);
            if (ws) {
                switch (action) {
                    case NetEvent_1.ServerAction.start:
                        sendData = {
                            "action": NetEvent_1.ServerAction.start,
                            "data": {},
                            "error_code": 0,
                        };
                        room.room_info.status = SystemData_1.SystemData.game_status_1;
                        break;
                    case NetEvent_1.ServerAction.ready:
                        sendData = {
                            "action": NetEvent_1.ServerAction.ready,
                            "data": { user_id: data },
                            "error_code": 0,
                        };
                        ws.send(JSON.stringify(sendData));
                        break;
                    case NetEvent_1.ServerAction.flop:
                        sendData = {
                            "action": NetEvent_1.ServerAction.flop,
                            "data": { chess: data },
                            "error_code": 0,
                        };
                        ws.send(JSON.stringify(sendData));
                        break;
                }
            }
        }
        switch (action) {
            case NetEvent_1.ServerAction.start:
                AnimalLogic_1.AnimalLogic.instance.createBoard(room_id); //创建棋盘
                ws.send(JSON.stringify(sendData));
                break;
        }
    }
}
exports.RoomData = RoomData;
