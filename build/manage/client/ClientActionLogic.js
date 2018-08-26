"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**事件行为 */
const NetEvent_1 = require("../../net/NetEvent");
const RoomData_1 = require("../../data/RoomData");
const AnimalLogic_1 = require("../../game/animal/AnimalLogic");
/**
 * 用户接收客户端事件处理
 */
class ClientActionLogic {
    //单例实例化
    static get instance() {
        if (!this._instance) {
            this._instance = new ClientActionLogic();
        }
        return this._instance;
    }
    /**
     * 接受到客户端发来的行为事件
     * @param data 根据下面方法带入的不同的方法  game_history_id  user_id
     */
    getAction(d, data) {
        switch (d['action']) {
            case NetEvent_1.ServerAction.ready:
                this.onReady(data);
                break;
            case NetEvent_1.ServerAction.flop://翻盘
                this.onFlop(d, data);
                break;
        }
    }
    /**
     * 用户准备
     */
    onReady(d) {
        console.log(d);
        let room = RoomData_1.RoomData.instance.getRoomByRoomId(d['game_history_id']), userList, is_ready_len = 0;
        if (room) {
            userList = room.user_list;
            for (let x = 0, l = userList.length; x < l; x++) {
                if (userList[x]['id'] == d['user_id']) {
                    userList[x]['is_ready'] = 1;
                    is_ready_len++;
                }
                else {
                    if (userList[x]['is_ready'])
                        is_ready_len++;
                }
            }
            RoomData_1.RoomData.instance.sendByRoomId(d['game_history_id'], NetEvent_1.ServerAction.ready, d['user_id']);
            console.log(is_ready_len);
            if (is_ready_len == 2) {
                RoomData_1.RoomData.instance.sendByRoomId(d['game_history_id'], NetEvent_1.ServerAction.start);
            }
        }
        console.log(room);
        // UserData.instance.setReadByUserId(d['user_id'], 1);
        // console.log('ready', d['user_id']);
        //http://test.momoyuedu.cn/game/game_histories/test_match?is_ai=1&game_id=6
    }
    /**
     * 接受客户端翻盘行为
     */
    onFlop(d, data) {
        let board = AnimalLogic_1.AnimalLogic.instance.getBoardByRoomId(data['game_history_id']);
        if (board) {
            console.log(board.board[d['data']['y']][d['data']['x']]);
            RoomData_1.RoomData.instance.sendByRoomId(data['game_history_id'], NetEvent_1.ServerAction.flop, board.board[d['data']['y']][d['data']['x']]);
        }
        console.log(d, data);
    }
}
exports.ClientActionLogic = ClientActionLogic;
