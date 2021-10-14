/* eslint-disable @typescript-eslint/naming-convention */
import fs from 'fs'
import path from 'path'
import { isEmpty } from './index'

export type TOptions = {
    mode: ('files' | 'paths' | 'all')
}

export type TResult = {
    path: string,
    file: string,
    fsstat: fs.Stats
}

export function dir(dir: string, options: TOptions, callback: (error: Error, result: TResult[]) => void) {
    let isSendCallback = false
    if (isEmpty(options)) {
        options = {
            mode: 'all'
        }
    } else {
        if (isEmpty(options.mode)) options.mode = 'all'
    }
    dirInternal(dir, options, (error, result) => {
        if (isSendCallback) return
        isSendCallback = true
        callback(
            error,
            isEmpty(result) || !Array.isArray(result) ? [] : result.sort((a,b) => {
                if (a.path < b.path) return -1
                if (a.path > b.path) return 1
                const isEa = isEmpty(a)
                const isEb = isEmpty(b)
                if (isEa && !isEb) return -1
                if (!isEa && isEb) return 1
                if (a.file < b.file) return -1
                if (a.file > b.file) return 1
                return 0
            })
        )
    })
}

function dirInternal(dir: string, options: TOptions, callback: (error: Error, result: TResult[]) => void) {
    let files = [] as TResult[]

    fs.readdir(dir, (error, list) => {
        if (!isEmpty(error)) {
            callback(new Error(`when read dir ${dir} - ${error.message}`), undefined)
            return
        }
        let pending = list.length
        if (!pending) callback(undefined, files)

        list.forEach(fileRelative => {
            const fileAbsolute = path.resolve(dir, fileRelative)
            fs.stat(fileAbsolute, function(error, stat) {
                if (!isEmpty(error)) {
                    callback(new Error(`when get stat for file/dir ${fileAbsolute} - ${error.message}`), undefined)
                }
                if (!isEmpty(stat)) {
                    if (stat.isDirectory()) {
                        if (options.mode === 'all' || options.mode === 'paths') {
                            files.push({
                                file: undefined,
                                path: fileAbsolute,
                                fsstat: stat,
                            })
                        }
                        dirInternal(fileAbsolute, options, function(error, res) {
                            if (!isEmpty(error)) {
                                callback(error, undefined)
                            }
                            files = files.concat(res)
                            if (!--pending) callback(undefined, files)
                        })
                    } else if (stat.isFile()) {
                        if ((options.mode === 'all' || options.mode === 'files')) {
                            files.push({
                                file: fileRelative,
                                path: dir,
                                fsstat: stat,
                            })
                        }
                        if (!--pending) callback(undefined, files)
                    }
                }
            })
        })
    })
}