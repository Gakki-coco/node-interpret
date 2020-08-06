import * as md5 from 'md5'
import * as querystring from 'querystring'
import {appID, appSecret} from './private'
import * as https from 'https'

export const translate = (word) => {

    const salt = Math.random()
    const sign = md5(appID + word + salt + appSecret)

    const query: string = querystring.stringify({
        q: word,
        from: 'en',
        to: 'zh',
        appid: appID,
        salt: salt,
        sign: sign
    })

    const options = {
        hostname: 'fanyi-api.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    }

    const request = https.request(options, (response) => {
        let chunks = []
        response.on('data', (chunk) => {
            chunks.push(chunk)
        })
        response.on('end', () => {
            const string = Buffer.concat(chunks).toString()
            type BaiduResult = {
                error_code?: string;
                error_msg?: string;
                from: string;
                to: string;
                trans_result: {
                    src: string;
                    dst: string
                }[]
            }
            const object: BaiduResult = JSON.parse(string)
            if (object.error_code) {
                console.error(object.error_msg)
                process.exit(2)
            } else {
                console.log(object.trans_result[0].dst)
                process.exit(0)
            }
        })
    })

    request.on('error', (error) => {
        console.log(error)
    })
    request.end()
}