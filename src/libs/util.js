import axios from 'axios'

import env from '../../build/env'
import { vm } from '@/main.js'

let util = {}

util.permissionSwitch = true

util.title = function (title) {
    window.document.title = title
}

// 浏览器语言获取
const browserLanguage = window.navigator.language || 'zh-CN'
util.browserLanguage = browserLanguage
util.getLocal = window.location.origin
const ajaxUrl = process.env.SERVER_BASEURL ? process.env.SERVER_BASEURL : env === 'development' ? util.getLocal : env === 'production' ? util.getLocal : util.getLocal
util.baseUrl = ajaxUrl + '/example-gateway'
util.ajax = axios.create({
    baseURL: util.baseUrl,
    timeout: 180000,
    // 跨域请求携带cookie
    withCredentials: false,
})
let loading = null
let requestCount = 0
util.ajax.interceptors.request.use(
    function (config) {
        // 每请求一个接口，请求数量+1，打开遮罩
        if (config && config.config && config.config.showLoading) {
            requestCount++
            loading = vm.$loading({
                fullscreen: true,
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.3)',
            })
        }

        config.headers.Authorization = localStorage.token
        return config
    },
    function (error) {
        setTimeout(function () {
            requestCount--
            if (requestCount <= 0) {
                loading.close()
            }
        }, 10)
        // 请求失败的处理
        return Promise.reject(error)
    }
)

util.ajax.interceptors.response.use(
    function (res) {
        //在这里对返回的数据进行处理
        if (!res.config.url.includes('refreshToken')) {
            //记录ajax调用的时间
            sessionStorage.lastAjaxTime = new Date().getTime()
        }
        // 每请求成功一个接口，请求数量-1，数量为零关闭遮罩
        if (res.config && res.config.config && res.config.config.showLoading) {
            setTimeout(function () {
                requestCount--
                if (requestCount <= 0) {
                    loading.close()
                }
            }, 10)
        }

        return res
    },
    function (error) {
        // 每请求成功一个接口，请求数量-1，数量为零关闭遮罩
        if (error.response.config.config && error.response.config.config.showLoading) {
            setTimeout(function () {
                requestCount--
                if (requestCount <= 0) {
                    loading.close()
                }
            }, 10)
        }
        if (error.response.data.status === 401 || error.response.status === 401) {
        } else {
            if (error.response.data.status === 403) {
                vm.$message({ type: 'warning', message: error.response.data.message })
            }
            if (error.response.data.status === 500) {
                vm.$message.error('服务出错')
            }
        }
        return Promise.reject(error)
    }
)

util.ajaxMethodWidthParams = function (url, method, params) {
    return new Promise((resolver, reject) => {
        var res = resolver
        util.ajax({
            method: method,
            url: url,
            data: JSON.stringify(params),
            config: {
                showLoading: true,
            },
        })
            .then((response) => {
                res(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

util.ajaxGetData = function (url, params) {
    return new Promise((resolve, reject) => {
        var p = new URLSearchParams()
        for (var key in params) {
            p.append(key, params[key])
        }
        util.ajax
            .post(url, p)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

util.ajaxGetData_download = function (url, params) {
    return new Promise((resolve, reject) => {
        var p = new URLSearchParams()
        // for (var key in params) {
        //     p.append(key, params[key])
        // }

        util.ajax
            .get(url, params)
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// 针对后台规范，强制使用@RequestBody编写的方法
util.ajaxPostData = function (url, params, isMask = true, customCb = true) {
    return new Promise((resolve, reject) => {
        util.ajax({
            method: 'post',
            url: url,
            data: params,
            config: {
                showLoading: isMask,
            },
        })
            .then((response) => {
                if (customCb) {
                    resolve(response.data)
                } else {
                    if (response.data.success) {
                        resolve(response.data)
                    } else {
                        !customCb && vm.$message.error(response.data.head.respMsg)
                        reject()
                    }
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}
// 针对文件下载，强制使用@RequestBody编写的方法
util.downloadPostData = function (url, params, isMask = true) {
    return new Promise((resolve, reject) => {
        util.ajax({
            method: 'post',
            url: url,
            data: params,
            responseType: 'blob',
            config: {
                showLoading: isMask,
            },
        })
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
util.ajaxMethod = function (method, url, params, headers) {
    let Params = {}
    let Data = {}
    let reg1 = new RegExp('^(G|g)(E|e)(T|t)$')
    let reg2 = new RegExp('^(D|d)(E|e)(L|l)(E|e)(T|t)(E|e)')
    if (reg1.test(method) || reg2.test(method)) {
        Params = params
    } else {
        Data = params
    }
    return new Promise((resolve, reject) => {
        util.ajax({
            method: method,
            url: url,
            params: Params,
            data: Data,
            headers: headers || {},
            config: {
                showLoading: true,
            },
        })
            .then((response) => {
                resolve(response.data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export default util
