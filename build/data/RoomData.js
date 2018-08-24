"use strict";
/**
 * 房间数据
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
    addRoom(d) {
        this.rooms.push(d);
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
}
exports.RoomData = RoomData;
