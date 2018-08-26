/**
 * 服务器事件
 */
const NetEvent = {
    /** 获取用户信息 */
    user_detail: '/game/users/detail',
    /** 获取用户信息 */
    add_friend: '/game/friends',
}

/**
 * 服务器和客户端交互事件
 */
const ServerAction = {
    /**进入房间 */
    enter_room: 'enter_room',
    /**准备 */
    ready: 'ready',
    /**翻牌 */
    flop: 'flop',
    /**移动 */
    move: 'move',
    /**游戏开始 */
    start: 'start',
    /**推送结果 */
    result: 'result',
    /**其它用户进入房间 */
    user_enter: 'user_enter',
    /**用户中途离开房间 */
    leave_room: 'leave_room',
    /**用户正常离开房间 */
    exit_room: 'exit_room',
}


export {
    NetEvent,
    ServerAction
}