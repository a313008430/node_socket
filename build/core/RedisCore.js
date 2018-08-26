"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * redis 数据管理
 */
const redis = __importStar(require("redis"));
class RedisCore {
    //单例实例化
    static get instance() {
        if (!this._instance) {
            this._instance = new RedisCore();
        }
        return this._instance;
    }
    /**
     * 初始化
     */
    init(options) {
        this.redis = redis.createClient(options);
    }
    /**
     * 储存数据
     * @param key
     * @param val
     */
    setData(key, val) {
        this.redis.set(key, val);
    }
    /**
     * 获取数据
     */
    getData(key, cb) {
        this.redis.get(key, (err, val) => {
            if (err) {
                console.log(err);
                return;
            }
            if (cb)
                cb(val);
        });
    }
}
exports.RedisCore = RedisCore;
