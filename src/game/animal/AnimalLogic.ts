import { AnimalConfig } from "./AnimalConfig";

/**
 * 动物棋主逻辑
 */
class AnimalLogic {
    private static _instance: AnimalLogic;
    //单例实例化
    public static get instance(): AnimalLogic {
        if (!this._instance) {
            this._instance = new AnimalLogic();
        }
        return this._instance;
    }

    /**棋盘列表 */
    private boardList: any[] = [];

    /**
     * 创建一个棋盘
     */
    public createBoard(room_id: any): void {
        let board = this.getBoardByRoomId(room_id);
        if (board) {

        } else {
            let list = AnimalConfig.chess_list.sort(() => Math.random() > .5 ? -1 : 1),//随机排序 
                board = [[]],
                _x = 0,
                _y = 0;
            for (let x = 0, l = list.length; x < l; x++) {
                if (_x == 4) {
                    _x = 0;
                    _y++;
                    board.push([]);
                }
                board[_y][_x] = list[x];
                _x++;
            }
            console.log(board);
            this.boardList.push({
                room_id: room_id,
                board: board
            })
        }
    }

    /**
     * 通过房间id获取棋盘
     */
    public getBoardByRoomId(room_id: any): any {
        let list = this.boardList,
            x = 0,
            l = list.length;
        for (; x < l; x++) {
            if (list[x]['room_id'] == room_id) return list[x];
        }
    }
}
export { AnimalLogic }