import * as md5 from 'md5'
import * as querystring from 'querystring'
import * as http from 'http'

export const translate = (word) => {
    const appID = ''
    const appSecret = ''
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
        path: 'api/trans/vip/translate？' + query,
        method: 'GET'
    }

    const request = http.request(options, (response) => {
        response.on('data', (data) => {
            process.stdout.write(data)
        })
    })

    request.on('error', (error)=> {
        console.log(error)
    })
    request.end()
}