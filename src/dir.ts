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
    file: string,
    fsstat: fs.Stats
}

type TState = {
    options: TOptions,
    currentDeep: number,
    needScanDir: string[]
    result: TResult[]
}

export function dir(dir: string, options: TOptions, callback: (error: Error, result: TResult[]) => void) {
    let isSendCallback = false
    const state: TState = {
        options: {
            mode: options?.mode,
            deep: options?.deep,
        },
        currentDeep: 0,
        needScanDir: [dir],
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
    state.currentDeep++

    const dir = state.needScanDir.shift()
    if (isEmpty(dir)) {
        callback(undefined)
        return
    }

    fs.readdir(dir, (error, list) => {
        if (!isEmpty(error)) {
            callback(new Error(`when read dir ${dir} - ${error.message}`))
            return
        }

        if (list.length <= 0) {
            dirInternal(state, callback)
            return
        }

        list.forEach((item, idx) => {
            const fileAbsolute = path.resolve(dir, item)
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
                                path: dir,
                                fsstat: stat,
                            })
                        }
                    } else if (stat.isDirectory()) {
                        if (state.options.mode === 'all' || state.options.mode === 'paths') {
                            state.result.push({
                                file: undefined,
                                path: fileAbsolute,
                                fsstat: stat,
                            })
                        }
                        if (state.currentDeep < state.options.deep) {
                            state.needScanDir.push(fileAbsolute)
                        }
                    }
                }
                if (idx + 1 === list.length) {
                    dirInternal(state, callback)
                }
            })
        })

        // list.forEach(fileRelative => {
        //     const fileAbsolute = path.resolve(dir, fileRelative)
        //     fs.stat(fileAbsolute, function(error, stat) {
        //         if (!isEmpty(error)) {
        //             callback(new Error(`when get stat for file/dir ${fileAbsolute} - ${error.message}`))
        //         }
        //         if (isEmpty(stat)) return

        //         if (stat.isDirectory()) {
        //             if (state.options.mode === 'all' || state.options.mode === 'paths') {
        //                 state.result.push({
        //                     file: undefined,
        //                     path: fileAbsolute,
        //                     fsstat: stat,
        //                 })
        //             }
        //             dirInternal(fileAbsolute, state, error => {
        //                 if (!isEmpty(error)) {
        //                     callback(error)
        //                 }
        //                 //files = files.concat(res)
        //                 //if (!--pending) callback(undefined, files)
        //             })
        //         } else if (stat.isFile()) {
        //             if ((state.options.mode === 'all' || state.options.mode === 'files')) {
        //                 state.result.push({
        //                     file: fileRelative,
        //                     path: dir,
        //                     fsstat: stat,
        //                 })
        //             }
        //         }
        //     })
        // })

        //callback(undefined)
    })
}