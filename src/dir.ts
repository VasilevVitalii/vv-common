import fs from 'fs'
import path from 'path'
import { IsEmpty } from './index'

export type TOptions = {
    mode: ('files' | 'paths' | 'all')
}

export type TResult = {
    path: string,
    file: string,
    fsstat: fs.Stats
}

export function Dirs(dir: string, options: TOptions, callback: (error: Error, result: TResult[]) => void) {
    let isSendCallback = false
    if (IsEmpty(options)) {
        options = {
            mode: 'all'
        }
    } else {
        if (IsEmpty(options.mode)) options.mode = 'all'
    }
    DirsInternal(dir, options, (error, result) => {
        if (isSendCallback) return
        isSendCallback = true
        callback(
            error,
            IsEmpty(result) || !Array.isArray(result) ? [] : result.sort((a,b) => {
                if (a.path < b.path) return -1
                if (a.path > b.path) return 1
                const isEa = IsEmpty(a)
                const isEb = IsEmpty(b)
                if (isEa && !isEb) return -1
                if (!isEa && isEb) return 1
                if (a.file < b.file) return -1
                if (a.file > b.file) return 1
                return 0
            })
        )
    })
}

function DirsInternal(dir: string, options: TOptions, callback: (error: Error, result: TResult[]) => void) {
    let files = [] as TResult[]

    fs.readdir(dir, (error, list) => {
        if (!IsEmpty(error)) {
            callback(new Error(`when read dir ${dir} - ${error.message}`), undefined)
            return
        }
        let pending = list.length
        if (!pending) callback(undefined, files)

        list.forEach(fileRelative => {
            const fileAbsolute = path.resolve(dir, fileRelative)
            fs.stat(fileAbsolute, function(error, stat) {
                if (!IsEmpty(error)) {
                    callback(new Error(`when get stat for file/dir ${fileAbsolute} - ${error.message}`), undefined)
                }
                if (!IsEmpty(stat)) {
                    if (stat.isDirectory()) {
                        if (options.mode === 'all' || options.mode === 'paths') {
                            files.push({
                                file: undefined,
                                path: fileAbsolute,
                                fsstat: stat,
                            })
                        }
                        DirsInternal(fileAbsolute, options, function(error, res) {
                            if (!IsEmpty(error)) {
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