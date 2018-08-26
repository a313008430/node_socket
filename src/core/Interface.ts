/**
 * socket 向客户端对消息格式
 */
interface sendData {
    /**事件名称 */
    action: string,
    /**返回数据  */
    data: any,
    /**错误码 */
    error_code: number
}

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

/**房间详情 */
interface roomInfo {
    room_id?: number,
    status?: number
}

/**房间接口 */
interface roomData {
    /**房间详情 */
    room_info?: roomInfo,
    /**用户列表 */
    user_list?: roomUserData[],
    /**棋盘 */
}

/**
 * 房间用户信息
 */
interface roomUserData {
    id?: any,
    is_ready?: number
}