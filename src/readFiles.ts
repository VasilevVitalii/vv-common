import * as fs from 'fs'

/* eslint-disable @typescript-eslint/naming-convention */
type TReadFile = {fullFileName: string, data?: any, errorRead?: string }
type TReadFileOption = {
    /** default  'utf8'*/
    encoding?: 'utf8' | 'base64' | 'binary'
}

/** read many files */
export function readFiles(fullFileNames: string[], options: TReadFileOption, callback: (files: TReadFile[]) => void) {
    const opt: TReadFileOption = {}
    opt.encoding = options?.encoding || 'utf8'

    const files: TReadFile[] = fullFileNames.map(m => { return {fullFileName: m} })
    internalReadFiles(files, opt, 0, () => {
        callback(files)
    })
}

function internalReadFiles(files: TReadFile[], options: TReadFileOption, idx: number, callback: () => void) {
    if (idx >= files.length) {
        callback()
        return
    }
    const f = files[idx]
    fs.readFile(f.fullFileName, options.encoding, (err, data) => {
        if (err) {
            f.errorRead = err.message
        } else {
            f.data = data
        }
        idx++
        internalReadFiles(files, options, idx, callback)
    })
}