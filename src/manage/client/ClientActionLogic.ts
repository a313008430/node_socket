/**事件行为 */
import { ServerAction } from '../../net/NetEvent';
/**用户逻辑 */
import { UserData } from '../../data/UserData';
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
        }
    }

    /**
     * 用户准备
     */
    private onReady(d:any): void {
        UserData.instance.setReadByUserId(d['user_id'], 1);
        console.log('ready', d['user_id']);

        //http://test.momoyuedu.cn/game/game_histories/test_match?is_ai=1&game_id=6
    }
}

export { ClientActionLogic }