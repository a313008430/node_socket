/**
 * 房间数据
 */

/**房间接口 */
interface roomData {
    /**房间详情 */
    room_info: roomInfo,
    /**用户列表 */
    user_list: any[]
}

/**房间详情 */
interface roomInfo {
    room_id: number
}

class RoomData {
    private static _instance: RoomData;
    //单例实例化
    public static get instance(): RoomData {
        if (!this._instance) {
            this._instance = new RoomData();
        }
        return this._instance;
    }

    /**房间列表 */
    private rooms: any[] = [];

    /**
     * 加入房间
     * @param d 远程服务器取到的用户数据
     */
    public addRoom(d: roomData): void {
        this.rooms.push(d);
    }

    /**
     * 离开房间
     */
    public leaveRoom(): void {

    }

    /**
     * 获取房间列表
     */
    public getRoomList(): any[] {
        return this.rooms;
    }

    /**
     * 通过房间id
     * @param id 房间id
     */
    public getRoomByRoomId(id: any): any {
        let list = this.rooms,
            l = list.length;
        for (let x = 0; x < l; x++) {
            if (list[x]['room_info']['room_id'] == id) {
                return list[x];
            }
        }
        return null;
    }

}

export { RoomData }