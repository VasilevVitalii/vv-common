//https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md

import * as vv from '../src'

const KNOWN_DATE1 = new Date(1977, 10, 16, 14, 30, 42, 555)
const KNOWN_DATE2 = new Date(1984, 0, 1, 1, 1, 1, 1)

let testPosition = 0
let countErrors = 0

function OnTest(name: string) {
    testPosition++
    console.log(`RUN TEST "${name}" #${testPosition}`)
}


function OnError() {
    countErrors++
    console.warn(`TEST #${testPosition} FAIL`)
}

OnTest('IsEmpty')
if (vv.IsEmpty(false) || vv.IsEmpty('asf') || vv.IsEmpty({a: 5}) || vv.IsEmpty({})) {
    OnError()
}
OnTest('IsEmpty')
if (!vv.IsEmpty(undefined) || !vv.IsEmpty('  ') || !vv.IsEmpty(null) || !vv.IsEmpty(NaN)) {
    OnError()
}
OnTest('IsFunction')
if (vv.IsFunction(false) || vv.IsFunction('asf') || vv.IsFunction({a: 5}) || vv.IsFunction({}) || vv.IsFunction(undefined) || vv.IsFunction(null)) {
    OnError()
}
OnTest('IsFunction')
if (!vv.IsFunction(OnError) || !vv.IsFunction(() => {})) {
    OnError()
}
OnTest('IsGuid')
if (vv.IsGuid(false) || vv.IsGuid('asf') || vv.IsGuid({a: 5}) || vv.IsGuid({}) || vv.IsGuid(undefined) || vv.IsGuid('  ') || vv.IsGuid(null) || vv.IsGuid(NaN)) {
    OnError()
}
OnTest('IsGuid')
if (!vv.IsGuid('A7C52954-1823-4C43-BBB4-C6099475B4C1') || !vv.IsGuid('00000000-0000-0000-0000-000000000000')) {
    OnError()
}
OnTest('IsIp')
if (vv.IsIp('192.999.5.6') || vv.IsIp(false) || vv.IsIp('asf') || vv.IsIp({a: 5}) || vv.IsIp({}) || vv.IsIp(undefined) || vv.IsIp('  ') || vv.IsIp(null) || vv.IsIp(NaN)) {
    OnError()
}
OnTest('IsIp')
if (!vv.IsIp('8.8.8.8') || !vv.IsIp('192.168.0.42')) {
    OnError()
}
OnTest('Nz')
if (vv.Nz('a','b') !== 'a' || vv.Nz(undefined,null,undefined,NaN,'','ss') !== 'ss') {
    OnError()
}


OnTest('DateFormat')
if (
    vv.DateFormat(KNOWN_DATE1, '126') !== '1977-11-16T14:30:42.555' ||
    vv.DateFormat(KNOWN_DATE1, 'yy.mm.dd') !== '77.11.16' ||
    vv.DateFormat(KNOWN_DATE1, 'hh.mi.ss') !== '14.30.42' ||
    vv.DateFormat(KNOWN_DATE1, 'yyyy.mm.dd hh:mm:mi:ss.msec') !== '1977.11.16 14:11:30:42.555' ||
    vv.DateFormat(KNOWN_DATE1, 'yyyymmddhhmissmsec') !== '19771116143042555'
) {
    OnError()
}

OnTest('DateFormat')
if (
    vv.DateFormat(KNOWN_DATE2, '126') !== '1984-01-01T01:01:01.001' ||
    vv.DateFormat(KNOWN_DATE2, 'yy.mm.dd') !== '84.01.01' ||
    vv.DateFormat(KNOWN_DATE2, 'hh.mi.ss') !== '01.01.01' ||
    vv.DateFormat(KNOWN_DATE2, 'yyyy.mm.dd hh:mm:mi:ss.msec') !== '1984.01.01 01:01:01:01.001' ||
    vv.DateFormat(KNOWN_DATE2, 'yyyymmddhhmissmsec') !== '19840101010101001'
) {
    OnError()
}

OnTest('DateFormatOrdinal')
if (
    vv.DateFormatOrdinal(KNOWN_DATE1, 'dayInYear') !== '320' ||
    vv.DateFormatOrdinal(KNOWN_DATE2, 'dayInYear') !== '001' ||
    vv.DateFormatOrdinal(KNOWN_DATE1, 'secInDay') !== '52242' ||
    vv.DateFormatOrdinal(KNOWN_DATE2, 'secInDay') !== '03661'
) {
    OnError()
}

OnTest('DateAdd')
if (
    vv.DateFormat(vv.DateAdd(KNOWN_DATE1, 'day', 1), '126') !== '1977-11-17T14:30:42.555' ||
    vv.DateFormat(vv.DateAdd(KNOWN_DATE1, 'hour', 1), '126') !== '1977-11-16T15:30:42.555' ||
    vv.DateFormat(vv.DateAdd(KNOWN_DATE1, 'minute', 1), '126') !== '1977-11-16T14:31:42.555' ||
    vv.DateFormat(vv.DateAdd(KNOWN_DATE1, 'second', 1), '126') !== '1977-11-16T14:30:43.555' ||
    vv.DateFormat(vv.DateAdd(KNOWN_DATE1, 'day', -1), '126') !== '1977-11-15T14:30:42.555' ||
    vv.DateFormat(vv.DateAdd(KNOWN_DATE1, 'hour', -1), '126') !== '1977-11-16T13:30:42.555' ||
    vv.DateFormat(vv.DateAdd(KNOWN_DATE1, 'minute', -1), '126') !== '1977-11-16T14:29:42.555' ||
    vv.DateFormat(vv.DateAdd(KNOWN_DATE1, 'second', -1), '126') !== '1977-11-16T14:30:41.555'
) {
    OnError()
}

// OnTest('ToString')
// if (vv.ToString('aa') !== 'aa' || vv.ToString(100.34) !== '100.34' || vv.ToString() !== '100.34') {
//     OnError()
// }

// Equal
// ToString
// ToInt
// ToFloat
// ToBool
// ToDate
// Prop

if (countErrors > 0) {
    console.warn(`FAILED ${countErrors} TESTS`)
} else {
    console.log(`TESTS ${testPosition} DONE`)
}

