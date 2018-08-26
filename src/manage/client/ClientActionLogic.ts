/**事件行为 */
import { ServerAction, NetEvent } from '../../net/NetEvent';
/**用户逻辑 */
import { UserData } from '../../data/UserData';
import { RoomData } from '../../data/RoomData';
import { AnimalLogic } from '../../game/animal/AnimalLogic';
/**
 * 用户接收客户端事件处理
 */
class ClientActionLogic {
    private static _instance: ClientActionLogic;
    //单例实例化
    public static get instance(): ClientActionLogic {
        if (!this._instance) {
            this._instance = new ClientActionLogic();
        }
        return this._instance;
    }

    /**
     * 接受到客户端发来的行为事件
     * @param data 根据下面方法带入的不同的方法  game_history_id  user_id
     */
    public getAction(d: any, data: any): void {
        switch (d['action']) {
            case ServerAction.ready:
                this.onReady(data);
                break;
            case ServerAction.flop://翻盘
                this.onFlop(d, data);
                break;
        }
    }

    /**
     * 用户准备
     */
    private onReady(d: any): void {
        console.log(d)
        let room: roomData = RoomData.instance.getRoomByRoomId(d['game_history_id']),
            userList: roomUserData[],
            is_ready_len: number = 0;
        if (room) {
            userList = room.user_list;
            for (let x = 0, l = userList.length; x < l; x++) {
                if (userList[x]['id'] == d['user_id']) {
                    userList[x]['is_ready'] = 1;
                    is_ready_len++;
                } else {
                    if (userList[x]['is_ready']) is_ready_len++;
                }
            }

            RoomData.instance.sendByRoomId(d['game_history_id'], ServerAction.ready, d['user_id']);

            console.log(is_ready_len);
            if (is_ready_len == 2) {//如果准备的人数满足2就推送开始
                RoomData.instance.sendByRoomId(d['game_history_id'], ServerAction.start)
            }
        }
        console.log(room)
        // UserData.instance.setReadByUserId(d['user_id'], 1);
        // console.log('ready', d['user_id']);

        //http://test.momoyuedu.cn/game/game_histories/test_match?is_ai=1&game_id=6
    }

    /**
     * 接受客户端翻盘行为
     */
    private onFlop(d: any, data: any): void {
        let board = AnimalLogic.instance.getBoardByRoomId(data['game_history_id']);
        if (board) {
            console.log(board.board[d['data']['y']][d['data']['x']])
            RoomData.instance.sendByRoomId(data['game_history_id'], ServerAction.flop, board.board[d['data']['y']][d['data']['x']])
        }

        console.log(d, data)
    }
}

export { ClientActionLogic }