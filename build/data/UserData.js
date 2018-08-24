"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RoomData_1 = require("./RoomData");
const SystemData_1 = require("./SystemData");
const ServerActionLogic_1 = require("../manage/server/ServerActionLogic");
/**事件行为 */
const NetEvent_1 = require("../net/NetEvent");
/**
 * 用户数据模块
 */
class UserData {
    constructor() {
        /**用户列表 */
        this.users = [];
    }
    //单例实例化
    static get instance() {
        if (!this._instance) {
            this._instance = new UserData();
        }
        return this._instance;
    }
    /**
     * 添加用户 并且 加入房间
     * @param d 用户数据
     * @param ws websocket对象
     * @description game_history_id 默认就是房间id
     */
    addUser(d, ws) {
        let baseObj = {}, 
        //获取已有用户
        user = this.getUerObjByUserId(d['userData']['id']), room = RoomData_1.RoomData.instance.getRoomByRoomId(d['game_history_id']);
        if (user) { //如果用户存在
            if (room) {
                //如果之前有socket就先断开
                if (user['socket'])
                    user['socket'].close();
                user['socket'] = ws;
            }
        }
        else { //如果用户不存在
            baseObj.ai = 0; //临时处理
            baseObj.avatar_url = d['userData']['avatar_url'];
            baseObj.game_history_id = d['game_history_id'];
            baseObj.mark = SystemData_1.SystemData.user_mark_1;
            baseObj.room_id = d['game_history_id'];
            baseObj.sex = d['userData']['sex'];
            baseObj.user_id = d['userData']['id'];
            baseObj.user_name = d['userData']['nickname'];
            let userData = {
                base: baseObj,
                is_play: 1,
                is_ready: 0
            };
            let serverUserData = {
                user: userData,
                socket: ws
            };
            this.users.push(serverUserData);
            if (room) { //如果房间存在
                console.error(room);
                room['user_list'].push(userData);
            }
            else { //如果房间不存在
                //加入到房间缓存 
                RoomData_1.RoomData.instance.addRoom({
                    user_list: [userData],
                    room_info: {
                        room_id: d['game_history_id']
                    }
                });
            }
        }
        //给当前用户广播进入房间
        ServerActionLogic_1.ServerActionLogic.instance.sendAction(NetEvent_1.ServerAction.enter_room, d['userData']['id']);
    }
    /**
     * 创建用户
     */
    /**
     * 通过用户id删除用户
     * @param id 用户id
     */
    delUserById(id) {
    }
    /**
     * 通过房间Id删除用户
     */
    delUserByRoomId() {
    }
    /**
     * 通过房间id获取用户
     * @returns 用户列表
     */
    getUserListByRoomId() {
        return [];
    }
    /**
     * 通过用户id获取用户信息
     */
    getUerObjByUserId(id) {
        let list = this.users;
        for (let x = 0, l = list.length; x < l; x++) {
            if (list[x]['user']['base']['user_id'] == id)
                return list[x];
        }
        return null;
    }
    /**
     * 通过用户id设置用户准备状态
     * @param id 用户id
     * @param status 准备状态 0 不准备 1 准备
     */
    setReadByUserId(id, status) {
        let userObj = this.getUerObjByUserId(id);
        if (userObj)
            userObj.user.is_ready = status;
    }
    /**
     * 获取所有用户列表
     */
    getUerList() {
        return [];
    }
}
exports.UserData = UserData;
