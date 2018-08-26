import ws from "ws";//websocket模块
import { RoomData } from './RoomData';
import { SystemData } from "./SystemData";
import { ServerActionLogic } from '../manage/server/ServerActionLogic';
/**事件行为 */
import { ServerAction } from '../net/NetEvent';
/**redis  */
import { RedisCore } from '../core/RedisCore';


/**用户基础信息 */
interface userBase {
    /**是否是ai */
    ai?: number,
    /**头像地址 */
    avatar_url?: number,
    /** game_history_id => roomId*/
    game_history_id?: number,
    /**标识 */
    mark?: number,
    /**房间id */
    room_id?: number,
    /**性别 */
    sex?: number,
    /**sid */
    // sid?: number,
    /**状态 */
    // status?: number,
    /**用户id */
    user_id?: number,
    /**用户名称 */
    user_name?: number,
}

/** 交互状态数据 */
interface userClientData {
    base: userBase,
    is_ready: number,
    is_play: number
}
/** 服务器用户数据结构 */
interface serverUserData {
    user: userClientData,
    socket: any
}

/**
 * 用户数据模块
 */
class UserData {

    private static _instance: UserData;
    //单例实例化
    public static get instance(): UserData {
        if (!this._instance) {
            this._instance = new UserData();
        }
        return this._instance;
    }

    /**用户列表 */
    private users: any[] = [];

    constructor() {

    }

    /**设置用户列表 => redis */
    public setUsers(users: any[]): void {
        this.users = users;
    }

    /**
     * 缓存数据到redis
     */
    public cacheUser(obj: any): void {
        this.users.push(obj);
        this.sendEnterRoom(obj['id']);
        this.setSync();
    }

    /**
     * 更新缓存数据
     */
    public updateCacheUser(id: any): void {
        let user = this.getUerObjByUserId(id);
        if (user) {
            //加入需要更新的数据
            this.sendEnterRoom(id);
            this.setSync();
        }
    }

    /**
     * 广播进入房间信息
     * @param id 用户id 
     */
    private sendEnterRoom(id: any): void {
        ServerActionLogic.instance.sendAction(ServerAction.enter_room, id);
    }

    /**
     * 同步数据到redis
     */
    public setSync(): void {
        RedisCore.instance.setData('users', JSON.stringify(this.users));
    }

    /**
     * 添加用户 并且 加入房间
     * @param d 用户数据
     * @param ws websocket对象
     * @description game_history_id 默认就是房间id
     */
    public addUser(d: any, ws: ws): void {
        let baseObj: userBase = {},
            //获取已有用户
            user = this.getUerObjByUserId(d['userData']['id']),
            room = RoomData.instance.getRoomByRoomId(d['game_history_id']);
        if (user) {//如果用户存在
            if (room) {
                //如果之前有socket就先断开
                if (user['socket']) user['socket'].close();
                user['socket'] = ws;
            }
        } else {//如果用户不存在

            baseObj.ai = 0;//临时处理
            baseObj.avatar_url = d['userData']['avatar_url'];
            baseObj.game_history_id = d['game_history_id'];
            baseObj.mark = SystemData.user_mark_1;
            baseObj.room_id = d['game_history_id'];
            baseObj.sex = d['userData']['sex'];
            baseObj.user_id = d['userData']['id'];
            baseObj.user_name = d['userData']['nickname'];
            let userData: userClientData = {//客户端需要的数据结构
                base: baseObj,
                is_play: 1,
                is_ready: 0
            }
            let serverUserData = {//服务器缓存的数据 用户数据 + socket
                user: userData,
                socket: ws
            }
            this.users.push(serverUserData);

            if (room) {//如果房间存在
                console.error(room)
                room['user_list'].push(userData);
            } else {//如果房间不存在
                //加入到房间缓存 
                // RoomData.instance.addRoom({
                //     user_list: [userData],
                //     room_info: {
                //         room_id: d['game_history_id']
                //     }
                // })
            }
        }

        //给当前用户广播进入房间
        ServerActionLogic.instance.sendAction(ServerAction.enter_room, d['userData']['id']);
    }

    /**
     * 创建用户
     */


    /**
     * 通过用户id删除用户
     * @param id 用户id
     */
    public delUserById(id: number): void {

    }

    /**
     * 通过房间Id删除用户
     */
    public delUserByRoomId(): void {

    }

    /**
     * 通过房间id获取用户
     * @returns 用户列表
     */
    public getUserListByRoomId(): any[] {
        return [];
    }

    /**
     * 通过用户id获取用户信息
     */
    public getUerObjByUserId(id: any): any {
        let list = this.users;
        for (let x = 0, l = list.length; x < l; x++) {
            if (list[x]['id'] == id) return list[x];
        }
        return null;
    }

    /**
     * 通过用户id设置用户准备状态
     * @param id 用户id
     * @param status 准备状态 0 不准备 1 准备
     */
    public setReadByUserId(id: any, status: number): any {
        let userObj: serverUserData = this.getUerObjByUserId(id);
        if (userObj) userObj.user.is_ready = status;
    }

    /**
     * 获取所有用户列表
     */
    public getUerList(): any[] {
        return this.users;
    }


}
export { UserData };