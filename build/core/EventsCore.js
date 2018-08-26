"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 事件管理器
 */
const events = require("events");
class EventsCore extends events.EventEmitter {
    //单例实例化
    static get instance() {
        if (!this._instance) {
            this._instance = new EventsCore();
        }
        return this._instance;
    }
}
exports.EventsCore = EventsCore;
