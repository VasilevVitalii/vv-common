import { equal } from "."

export const token = {
    /** list of all space chars, new line exclued */
    SPACE_CHARS: [
        ` `,                //space
        `\t`,               //tab
        `\u00A0`,           //Non-breaking space (NBSP)
        `\u2011`,           //Non-breaking hyphen
        `\u200B`,           //Zero-width space
        `\u200C`,           //Zero-width non-joiner
        `\u200D`,           //Zero-width joiner
        `\u2003`,           //Em space
        `\u2002`,           //En space
        `\u2007`,           //Figure space
        `\u2009`            //Thin space
    ],
    /** split string by dividers */
    create: TokenCreate,
    /** find queue in splitting string */
    find: TokenFind
}

function TokenCreate(origin: string, dividers: string[]): string[] {
    const result: string[] = []
    let idx = 0

    while (idx < origin.length) {
        let isFoundDivider = false

        for (const divider of dividers) {
            if (origin.startsWith(divider, idx)) {
                if (idx > 0) {
                    result.push(origin.slice(0, idx))
                }
                result.push(divider)
                origin = origin.slice(idx + divider.length)
                idx = 0
                isFoundDivider = true
                break
            }
        }

        if (!isFoundDivider) {
            idx++
        }
    }

    if (origin.length > 0) {
        result.push(origin)
    }

    return result
}

function TokenFind<T>(
    params: {
        origin: {
            list: T[],
            fieldName: keyof T,
            posBegin?: number,
            posEnd?: number,
            direction?: 'next' | 'prev'
        },
        queue: {
            text: string | string[]
            maxDistance?: number
        }[],
        handleBeforeStep?: (item: T, pos: number, needFindIdx: number, q: { text: null | string[], attempts: number }) => 'skip' | 'add-in-result' | 'exit' | 'process'
    }
): { pos: number, item: T }[] {

    const result = [] as { pos: number, item: T }[]

    const direction = params.origin.direction === 'prev' || params.origin.direction === 'next' ? params.origin.direction : 'next'
    const posBegin = params.origin.posBegin || 0
    const posEnd = params.origin.posEnd || params.origin.list.length - 1
    let pos = direction === 'next' ? posBegin - 1 : posEnd + 1

    const handleBeforeStep = params.handleBeforeStep || (() => { return 'process' })

    const queue = params.queue.map(m => {
        return {
            text: m.text === null ? null : Array.isArray(m.text) ? m.text : [m.text],
            attempts: (m.maxDistance || 0) + 1
        }
    })
    let needFindIdx = 0

    while ((direction === 'next' && pos < posEnd) || (direction === 'prev' && pos > posBegin)) {
        pos = pos + (direction === 'next' ? 1 : -1)
        const item = params.origin.list[pos]
        const q = queue[needFindIdx]

        const h = handleBeforeStep(item, pos, needFindIdx, q)
        if (h === 'skip') {
            continue
        } else if (h === 'exit') {
            return undefined
        } else if (h === 'add-in-result') {
            result.push({item, pos})
            needFindIdx++
        } else {
            if (q.text === null) {
                result.push({item, pos})
                needFindIdx++
            } else {
                if (q.attempts > 0) {
                    q.attempts--
                    if (q.text.some(f => equal(f, item[params.origin.fieldName]))) {
                        result.push({item, pos})
                        needFindIdx++
                    }
                } else {
                    return undefined
                }
            }
        }
        if (queue.length <= result.length) break
        //needFindIdx++
    }




    // if (handle?.before) {
    //     handle?.before(undefined, 0, 0)
    // }
    // if (handle?.after) {
    //     handle?.after(undefined, 0, 0, false)
    // }

    //console.log(queue)

    return result
}
