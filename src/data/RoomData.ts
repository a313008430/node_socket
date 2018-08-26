import { SocketData } from "./SocketData";
import { ServerAction } from "../net/NetEvent";
import { SystemData } from "./SystemData";
import { AnimalLogic } from "../game/animal/AnimalLogic";

/**
 * 房间数据
 */

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
    private rooms: roomData[] = [];

    /**
     * 加入房间
     * @param d 远程服务器取到的用户数据
     */
    public addRoom(user_id: any, room_id: any): void {
        let data: roomData = {},
            room = this.getRoomByRoomId(room_id);
        if (room) {
            if (room.user_list.length < 2) room.user_list.push({ id: user_id, is_ready: 0 });
        } else {
            data.room_info = { room_id: room_id };
            data.user_list = [{ id: user_id, is_ready: 0 }];
            this.rooms.push(data);
        }
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

    /**
     * 给指定房间内的所有用户推消息
     * @param room_id 房间id
     * @param action 行为事件
     * @param data 需要特殊带入的数据
     */
    public sendByRoomId(room_id: any, action: string, data?: any): void {
        let room: roomData = this.getRoomByRoomId(room_id),
            userList = room.user_list,
            ws: WebSocket,
            sendData: sendData;


        

        for (let x = 0, l = userList.length; x < l; x++) {
            ws = SocketData.instance.getSocketById(userList[x]['id']);
            if (ws) {
                switch (action) {
                    case ServerAction.start:
                        sendData = {
                            "action": ServerAction.start,
                            "data": {},
                            "error_code": 0,
                        }
                        room.room_info.status = SystemData.game_status_1
                        break
                    case ServerAction.ready:
                        sendData = {
                            "action": ServerAction.ready,
                            "data": { user_id: data },
                            "error_code": 0,
                        }
                        ws.send(JSON.stringify(sendData));
                        break
                    case ServerAction.flop:
                        sendData = {
                            "action": ServerAction.flop,
                            "data": { chess: data },
                            "error_code": 0,
                        }
                        ws.send(JSON.stringify(sendData));
                        break
                }
            }
        }

        switch (action) {
            case ServerAction.start:
                AnimalLogic.instance.createBoard(room_id);//创建棋盘
                ws.send(JSON.stringify(sendData));
                break;
        }

        
    }

}

export { RoomData }