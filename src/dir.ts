/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs'
import path from 'path'
import { isEmpty } from './index'

export type TOptions = {
    mode: ('files' | 'paths' | 'all'),
    /** min deep =1 */
    deep?: number
}

export type TResult = {
    path: string,
    subpath: string,
    file: string,
    fsstat: fs.Stats
}

type TState = {
    options: TOptions,
    needScanDir: {dir: string, deep: number, subdir: string}[]
    result: TResult[],
    needScanIdx: number
}

export function dir(dir: string, options: TOptions, callback: (error: Error, result: TResult[]) => void) {
    let isSendCallback = false
    const state: TState = {
        options: {
            mode: options?.mode,
            deep: options?.deep,
        },
        needScanDir: [{dir: dir, deep: 0, subdir: ''}],
        needScanIdx: 0,
        result: []
    }
    if (isEmpty(state.options.mode) || (state.options.mode !== 'all' && state.options.mode !== 'files' && state.options.mode !== 'paths')) {
        state.options.mode = 'all'
    }
    if (isEmpty(state.options.deep) || state.options.deep < 1) {
        state.options.deep = 999999
    }
    dirInternal(state, error => {
        if (isSendCallback) return
        isSendCallback = true
        callback(
            error,
            isEmpty(error) ? state.result.sort((a,b) => {
                if (a.path < b.path) return -1
                if (a.path > b.path) return 1
                const isEa = isEmpty(a)
                const isEb = isEmpty(b)
                if (isEa && !isEb) return -1
                if (!isEa && isEb) return 1
                if (a.file < b.file) return -1
                if (a.file > b.file) return 1
                return 0
            }) : []
        )
    })
}

function dirInternal(state: TState, callback: (error: Error) => void) {

    const stateIdx = state.needScanDir.findIndex(f => f.deep < state.options.deep)
    const stateItem = stateIdx < 0 ? undefined : state.needScanDir.splice(stateIdx, 1)[0]

    if (stateItem === undefined) {
        callback(undefined)
        return
    }

    fs.readdir(stateItem.dir, (error, list) => {
        if (!isEmpty(error)) {
            callback(new Error(`when read dir ${stateItem} - ${error.message}`))
            return
        }

        if (list.length <= 0) {
            dirInternal(state, callback)
            return
        }

        list.forEach((item, idx) => {
            const fileAbsolute = path.resolve(stateItem.dir, item)
            fs.stat(fileAbsolute, (error, stat) => {
                if (error) {
                    callback(new Error(`when get stat for file/dir ${fileAbsolute} - ${error.message}`))
                    return
                }
                if (!isEmpty(stat)) {
                    if (stat.isFile()) {
                        if ((state.options.mode === 'all' || state.options.mode === 'files')) {
                            state.result.push({
                                file: item,
                                path: stateItem.dir,
                                subpath: stateItem.subdir,
                                fsstat: stat,
                            })
                        }
                    } else if (stat.isDirectory()) {
                        if (state.options.mode === 'all' || state.options.mode === 'paths') {
                            state.result.push({
                                file: undefined,
                                path: fileAbsolute,
                                subpath: path.join(stateItem.subdir, item),
                                fsstat: stat,
                            })
                        }
                        state.needScanDir.push({dir: fileAbsolute, deep: stateItem.deep + 1, subdir: path.join(stateItem.subdir, item)})
                    }
                }
                if (idx + 1 === list.length) {
                    dirInternal(state, callback)
                }
            })
        })
    })
}