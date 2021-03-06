"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 工具类
 */
// import * as crypto from 'crypto';
const crypto = require("crypto");
/**
 * Md5 加密
 */
const md5 = function (string) {
    return crypto.createHash('md5').update(string).digest('hex');
};
exports.md5 = md5;
/**
 * 签名
 * @param query_parse 连接query对象
 * @param secret 约定的32位字符串
 * @description 所有参数按照这样拼接key=value&key=value...字典序升序后拼接
 * @returns 返回签名
 */
const paramsSign = function (query_parse, secret) {
    let urlKeyList = [];
    for (let i in query_parse) {
        urlKeyList.push(`${i}=${query_parse[i]}`);
    }
    urlKeyList.sort();
    return md5(md5(urlKeyList.join('&')) + secret);
};
exports.paramsSign = paramsSign;
