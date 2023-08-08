//https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md

import * as vv from '../src'

const KNOWN_DATE1 = new Date(1977, 10, 16, 14, 30, 42, 555)
const KNOWN_DATE2 = new Date(1984, 0, 1, 1, 1, 1, 1)
const KNOWN_OBJ = {
    aaa: 5,
    bbb: '1',
    ddd: '1977-11-16T14:30:42.555',
    arr1: [
        {zz: 1}, {zz: 2}
    ],
    arr2: [1, 2, 3]
}

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

OnTest('isEmpty')
if (vv.isEmpty(false) || vv.isEmpty('asf') || vv.isEmpty({a: 5}) || vv.isEmpty({})) {
    OnError()
}
OnTest('isEmpty')
if (!vv.isEmpty(undefined) || !vv.isEmpty('  ') || !vv.isEmpty(null) || !vv.isEmpty(NaN)) {
    OnError()
}
OnTest('isFunction')
if (vv.isFunction(false) || vv.isFunction('asf') || vv.isFunction({a: 5}) || vv.isFunction({}) || vv.isFunction(undefined) || vv.isFunction(null)) {
    OnError()
}
OnTest('isFunction')
if (!vv.isFunction(OnError) || !vv.isFunction(() => {})) {
    OnError()
}
OnTest('isGuid')
if (vv.isGuid(false) || vv.isGuid('asf') || vv.isGuid({a: 5}) || vv.isGuid({}) || vv.isGuid(undefined) || vv.isGuid('  ') || vv.isGuid(null) || vv.isGuid(NaN)) {
    OnError()
}
OnTest('isGuid')
if (!vv.isGuid('A7C52954-1823-4C43-BBB4-C6099475B4C1') || !vv.isGuid('00000000-0000-0000-0000-000000000000')) {
    OnError()
}
OnTest('isIp')
if (vv.isIp('192.999.5.6') || vv.isIp(false) || vv.isIp('asf') || vv.isIp({a: 5}) || vv.isIp({}) || vv.isIp(undefined) || vv.isIp('  ') || vv.isIp(null) || vv.isIp(NaN)) {
    OnError()
}
OnTest('isIp')
if (!vv.isIp('8.8.8.8') || !vv.isIp('192.168.0.42')) {
    OnError()
}
OnTest('nz')
if (vv.nz('a','b') !== 'a' || vv.nz(undefined,null,undefined,NaN,'','ss') !== 'ss') {
    OnError()
}
OnTest('replace')
if (
    vv.replace('a','b',null) !== null ||
    vv.replace('a','b',undefined) !== undefined ||
    vv.replace('a','b','1a2') !== '1b2' ||
    vv.replace('a','b','1a2a3') !== '1b2b3' ||
    vv.replace('a','b','1a2b3') !== '1b2b3' ||
    vv.replace('a','b','123') !== '123'
) {
    OnError()
}
OnTest('dateFormat')
if (
    vv.dateFormat(KNOWN_DATE1, '126') !== '1977-11-16T14:30:42.555' ||
    vv.dateFormat(KNOWN_DATE1, 'yy.mm.dd') !== '77.11.16' ||
    vv.dateFormat(KNOWN_DATE1, 'hh.mi.ss') !== '14.30.42' ||
    vv.dateFormat(KNOWN_DATE1, 'yyyy.mm.dd hh:mm:mi:ss.msec') !== '1977.11.16 14:11:30:42.555' ||
    vv.dateFormat(KNOWN_DATE1, 'yyyymmddhhmissmsec') !== '19771116143042555'
) {
    OnError()
}

OnTest('dateFormat')
if (
    vv.dateFormat(KNOWN_DATE2, '126') !== '1984-01-01T01:01:01.001' ||
    vv.dateFormat(KNOWN_DATE2, 'yy.mm.dd') !== '84.01.01' ||
    vv.dateFormat(KNOWN_DATE2, 'hh.mi.ss') !== '01.01.01' ||
    vv.dateFormat(KNOWN_DATE2, 'yyyy.mm.dd hh:mm:mi:ss.msec') !== '1984.01.01 01:01:01:01.001' ||
    vv.dateFormat(KNOWN_DATE2, 'yyyymmddhhmissmsec') !== '19840101010101001'
) {
    OnError()
}

OnTest('dateFormatOrdinal')
if (
    vv.dateFormatOrdinal(KNOWN_DATE1, 'dayInYear') !== '320' ||
    vv.dateFormatOrdinal(KNOWN_DATE2, 'dayInYear') !== '001' ||
    vv.dateFormatOrdinal(KNOWN_DATE1, 'secInDay') !== '52242' ||
    vv.dateFormatOrdinal(KNOWN_DATE2, 'secInDay') !== '03661'
) {
    OnError()
}

OnTest('dateParts')
if (
    JSON.stringify(vv.dateParts(8)) !== JSON.stringify({day: 0, hour: 0, minute: 0, second: 0, millisecond: 8 }) ||
    JSON.stringify(vv.dateParts(999)) !== JSON.stringify({day: 0, hour: 0, minute: 0, second: 0, millisecond: 999 }) ||
    JSON.stringify(vv.dateParts(1000)) !== JSON.stringify({day: 0, hour: 0, minute: 0, second: 1, millisecond: 0 }) ||
    JSON.stringify(vv.dateParts(5123)) !== JSON.stringify({day: 0, hour: 0, minute: 0, second: 5, millisecond: 123 }) ||
    JSON.stringify(vv.dateParts(59999)) !== JSON.stringify({day: 0, hour: 0, minute: 0, second: 59, millisecond: 999 }) ||
    JSON.stringify(vv.dateParts(60000)) !== JSON.stringify({day: 0, hour: 0, minute: 1, second: 0, millisecond: 0 }) ||
    JSON.stringify(vv.dateParts(3599999)) !== JSON.stringify({day: 0, hour: 0, minute: 59, second: 59, millisecond: 999 }) ||
    JSON.stringify(vv.dateParts(3600000)) !== JSON.stringify({day: 0, hour: 1, minute: 0, second: 0, millisecond: 0 }) ||
    JSON.stringify(vv.dateParts(3600000 + 60000 * 2 + 1000 * 3 + 42)) !== JSON.stringify({day: 0, hour: 1, minute: 2, second: 3, millisecond: 42 }) ||
    JSON.stringify(vv.dateParts(86399999)) !== JSON.stringify({day: 0, hour: 23, minute: 59, second: 59, millisecond: 999 }) ||
    JSON.stringify(vv.dateParts(86400000)) !== JSON.stringify({day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }) ||
    JSON.stringify(vv.dateParts(86400000 + 3600000 * 16 + 60000 * 30 + 1000 * 42 + 321)) !== JSON.stringify({day: 1, hour: 16, minute: 30, second: 42, millisecond: 321 })
) {
    OnError()
}

OnTest('dateAdd')
if (
    vv.dateFormat(vv.dateAdd(KNOWN_DATE1, 'day', 1), '126') !== '1977-11-17T14:30:42.555' ||
    vv.dateFormat(vv.dateAdd(KNOWN_DATE1, 'hour', 1), '126') !== '1977-11-16T15:30:42.555' ||
    vv.dateFormat(vv.dateAdd(KNOWN_DATE1, 'minute', 1), '126') !== '1977-11-16T14:31:42.555' ||
    vv.dateFormat(vv.dateAdd(KNOWN_DATE1, 'second', 1), '126') !== '1977-11-16T14:30:43.555' ||
    vv.dateFormat(vv.dateAdd(KNOWN_DATE1, 'day', -1), '126') !== '1977-11-15T14:30:42.555' ||
    vv.dateFormat(vv.dateAdd(KNOWN_DATE1, 'hour', -1), '126') !== '1977-11-16T13:30:42.555' ||
    vv.dateFormat(vv.dateAdd(KNOWN_DATE1, 'minute', -1), '126') !== '1977-11-16T14:29:42.555' ||
    vv.dateFormat(vv.dateAdd(KNOWN_DATE1, 'second', -1), '126') !== '1977-11-16T14:30:41.555'
) {
    OnError()
}

OnTest('toString')
if (vv.toString('aa') !== 'aa' || vv.toString(100.34) !== '100.34' || vv.toString(true) !== 'true' || vv.toString(KNOWN_DATE1) !== '1977-11-16T14:30:42.555') {
    OnError()
}

OnTest('toInt')
if (vv.toInt('aa') !== undefined || vv.toInt(100.34) !== undefined || vv.toInt(true) !== 1 || vv.toInt(KNOWN_DATE1) !== undefined || vv.toInt('42') !== 42 || vv.toInt('-42') !== -42) {
    OnError()
}

OnTest('toIntPositive')
if (vv.toIntPositive('aa') !== undefined || vv.toIntPositive(100.34) !== undefined || vv.toIntPositive(true) !== 1 || vv.toIntPositive(KNOWN_DATE1) !== undefined || vv.toIntPositive('42') !== 42 || vv.toIntPositive('-42') !== undefined) {
    OnError()
}

OnTest('toFloat')
if (vv.toFloat('aa') !== undefined || vv.toFloat(100.34) !== 100.34 || vv.toFloat(true) !== 1 || vv.toFloat(KNOWN_DATE1) !== undefined ||
    vv.toFloat('42') !== 42 || vv.toFloat('-42') !== -42 ||
    vv.toFloat('42.11') !== 42.11 || vv.toFloat('-42.22') !== -42.22 ||
    vv.toFloat('42,11') !== 42.11 || vv.toFloat('-42,22') !== -42.22
) {
    OnError()
}

OnTest('toBool')
if (vv.toBool('aa') !== undefined || vv.toBool(100.34) !== undefined || vv.toBool(true) !== true || vv.toBool(KNOWN_DATE1) !== undefined ||
    vv.toBool('true') !== true || vv.toBool('1') !== true || vv.toBool(1) !== true ||
    vv.toBool('false') !== false || vv.toBool('0') !== false || vv.toBool(0) !== false
) {
    OnError()
}

OnTest('toDate')
if (
    vv.toDate('aa') !== undefined || vv.toDate(1) !== undefined || vv.toDate(true) !== undefined ||
    vv.dateFormat(vv.toDate(KNOWN_DATE1), '126') !== vv.dateFormat(KNOWN_DATE1,'126') ||
    vv.dateFormat(vv.toDate('1977-11-16T14:30:42.555'), '126') !== vv.dateFormat(KNOWN_DATE1, '126') ||
    vv.dateFormat(vv.toDate('1977.11.16'), '126') !== vv.dateFormat(new Date(1977, 10, 16), '126') ||
    vv.dateFormat(vv.toDate('1977-11-16'), '126') !== vv.dateFormat(new Date(1977, 10, 16), '126')
) {
    OnError()
}

OnTest('toArray')
if (vv.toArray('aa') !== undefined || vv.toArray(100.34) !== undefined || JSON.stringify(vv.toArray([])) !== JSON.stringify([]) || JSON.stringify(vv.toArray([1,2])) !== JSON.stringify([1,2])
) {
    OnError()
}

OnTest('equal')
if (
    !vv.equal(' AA ', 'aa') || !vv.equal(KNOWN_DATE1,KNOWN_DATE1)  || vv.equal(KNOWN_DATE1,KNOWN_DATE2) || !vv.equal(undefined, undefined) || vv.equal(4, undefined) ||  vv.equal('a', 'b') || !vv.equal(10,10)
) {
    OnError()
}

OnTest('equal')
if (
    !vv.equal(undefined, null) || !vv.equal(undefined, '') || !vv.equal('', null)
) {
    OnError()
}

OnTest('prop')
if (vv.prop(KNOWN_OBJ, 'AAA') !== 5 || vv.prop(KNOWN_OBJ, 'bbb') !== '1'  ||
    vv.prop(KNOWN_OBJ, 'Ddd') !== '1977-11-16T14:30:42.555' ||
    JSON.stringify(vv.prop(KNOWN_OBJ, 'arr2')) !== JSON.stringify([1,2,3]) ||
    vv.prop(KNOWN_OBJ, 'yyy') !== undefined
) {
    OnError()
}

OnTest('guid')
const g1 = vv.guid()
const g2 = vv.guid()
if (g1 === g2 || !vv.isGuid(g1) || !vv.isGuid(g2)) {
    OnError()
}

OnTest('PackajeJsonParse')
const p = [
    '{',
    '    "name": "vv-common",',
    '    "version": "0.0.5",',
    '    "description": "many small functions for everyday use",',
    '    "main": "dist/src/index.js",',
    '    "scripts": {',
    '        "test": "node ./dist/test/index.js",',
    '        "update": "npx npm-check-updates -u && npm i && npm audit fix && node ./node_modules/vv-template-nodebackend/index.js",',
    '        "build": "tsc",',
    '        "precommit": "node ./.auto/precommit.js"',
    '    },',
    '    "repository": {',
    '        "type": "git",',
    '        "url": "git+https://github.com/VasilevVitalii/vv-common.git"',
    '    },',
    '    "author": "Vitalii Vasilev",',
    '    "license": "MIT",',
    '    "bugs": {',
    '        "url": "https://github.com/VasilevVitalii/vv-common/issues"',
    '    },',
    '    "homepage": "https://github.com/VasilevVitalii/vv-common#readme",',
    '    "devDependencies": {',
    '        "vv-template-nodebackend": "0.0.12",',
    '        "@types/node": "16.11.6",',
    '        "@typescript-eslint/eslint-plugin": "5.2.0",',
    '        "@typescript-eslint/parser": "5.2.0",',
    '        "eslint": "8.1.0",',
    '        "npm-check-updates": "11.8.5",',
    '        "prettier": "2.4.1",',
    '        "ts-node": "10.4.0",',
    '        "typescript": "4.4.4"',
    '    }',
    '}',
].join('\n')
const pp = vv.PackajeJsonParse(p)
if (
    pp.name !== 'vv-common' || pp.version !== '0.0.5' || pp.scripts.length <= 0 || pp.dependencies.length > 0 || pp.devDependencies.length <= 0
) {
    OnError()
}

if (countErrors > 0) {
    console.warn(`FAILED ${countErrors} TESTS`)
} else {
    console.log(`TESTS ${testPosition} DONE`)
}