/**
 * 事件管理器
 */
import events = require('events');

class EventsCore extends events.EventEmitter {
    private static _instance: EventsCore;
    //单例实例化
    public static get instance(): EventsCore {
        if (!this._instance) {
            this._instance = new EventsCore();
        }
        return this._instance;
    }

    //事件集合
}

export { EventsCore }