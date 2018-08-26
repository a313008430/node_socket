/**
 * redis 数据管理
 */
import * as redis from 'redis';

class RedisCore {
    private static _instance: RedisCore;
    //单例实例化
    public static get instance(): RedisCore {
        if (!this._instance) {
            this._instance = new RedisCore();
        }
        return this._instance;
    }

    private redis;

    /**
     * 初始化
     */
    public init(options?: redis.ClientOpts): void {
        this.redis = redis.createClient(options);
    }

    /**
     * 储存数据
     * @param key 
     * @param val 
     */
    public setData(key: string, val: any): void {
        this.redis.set(key, val);
    }

    /**
     * 获取数据
     */
    public getData(key: string, cb: Function): void {
        this.redis.get(key, (err, val) => {
            if (err) {
                console.log(err);
                return;
            }
            if (cb) cb(val);
        })
    }

}


export { RedisCore };