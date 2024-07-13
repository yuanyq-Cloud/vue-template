/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
    let len = Math.min(arr1.length, arr2.length)
    let i = -1
    let res = []
    while (++i < len) {
        const item = arr2[i]
        if (arr1.indexOf(item) > -1) res.push(item)
    }
    return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
    return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 数组B
 * @description 判断数组B是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
    return targetarr.some((_) => arr.indexOf(_) > -1)
}

/**
 * 日期转化
 * @param {Date} yfData
 * @param {String} fmt
 * @returns {String}
 */
export const dateFormat = (yfData, fmt) => {
    var o = {
        'M+': yfData.getMonth() + 1, // 月份
        'd+': yfData.getDate(), // 日
        'h+': yfData.getHours(), // 小时
        'm+': yfData.getMinutes(), // 分
        's+': yfData.getSeconds(), // 秒
        'q+': Math.floor((yfData.getMonth() + 3) / 3), // 季度
        S: yfData.getMilliseconds(), // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (yfData.getFullYear() + '').substring(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length))
        }
    }
    return fmt
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
    const ua = window.navigator.userAgent
    const isExplorer = (exp) => {
        return ua.indexOf(exp) > -1
    }
    if (isExplorer('MSIE')) return 'IE'
    else if (isExplorer('Firefox')) return 'Firefox'
    else if (isExplorer('Chrome')) return 'Chrome'
    else if (isExplorer('Opera')) return 'Opera'
    else if (isExplorer('Safari')) return 'Safari'
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
    if (document.addEventListener) {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler)
            }
        }
    }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
    if (document.removeEventListener) {
        return function (element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false)
            }
        }
    } else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler)
            }
        }
    }
})()

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
    const keysArr1 = Object.keys(obj1)
    const keysArr2 = Object.keys(obj2)
    if (keysArr1.length !== keysArr2.length) return false
    else if (keysArr1.length === 0 && keysArr2.length === 0) return true
    /* eslint-disable-next-line */ else return !keysArr1.some((key) => obj1[key] != obj2[key])
}

/**
 * @param {*} obj 对象
 * @description 判断对象是否为空
 */
export const isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false
        }
    }

    return true
}

// JS格式化数字（每三位加逗号）
export const toThousands = (str) => {
    var newStr = ''
    var count = 0
    if (!str && str !== 0) {
        return '-'
    } else {
        if (!isString(str)) {
            str = String(Math.abs(str))
        }
        // 当数字是整数
        if (str.indexOf('.') === -1) {
            for (var i = str.length - 1; i >= 0; i--) {
                if (count % 3 === 0 && count !== 0) {
                    newStr = str.charAt(i) + ',' + newStr
                } else {
                    newStr = str.charAt(i) + newStr
                }
                count++
            }
            str = newStr // 自动补小数点后两位
            return str
        } else {
            // 当数字带有小数
            for (var i = str.indexOf('.') - 1; i >= 0; i--) {
                if (count % 3 === 0 && count !== 0) {
                    newStr = str.charAt(i) + ',' + newStr
                } else {
                    newStr = str.charAt(i) + newStr // 逐个字符相接起来
                }
                count++
            }
            str = newStr + str.substring(str.indexOf('.'), str.length - 1)
            return str
        }
    }
}
/*
 * throttle：实现函数的节流（目的是频繁触发中缩减频率）
 实现场景：例如window的resize\scroll事件，我们再调整窗口时该事件会被触发非常多次，此时应用防抖是需要的
 *   @params
 *      func:需要执行的函数
 *      wait:自己设定的间隔时间(频率)
 *   @return
 *      可被调用执行的函数
 */
export function throttle(func, wait = 500) {
    let timer = null
    let previous = 0 // 记录上一次操作时间
    return function anonymous(...params) {
        let now = new Date() // 当前操作的时间
        let remaining = wait - (now - previous)
        if (remaining <= 0) {
            // 两次间隔时间超过频率：把方法执行即可
            clearTimeout(timer)
            timer = null
            previous = now
            func.call(this, ...params)
        } else if (!timer) {
            // 两次间隔时间没有超过频率，说明还没有达到触发标准
            timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                previous = new Date()
                func.call(this, ...params)
            }, remaining)
        }
    }
}

/*
 * debounce：实现函数的防抖（目的是规定时间内频繁触发中只执行一次）
实现场景：例如用户的频繁点击按钮，只让他再规定时间内只触发一次
 *  @params
 *     func:需要执行的函数
 *     wait:检测防抖的间隔频率
 *     immediate:是否是立即执行（如果为TRUE是控制第一次触发的时候就执行函数，默认FALSE是以最后一次触发为准）
 *  @return
 *     可被调用执行的函数
 */

export function debounce(func, wait = 300, immediate = true) {
    let timer = null
    return function (...params) {
        let now = immediate && !timer
        clearTimeout(timer)
        timer = setTimeout(() => {
            timer = null
            !immediate ? func.call(this, ...params) : null
        }, wait)
        // 若为立即执行，则
        now ? func.call(this, ...params) : null
    }
}

export const deepClone = (data) => {
    if (typeof data !== 'object' || data === null) {
        return data
    }
    let target = null
    if (data instanceof Array) {
        target = []
    } else {
        target = {}
    }
    for (let key in data) {
        // key不能是原型的属性
        if (data.hasOwnProperty(key)) {
            target[key] = deepClone(data[key])
        }
    }
    return target
}
/**
 * 树结构 [node, node, ...]
 * node节点 {id, children}
 * idKey: 节点id的key
 * id: id值
 */
export const searchTreeById = (nodes, idKey, id) => {
    for (let _i = 0; _i < nodes.length; _i++) {
        if (nodes[_i][idKey] === id) {
            return nodes[_i]
        } else {
            if (nodes[_i].children && nodes[_i].children.length > 0) {
                let res = searchTreeById(nodes[_i].children, idKey, id)
                if (res) {
                    return res
                }
            }
        }
    }
    return null
}

/** 小数截断
 *@param num 数值
 *@param digits 保留位数
 */
export const truncateDecimals = (num, digits = 1) => {
    var multiplier = Math.pow(10, digits)
    var truncated = Math.floor(num * multiplier) / multiplier
    return truncated
}
