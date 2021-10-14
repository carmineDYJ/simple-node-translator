import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import {appId, appSecret} from './private';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

// TODO 改为有效错误信息
type ErrorMap = {
  [k: string]: string
}
const errorMap: ErrorMap = {
  52001: 'error1',
  52002: 'error2',
  52003: 'error3',
}

export const translate = (englishWord: string)=>{
  const salt = getRandomInt(1, 1000000).toString();
  const sign = md5(appId + englishWord + salt + appSecret);

  let from, to;

  if (/[a-zA-Z]/.test(englishWord[0])) {
    from = 'en';
    to = 'zh'
  } else {
    from = 'zh';
    to = 'en';
  }

  const query: string = querystring.stringify({
    q: englishWord,
    from,
    to,
    appid: appId,
    salt: salt,
    sign: sign
  });
  console.log(sign);
  console.log(query);

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET',
  };

  const request = https.request(options, (response) => {
    console.log('statusCode:', response.statusCode);
    console.log('headers:', response.headers);

    const chunks: Buffer[] = []
    response.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    response.on('end', ()=>{
      const res_string = Buffer.concat(chunks).toString();
      type baiduResult = {
        error_code?: string,
        error_msg?: string,
        from: string,
        to: string,
        trans_result: { src: string, dst: string }[]
      }
      const res_obj: baiduResult = JSON.parse(res_string);
      if (res_obj.error_code) {
        console.log(errorMap[res_obj.error_code] || res_obj.error_msg);
        process.exit(2);
      } else {
        console.log(res_obj.trans_result[0].dst);
        process.exit(0);
      }
    })
  });

  request.on('error', (e) => {
    console.error(e);
  });
  request.end();
}