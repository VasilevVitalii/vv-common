import { dateFormat, toDate } from "."

type TMereValue = null | undefined | string | Date

const TF_HOUR = new RegExp(/^([0-1]?[0-9]|2[0-3])$/)
const TF_HOUR_MIN = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
const TF_HOUR_MIN_SEC = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
const TF_HOUR_MIN_SEC_MSEC = new RegExp(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9].[0-9]?[0-9]?[0-9]$/)

interface IMere {
    set: (val: TMereValue) => void,
    tryset: (val: TMereValue, defVal?: TMereValue) => void
    toJSON(): string
    toString(): string
    toDate(): Date
}

/** DateTime without timezone; stored as 'yyyy-mm-ddThh:mi:ss.msec' */
export class MereDateTime implements IMere {
    private _date = null as Date
    private _val = null as string

    /**
     * null or undefined = now date and time, '' (empty string) = empty date and time
     */
    constructor(value?: TMereValue | {val: TMereValue, defVal?: TMereValue}) {
        if (value === undefined || value === null || typeof value === 'string' || value instanceof Date) {
            this.set(value as TMereValue)
        } else {
            this.tryset(value.val, value.defVal)
        }
    }

    private _set(value: TMereValue): boolean {
        let date = undefined as Date
        let isDateUndefined = false
        try {
            if (value === null || value === undefined) {
                date = new Date()
            } else if (value === '') {
                isDateUndefined = true
            } else {
                date = toDate(value)
            }

            if (date === undefined && !isDateUndefined) {
                return false
            }
            this._date = date
            this._val = dateFormat(this._date, '126')
            return true
        } catch (err) {
            return false
        }
    }

    /**
     * null or undefined = current date and time, '' (empty string) = empty date and time
    */
    public set (val: TMereValue) {
        if (!this._set(val)) {
            throw new Error(`value "${val}" is failed to convert to date`)
        }
    }

    /**
     * null or undefined = current date and time, '' (empty string) = empty date and time
     */
    public tryset (val: TMereValue, defVal?: TMereValue) {
        if (!this._set(val)) {
            if (!this._set(defVal)) {
                throw new Error(`values "${val}" and "${defVal}" are failed to convert to date`)
            }
        }
    }

    toJSON() {
        return this._val
    }

    toString() {
        return this._val
    }
    toDate(): Date {
        return this._date
    }
}

/** Date without time and timezone; and stored as 'yyyy-mm-dd' */
export class MereDate implements IMere {
    private _date = null as Date
    private _val = null as string

    /**
     * null or undefined = current date, '' (empty string) = empty date
     */
    constructor(value?: TMereValue | {val: TMereValue, defVal?: TMereValue}) {
        if (value === undefined || value === null || typeof value === 'string' || value instanceof Date) {
            this.set(value as TMereValue)
        } else {
            this.tryset(value.val, value.defVal)
        }
    }

    private _set(value: TMereValue): boolean {
        let date = undefined as Date
        let isDateUndefined = false
        try {
            if (value === null || value === undefined) {
                date = new Date()
            } else if (value === '') {
                isDateUndefined = true
            } else {
                date = toDate(value)
            }

            if (date === undefined && !isDateUndefined) {
                return false
            }
            this._date = date
            if (this._date) {
                this._date.setHours(0,0,0,0)
            }
            this._val = dateFormat(this._date, 'yyyy-mm-dd')
            return true
        } catch (err) {
            return false
        }
    }

    /**
     * null or undefined = current date, '' (empty string) = empty date
    */
    public set (val: TMereValue) {
        if (!this._set(val)) {
            throw new Error(`value "${val}" is failed to convert to date`)
        }
    }

    /**
     * null or undefined = current date, '' (empty string) = empty date
     */
    public tryset (val: TMereValue, defVal?: TMereValue) {
        if (!this._set(val)) {
            if (!this._set(defVal)) {
                throw new Error(`values "${val}" and "${defVal}" are failed to convert to date`)
            }
        }
    }

    toJSON() {
        return this._val
    }

    toString() {
        return this._val
    }

    toDate(): Date {
        return this._date
    }    
}

/** Time without date and timezone; and stored as 'hh:mi:ss.msec' */
export class MereTime implements IMere {
    private _date = null as Date
    private _val = null as string

    /**
     * null or undefined = current time, '' (empty string) = empty time
     */
    constructor(value?: TMereValue | {val: TMereValue, defVal?: TMereValue}) {
        if (value === undefined || value === null || typeof value === 'string' || value instanceof Date) {
            this.set(value as TMereValue)
        } else {
            this.tryset(value.val, value.defVal)
        }
    }

    private _set(value: TMereValue): boolean {
        let date = undefined as Date
        let isDateUndefined = false
        try {
            if (value === null || value === undefined) {
                date = new Date()
            } else if (value === '') {
                isDateUndefined = true
            } else if (typeof value === 'string') {
                if (TF_HOUR.test(value)) {
                    date = new Date(
                        0,
                        0,
                        1,
                        value as unknown as number,
                        0,
                        0,
                        0
                    )
                } else if (TF_HOUR_MIN.test(value)) {
                    const i1 = value.indexOf(':')
                    date = new Date(
                        0,
                        0,
                        1,value.substring(0, i1) as unknown as number,
                        value.substring(i1 + 1) as unknown as number,
                        0,
                        0
                    )
                } else if (TF_HOUR_MIN_SEC.test(value)) {
                    const i1 = value.indexOf(':')
                    const i2 = value.indexOf(':', i1 + 1)
                    date = new Date(
                        0,
                        0,
                        1,value.substring(0, i1) as unknown as number,
                        value.substring(i1 + 1, i2) as unknown as number,
                        value.substring(i2 + 1) as unknown as number,
                        0
                    )
                } else if (TF_HOUR_MIN_SEC_MSEC.test(value)) {
                    const i1 = value.indexOf(':')
                    const i2 = value.indexOf(':', i1 + 1)
                    const i3 = value.indexOf('.', i2 + 1)
                    const msec = value.substring(i3 + 1)
                    const msecLen = msec.length
                    date = new Date(
                        0,
                        0,
                        1,value.substring(0, i1) as unknown as number,
                        value.substring(i1 + 1, i2) as unknown as number,
                        value.substring(i2 + 1, i3) as unknown as number,
                        (msecLen === 1 ? `${msec}00` : msecLen === 2 ? `${msec}0` : `${msec}`) as unknown as number
                    )
                } else {
                    date = toDate(value)
                }
            } else {
                date = toDate(value)
            }

            if (date === undefined && !isDateUndefined) {
                return false
            }
            this._date = date
            if (this._date) {
                this._date.setFullYear(0,0,0)
            }
            this._val = dateFormat(this._date, 'hh:mi:ss.msec')
            return true
        } catch (err) {
            return false
        }
    }

    /**
     * null or undefined = current time, '' (empty string) = empty time
    */
    public set (val: TMereValue) {
        if (!this._set(val)) {
            throw new Error(`value "${val}" is failed to convert to date`)
        }
    }

    /**
     * null or undefined = current time, '' (empty string) = empty time
     */
    public tryset (val: TMereValue, defVal?: TMereValue) {
        if (!this._set(val)) {
            if (!this._set(defVal)) {
                throw new Error(`values "${val}" and "${defVal}" are failed to convert to date`)
            }
        }
    }

    toJSON() {
        return this._val
    }

    toString() {
        return this._val
    }

    toDate(): Date {
        return this._date
    }    
}