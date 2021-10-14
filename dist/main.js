"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var https = __importStar(require("https"));
var querystring = __importStar(require("querystring"));
var md5 = require("md5");
var private_1 = require("./private");
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
var errorMap = {
    52001: 'error1',
    52002: 'error2',
    52003: 'error3',
};
exports.translate = function (englishWord) {
    var salt = getRandomInt(1, 1000000).toString();
    var sign = md5(private_1.appId + englishWord + salt + private_1.appSecret);
    var from, to;
    if (/[a-zA-Z]/.test(englishWord[0])) {
        from = 'en';
        to = 'zh';
    }
    else {
        from = 'zh';
        to = 'en';
    }
    var query = querystring.stringify({
        q: englishWord,
        from: from,
        to: to,
        appid: private_1.appId,
        salt: salt,
        sign: sign
    });
    console.log(sign);
    console.log(query);
    var options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET',
    };
    var request = https.request(options, function (response) {
        console.log('statusCode:', response.statusCode);
        console.log('headers:', response.headers);
        var chunks = [];
        response.on('data', function (chunk) {
            chunks.push(chunk);
        });
        response.on('end', function () {
            var res_string = Buffer.concat(chunks).toString();
            var res_obj = JSON.parse(res_string);
            if (res_obj.error_code) {
                console.log(errorMap[res_obj.error_code] || res_obj.error_msg);
                process.exit(2);
            }
            else {
                console.log(res_obj.trans_result[0].dst);
                process.exit(0);
            }
        });
    });
    request.on('error', function (e) {
        console.error(e);
    });
    request.end();
};
