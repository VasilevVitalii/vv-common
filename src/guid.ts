/* eslint-disable @typescript-eslint/naming-convention */

/** Generate NON-UNIQUE guid by very-sery simple idea, based only on Math.random() */
export function guid(dividor?: '-' | ''): string {
    const d = dividor === '' ? '' : '-'
    return `${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}${d}${r()}${r()}${r()}${r()}${d}4${r()}${r()}${r()}${d}${r()}${r()}${r()}${r()}${d}${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}${r()}`
}

function r(): string {
    const r = Math.random()
    if (r <= 0.0625) return '0'
    if (r <= 0.125) return '1'
    if (r <= 0.1875) return '2'
    if (r <= 0.25) return '3'
    if (r <= 0.3125) return '4'
    if (r <= 0.375) return '5'
    if (r <= 0.4375) return '6'
    if (r <= 0.5) return '7'
    if (r <= 0.5625) return '8'
    if (r <= 0.625) return '9'
    if (r <= 0.6875) return 'A'
    if (r <= 0.75) return 'B'
    if (r <= 0.8125) return 'C'
    if (r <= 0.875) return 'D'
    if (r <= 0.9375) return 'E'
    return 'F'
}