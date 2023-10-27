/* eslint-disable @typescript-eslint/naming-convention */
const REGEX_INT=/^[+-]?\d+$/
const REGEX_FLOAT=/^[+-]?\d+(\.\d+)?$/
const REGEX_IP=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
const REGEX_GUID=/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

/** Check object for undefined, null, NaN, empty string */
export function isEmpty(object: any): boolean {
    if (object === undefined || object === null) return true
    const type = typeof object
    if (type === 'number' && isNaN(object)) return true
    if (type === 'string' && object.trim() === '') return true
    return false
}

/** Check object for function */
export function isFunction(object: any): boolean {
    if (object === undefined || object === null) return false
    return typeof object === 'function'
}

/** Check object for GUID */
export function isGuid(object: any): boolean {
    return !isEmpty(object) && REGEX_GUID.test(object)
}

/** Check object for IP */
export function isIp(object: any): boolean {
    return !isEmpty(object) && REGEX_IP.test(object)
}

/** Return first non-empty parameter */
export function nz(object1: any, object2: any, ...objects: any[]): any {
    if (!isEmpty(object1)) return object1
    if (!isEmpty(object2)) return object2
    if (isEmpty(objects) || !Array.isArray(objects)) return undefined
    for (let i = 0; i < objects.length; i++) {
        if (!isEmpty(objects[i])) return objects[i]
    }
    return undefined
}

/** Replace all substrings in string */
export function replace(searchValue: string, replaceValue: string, source?: string) {
    if (isEmpty(source)) return source
    const res = source.replace(searchValue, replaceValue)
    return res === source ? source : replace(searchValue, replaceValue, res)
}

/**
 * convert Date to String
 * @param date date for convert
 * @param format format string, substrings - 'yyyy', 'yy' - year, 'mm' - month, 'dd' - day, 'hh' - hour, 'mi' - minute, 'ss' - second, 'msec' - millisecond OR '126' - 'yyyy-mm-ddThh:mi:ss.msec'
 * @example format example - 'yyyymmdd', 'yyyy-mm-dd', 'yyyy.mm.dd hh:mi:ss.msec'
 */
export function dateFormat(date: Date, format: string): string {
    if (format === '126') {
        return dateFormat(date, 'yyyy-mm-ddThh:mi:ss.msec')
    }

    if (isEmpty(date)) return ''

    const yyyy = date.getFullYear()
    const mm = date.getMonth() + 1
    const dd = date.getDate()
    const hh = date.getHours()
    const mi = date.getMinutes()
    const ss = date.getSeconds()
    const msec = date.getMilliseconds()

    return format
        .replace(/yyyy/g, yyyy.toString())
        .replace(/yy/g, yyyy.toString().substring(2, 5))
        .replace(/mm/g, `${mm < 10 ? '0' : ''}${mm}`)
        .replace(/dd/g, `${dd < 10 ? '0' : ''}${dd}`)
        .replace(/hh/g, `${hh < 10 ? '0' : ''}${hh}`)
        .replace(/mi/g, `${mi < 10 ? '0' : ''}${mi}`)
        .replace(/ss/g, `${ss < 10 ? '0' : ''}${ss}`)
        .replace(/msec/g, `${msec < 10 ? '00' : (msec < 100 ? '0' : '')}${msec}`)
}

/**
 * convert Date to String
 * @param date date for convert
 * @param format 'dayInYear' - ordinal number of the day of the year, 'secInDay' - ordinal number of the second of the day
 */
export function dateFormatOrdinal (date: Date, format: ('dayInYear' | 'secInDay')): string {
    if (isEmpty(date)) return ''
    if (format === 'dayInYear') {
        const numDayPrepare = date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()
        const numDay = Math.floor(numDayPrepare / 86400000)
        const prefixZeros = numDay < 10 ? '00' : (numDay < 100 ? '0' : '')
        return `${prefixZeros}${numDay}`
    }
    if (format === 'secInDay') {
        const numSecondPrepare = date.getTime() - new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
        const numSecond = Math.floor(numSecondPrepare / 1000)
        const prefixZeros = numSecond < 10 ? '0000' : (numSecond < 100 ? '000' : (numSecond < 1000 ? '00' : (numSecond < 10000 ? '0' : '')))
        return `${prefixZeros}${numSecond}`
    }
    return ''
}

/**
 * get msec as count days, hours, seconds, milliseconds
 * @param milliseconds
 */
export function dateParts (milliseconds: number): {day: number, hour: number, minute: number, second: number, millisecond: number } {
    const oneSec = 1000
    const oneMin = 60000
    const oneHour = 3600000
    const oneDay = 86400000

    const result = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    }
    if (isEmpty(milliseconds)) return result
    if (milliseconds < oneSec) {
        result.millisecond = milliseconds
    } else if (milliseconds < oneMin) {
        result.second = Math.floor(milliseconds / oneSec)
        result.millisecond = milliseconds - result.second * oneSec
    } else if (milliseconds < oneHour) {
        result.minute = Math.floor(milliseconds / oneMin)
        const remain = milliseconds - (result.minute * oneMin)
        result.second = Math.floor(remain / oneSec)
        result.millisecond = remain - result.second * oneSec
    } else {
        result.day = Math.floor(milliseconds / oneDay)
        let remain = milliseconds - (result.day * oneDay)
        result.hour = Math.floor(remain / oneHour)
        remain = remain - (result.hour * oneHour)
        result.minute = Math.floor(remain / oneMin)
        remain = remain - (result.minute * oneMin)
        result.second = Math.floor(remain / oneSec)
        result.millisecond = remain - result.second * oneSec

        // const msecDay = result.day * oneDay
        // result.hour = Math.floor((milliseconds - msecDay) / oneHour)
        // const msecHour = result.hour * oneHour
        // result.minute = Math.floor((milliseconds - msecDay - msecHour) / oneMin)
        // const msecMin = result.minute * oneMin
        // result.second = Math.floor((milliseconds - msecDay - msecHour - msecMin) / oneSec)
        // result.millisecond = milliseconds - msecDay - msecHour - msecMin - result.second * oneSec
    }

    return result
}

/** add second or minute or hour or day to date */
export function dateAdd(date: Date, interval : ('second'|'minute'|'hour'|'day'), value: number): Date | undefined  {
    if (isEmpty(date) || isEmpty(interval) || isEmpty(value)) return undefined
    if (interval === 'second') {
        return new Date(date.getTime() + (value * 1000))
    } else if (interval === 'minute') {
        return new Date(date.getTime() + (value * 1000 * 60))
    } else if (interval === 'hour') {
        return new Date(date.getTime() + (value * 1000 * 60 * 60))
    } else if (interval === 'day') {
        return new Date(date.getTime() + (value * 1000 * 60 * 60 * 24))
    }
    return undefined
}

/**
 * Equal two objects, if two string - with trim and lowerCase
 */
export function equal(object1: any, object2: any): boolean {
    const isEmpty1 = isEmpty(object1)
    const isEmpty2 = isEmpty(object2)

    if (isEmpty1 && isEmpty2) return true
    if (isEmpty1 && !isEmpty2) return false
    if (!isEmpty1 && isEmpty2) return false

    const t1 = typeof object1
    const t2 = typeof object2

    if (t1 === 'string' && t2 === 'string' && object1.trim().toLowerCase() === object2.trim().toLowerCase()) return true
    if (t1 === 'number' && t2 === 'number' && object1 === object2) return true
    if (t1 === 'boolean' && t2 === 'boolean' && object1 === object2) return true
    if (object1 instanceof Date && object2 instanceof Date) {
        return equal(dateFormat(object1, '126'), dateFormat(object2, '126'))
    }
    if (t1 === 'object' && t2 === 'object') {
        try {
            if (JSON.stringify(object1) === JSON.stringify(object2)) return true
        } catch (error) {
            return false
        }
    }

    return false
}

/** Convert value to string */
export function toString(value: any): string {
    if (isEmpty(value)) return ''
    if (value instanceof Date) return dateFormat(value, '126')
    const type = typeof value
    if (type === 'string') {
        return value
    }
    if (type === 'boolean') {
        if (value === true) return 'true'
        if (value === false) return 'false'
        return ''
    }
    return value.toString()
}

/** Convert value to integer (number without precision) */
export function toInt(value: any): number | undefined {
    if (isEmpty(value)) {
        return undefined
    }
    const type = typeof value
    if (type === 'number') {
        if (Math.round(value) === value) return value
    } else if (type === 'string') {
        if (REGEX_INT.test(value)) return parseInt(value)
    } else if (type === 'boolean') {
        if (value === true) return 1
        if (value === false) return 0
    }
    return undefined
}

/** Convert value to positive integer (number without precision and greater than or equal to zero) */
export function toIntPositive(value: any): number | undefined {
    const res = toInt(value)
    return res !== undefined && res < 0 ? undefined : res
}

/** Convert value to float (number with precision) */
export function toFloat(value: any): number | undefined {
    if (isEmpty(value)) {
        return undefined
    }
    const type = typeof value
    if (type === 'number') {
        return value
    } else if (type === 'string') {
        if (REGEX_FLOAT.test(value)) return parseFloat(value)
        const value2 = (value as string).replace(/,/g, '.')
        if (REGEX_FLOAT.test(value2)) return parseFloat(value2)
    } else if (type === 'boolean') {
        if (value === true) return 1
        if (value === false) return 0
    }
    return undefined
}

/** Convert value to boolean */
export function toBool(value: any): boolean | undefined {
    if (isEmpty(value)) {
        return undefined
    }
    const type = typeof value
    if (type === 'boolean') {
        return value
    } else if (type === 'number') {
        if (value === 1) return true
        if (value === 0) return false
    } else if (type === 'string') {
        if (['1', 'true', 'yes', 'ok', 'y'].includes(value.trim().toLowerCase())) return true
        if (['0', 'false', 'no', 'cancel', 'n'].includes(value.trim().toLowerCase())) return false
    }
    return undefined
}

/**
 * Convert value to date, known formats:
 * @example
 * '2018-04-12T16:35:49.123+03:00'
 * '2018-05-12T16:35:49.123Z'
 * '2018-04-12T16:35:49.<9 digits>'
 * '2018-04-12T16:35:49'
 * '12.04.2018 16:35:49'
 * '12.04.2018 16:35'
 * '12.04.2018'
 * '12-04-2018 16:35:49'
 * '12-04-2018 16:35'
 * '12-04-2018'
 * '2018-04-16'
 * '2018/04/16'
 * '2018.04.16'
 * '20180416'
 */
export function toDate(value: any): Date | undefined {
    if (isEmpty(value)) {
        return undefined
    }
    if (value instanceof Date) {
        return value
    }
    if (typeof value !== 'string') {
        return undefined
    }

    let year = 0
    let month = 0
    let day = 0
    let hour = 0
    let minute = 0
    let second = 0
    let millisecond = 0

    // 2018.04.12-16:35:49 -> 2018-04-12T16:35:49
    if (value.length === 19
        && value.substring(4,5) === '.'
        && value.substring(7,8) === '.'
        && value.substring(7,8) === '.'
        && value.substring(10,11) === '-'
        && value.substring(13,14) === ':'
        && value.substring(16,17) === ':'
    ) {
        value = value.substring(0,4).concat(
            '-', value.substring(5,7),
            '-', value.substring(8,10),
            'T', value.substring(11,value.length)
        )
    }

    // 2018-04-12T16:35:49.123+03:00
    // 2018-05-12T16:35:49.123Z
    // 2018-04-12T16:35:49.<9 digits>
    // 2018-04-12T16:35:49
    if (value.length >= 19
        && value.length <= 29
        && !isEmpty(toInt(value.substring(0,4)))
        && value.substring(4,5) === '-'
        && !isEmpty(toInt(value.substring(5,7)))
        && value.substring(7,8) === '-'
        && !isEmpty(toInt(value.substring(8,10)))
        && value.substring(10,11) === 'T'
        && value.substring(13,14) === ':'
        && value.substring(16,17) === ':'
    ) {
        if (value[value.length-1].toLowerCase() === 'z') {
            value = value.substring(0,value.length-1)
        }
        year = toInt(value.substring(0,4))
        month = toInt(value.substring(5,7))
        day = toInt(value.substring(8,10))
        hour = toInt(value.substring(11,13))
        minute = toInt(value.substring(14,16))
        second = toInt(value.substring(17,19))
        if (value.length === 29
            && value.substring(19,20) === '.'
            && !isEmpty(toInt(value.substring(20,23)))
            && value.substring(23,24) === '+'
            && !isEmpty(toInt(value.substring(24,26)))
            && value.substring(26,27) === ':'
            && !isEmpty(toInt(value.substring(27,29)))
        ) {
            millisecond = toInt(value.substring(20,23))
        } else if (value.length > 19
            && value.substring(19,20) === '.'
            && !isEmpty(toInt(value.substring(20,value.length)))
        ) {
            if (value.length === 21) {
                millisecond = toInt(value.substring(20,21)) * 100
            } else if (value.length === 22) {
                millisecond = toInt(value.substring(20,22)) * 10
            } else {
                millisecond = toInt(value.substring(20,23))
            }
        } else if (value.length != 19) {
            year = undefined
        }
    } else
    // 12.04.2018 16:35:49
    // 12.04.2018 16:35
    // 12.04.2018
    // 12-04-2018 16:35:49
    // 12-04-2018 16:35
    // 12-04-2018
    if (value.length >= 10
        && value.length <= 19
        && !isEmpty(toInt(value.substring(0,2)))
        && ['.', '-'].includes(value.substring(2,3))
        && !isEmpty(toInt(value.substring(3,5)))
        && ['.', '-'].includes(value.substring(5,6))
        && !isEmpty(toInt(value.substring(6,10)))
        && value.substring(2,3) === value.substring(5,6)
    ) {
        day = toInt(value.substring(0,2))
        month = toInt(value.substring(3,5))
        year = toInt(value.substring(6,10))

        if (value.length === 19
            && value.substring(10,11) === ' '
            && !isEmpty(toInt(value.substring(11,13)))
            && value.substring(13,14) === ':'
            && !isEmpty(toInt(value.substring(14,16)))
            && value.substring(16,17) === ':'
            && !isEmpty(toInt(value.substring(17,19)))
        ) {
            hour = toInt(value.substring(11,13))
            minute = toInt(value.substring(14,16))
            second = toInt(value.substring(17,19))
        } else if (value.length === 16
            && value.substring(10,11) === ' '
            && !isEmpty(toInt(value.substring(11,13)))
            && value.substring(13,14) === ':'
            && !isEmpty(toInt(value.substring(14,16)))
        ) {
            hour = toInt(value.substring(11,13))
            minute = toInt(value.substring(14,16))
        } else if (value.length != 10) {
            year = undefined
        }
    } else
    // 2018-04-16
    // 2018/04/16
    // 2018.04.16
    if (value.length === 10
        && !isEmpty(toInt(value.substring(0,4)))
        && ['-', '/', '.'].includes(value.substring(4,5))
        && !isEmpty(toInt(value.substring(5,7)))
        && ['-', '/', '.'].includes(value.substring(7,8))
        && !isEmpty(toInt(value.substring(8,10)))
    ) {
        year = toInt(value.substring(0,4))
        month = toInt(value.substring(5,7))
        day = toInt(value.substring(8,10))
    } else
    // 20180416
    if (value.length === 8
        && !isEmpty(toInt(value.substring(0,value.length)))
    ) {
        year = toInt(value.substring(0,4))
        month = toInt(value.substring(4,6))
        day = toInt(value.substring(6,8))
    } else {
        year = undefined
    }

    if (!isEmpty(year)) {
        if (year < 0 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31 || (month === 2 && day > 29) ||
        hour < 0 || hour > 24 || minute < 0 || minute > 59 || second < 0 || second > 59) {
            year = undefined
        }
    }

    if (!isEmpty(year)) {
        const ret = new Date(year,month-1,day,hour,minute,second,millisecond)
        return ret
    }

    return undefined
}

/** return value if value is array*/
export function toArray(value: any): Array<any> | undefined {
    if (isEmpty(value) || !Array.isArray(value)) return undefined
    return value
}

/** get prop from object by name with ignore match case */
export function prop(object: any, propertyName: string): any | undefined {
    if (isEmpty(object)) return undefined
    for (const property in object) {
        if (property.toLowerCase() === propertyName.toLowerCase()) {
            return object[property]
        }
    }
    return undefined
}

import { guid } from './guid'
export { guid }

import { dir } from './dir'
export { dir }

import { PackajeJsonParse } from './packageJson'
export { PackajeJsonParse }

import { readFiles } from './readFiles'
export { readFiles }

import { Timer } from './timer'
export { Timer }

