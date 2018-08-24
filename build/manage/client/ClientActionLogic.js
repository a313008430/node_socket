"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**事件行为 */
const NetEvent_1 = require("../../net/NetEvent");
/**用户逻辑 */
const UserData_1 = require("../../data/UserData");
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
        }
    }
    /**
     * 用户准备
     */
    onReady(d) {
        UserData_1.UserData.instance.setReadByUserId(d['user_id'], 1);
        console.log('ready', d['user_id']);
        //http://test.momoyuedu.cn/game/game_histories/test_match?is_ai=1&game_id=6
    }
}
exports.ClientActionLogic = ClientActionLogic;
