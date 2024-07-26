import { toIntPositive } from "."

/**
 * simple timer, based on nested call setTimeout; manual control of each subsequent tick
 * example:
 * const timer = new Timer(500, () => {
 *      console.log('hello')
 *      timer.nextTick(250)
 * })
 * */
export class Timer implements Disposable {
    private _timer = undefined as NodeJS.Timeout
    private _onTick = undefined as () => void
    private _timeout = undefined as number

    constructor(timeout: number, onTick: () => void) {
        this._onTick = onTick
        this._timeout = toIntPositive(timeout)
        if (!this._onTick || this._timeout < 0) return

        this._timer = setTimeout(async () => this._onTick(), this._timeout)
    }
    [Symbol.dispose](): void {
        if (this._timer) {
            clearTimeout(this._timer)
            this._timer = undefined
        }
        if (this._onTick) {
            this._onTick = undefined
        }
        this._timeout = undefined
    }

    nextTick(timeout?: number) {
        const t = toIntPositive(timeout)
        this._timer = setTimeout(this._onTick, t !== undefined && t >= 0 ? t : this._timeout)
    }

    getTimeout(): number {
        return this._timeout
    }
}