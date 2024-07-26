import { dateFormat, TRange } from ".";

type TNumeratorLength = TRange<17,31>

/**
 * simple numerator, based on current time and increment
 * example:
 * const numerator = new Numerator()
 * const id = numerator.getNext()
 * */
export class Numerator {
    private _prevIdx = 0 as number
    private _maxIdx = 99999999999999 as number
    private _maxValueLen = 14 as number
    private _datePart = 'XXXXXXXXXXXXXXXX' as string

    constructor(length?: TNumeratorLength) {
        this._maxIdx = this._getMaxId(length || 30)
        this._maxValueLen = (length || 30) - 15
        this._datePart = this._getTime()
    }

    getNext(): string {
        this._prevIdx++
        if (this._prevIdx > this._maxIdx) {
            this._datePart = this._getTime()
            this._prevIdx = 1
        }
        const idx = this._prevIdx.toString()
        return `${this._datePart}${idx.padStart(this._maxValueLen,'0')}`
    }

    private _getMaxId(length: TNumeratorLength): number {
        if (length >= 30) return 999999999999999
        if (length === 29) return 99999999999999
        if (length === 28) return 9999999999999
        if (length === 27) return 999999999999
        if (length === 26) return 99999999999
        if (length === 25) return 9999999999
        if (length === 24) return 999999999
        if (length === 23) return 99999999
        if (length === 22) return 9999999
        if (length === 21) return 999999
        if (length === 20) return 99999
        if (length === 19) return 9999
        if (length === 18) return 999
        return 99
    }

    private _getTime(): string {
        return dateFormat(new Date(), 'yymmddhhmissmsec')
    }
}
