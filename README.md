# vv-common

## Features
many small functions for everyday use
## License
***MIT***
## Use
```bash
npm i vv-common
```
```typescript
import * as vv from 'vv-common'
```
## Functions
### isEmpty
check variable is empty
```typescript
console.log(vv.isEmpty(false))				//false
console.log(vv.isEmpty('asf'))				//false
console.log(vv.isEmpty({a: 5}))				//false
console.log(vv.isEmpty({}))					//false
console.log(vv.isEmpty(undefined))			//true
console.log(vv.isEmpty('  '))				//true
console.log(vv.isEmpty(null))				//true
console.log(vv.isEmpty(NaN))				//true
```
### isFunction
check object is function
```typescript
console.log()

console.log(vv.isFunction(false))			//false
console.log(vv.isFunction('asf'))			//false
console.log(vv.isFunction({a: 5}))			//false
console.log(vv.isFunction({}))				//false
console.log(vv.isFunction(undefined))		//false
console.log(vv.isFunction(null)))			//false

function thisFunction() {
	console.log('I am function')
}

console.log(vv.isFunction(thisFunction))	//true
console.log(vv.isFunction(() => {}))		//true
```
### isGuid
check string is guid
```typescript
console.log(vv.isGuid(false))				//false
console.log(vv.isGuid('asf'))				//false
console.log(vv.isGuid({a: 5}))				//false
console.log(vv.isGuid({}))					//false
console.log(vv.isGuid(undefined))			//false
console.log(vv.isGuid('  '))				//false
console.log(vv.isGuid(null))				//false
console.log(vv.isGuid(NaN))					//false
console.log(vv.isGuid('A7C52954-1823-4C43-BBB4-C6099475B4C1'))	//true
console.log(vv.isGuid('00000000-0000-0000-0000-000000000000'))	//true
```
### isIp
check string is IP address
```typescript
console.log()
console.log(vv.isIp('192.999.5.6'))			//false
console.log(vv.isIp(false))					//false
console.log(vv.isIp('asf'))					//false
console.log(vv.isIp({a: 5}))				//false
console.log(vv.isIp({}))					//false
console.log(vv.isIp(undefined))				//false
console.log(vv.isIp('  '))					//false
console.log(vv.isIp(null))					//false
console.log(vv.isIp(NaN))					//false
console.log(vv.isIp('8.8.8.8'))				//true
console.log(vv.isIp('192.168.0.42'))		//true
```
### nz
return first non-empty (see function isEmpty) parameter
```typescript
console.log(vv.nz('a','b'))								//'a'
console.log(vv.nz(undefined,null,undefined,NaN,'','b'))	//'b'
```
### replace
replace all substrings in string
```typescript
console.log(vv.replace('a','b',null))		//null
console.log(vv.replace('a','b',undefined))	//undefined
console.log(vv.replace('a','b','123'))		//'123'
console.log(vv.replace('a','b','1a2a3'))	//'1b2b3'
```
### dateFormat
convert date to formatted string
```typescript
const DDD = new Date(1977, 10, 16, 14, 30, 42, 555)
console.log(vv.dateFormat(DDD, '126'))							//'1977-11-16T14:30:42.555'
console.log(vv.dateFormat(DDD, 'yy.mm).dd')						//'77.11.16'
console.log(vv.dateFormat(DDD, 'hh.mi).ss')						//'14.30.42'
console.log(vv.dateFormat(DDD, 'yyyy.mm).dd hh:mm:mi:ss.msec')	//'1977.11.16 14:11:30:42.555'
console.log(vv.dateFormat(DDD, 'yyyymmddhhmissmsec'))			//'19771116143042555'
```
### dateFormatOrdinal
return part of date
```typescript
const DDD = new Date(1977, 10, 16, 14, 30, 42, 555)
console.log(vv.dateFormatOrdinal(DDD, 'dayInYear')	//'320'
console.log(vv.dateFormatOrdinal(DDD, 'secInDay')	//'52242'
```
### dateParts
return date parts for milliseconds
```typescript
console.log(vv.dateParts(8))
	//{ day: 0, hour: 0, minute: 0, second: 0, millisecond: 8 }
console.log(vv.dateParts(999))
	//{ day: 0, hour: 0, minute: 0, second: 0, millisecond: 999 }
console.log(vv.dateParts(1000))
	//{ day: 0, hour: 0, minute: 0, second: 1, millisecond: 0 })
console.log(vv.dateParts(5123))
	//{ day: 0, hour: 0, minute: 0, second: 5, millisecond: 123 }
console.log(vv.dateParts(59999))
	//{ day: 0, hour: 0, minute: 0, second: 59, millisecond: 999 }
console.log(vv.dateParts(60000))
	// {day: 0, hour: 0, minute: 1, second: 0, millisecond: 0 }
console.log(vv.dateParts(3599999))
	//{ day: 0, hour: 0, minute: 59, second: 59, millisecond: 999 }
console.log(vv.dateParts(3600000))
	//{ day: 0, hour: 1, minute: 0, second: 0, millisecond: 0 }
console.log(vv.dateParts(3600000 + 60000 * 2 + 1000 * 3 + 42))
	//{ day: 0, hour: 1, minute: 2, second: 3, millisecond: 42 }
console.log(vv.dateParts(86399999))
	//{ day: 0, hour: 23, minute: 59, second: 59, millisecond: 999 }
console.log(vv.dateParts(86400000))
	//{ day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 }
console.log(vv.dateParts(86400000 + 3600000 * 16 + 60000 * 30 + 1000 * 42 + 321))
	//{ day: 1, hour: 16, minute: 30, second: 42, millisecond: 321 }
```
### dateAdd
add date to date
```typescript
const DDD = new Date(1977, 10, 16, 14, 30, 42, 555)
console.log(vv.dateFormat(DDD, '126'))			//'1977-11-16T14:30:42.555'
console.log(vv.dateFormat(vv.dateAdd(DDD, 'day', 1), '126'))		//'1977-11-17T14:30:42.555'
console.log(vv.dateFormat(vv.dateAdd(DDD, 'hour', 1), '126'))		//'1977-11-16T15:30:42.555'
console.log(vv.dateFormat(vv.dateAdd(DDD, 'minute', 1), '126'))		//'1977-11-16T14:31:42.555'
console.log(vv.dateFormat(vv.dateAdd(DDD, 'second', 1), '126'))		//'1977-11-16T14:30:43.555'
console.log(vv.dateFormat(vv.dateAdd(DDD, 'day', -1), '126'))		//'1977-11-15T14:30:42.555'
console.log(vv.dateFormat(vv.dateAdd(DDD, 'hour', -1), '126'))		//'1977-11-16T13:30:42.555'
console.log(vv.dateFormat(vv.dateAdd(DDD, 'minute', -1), '126'))	//'1977-11-16T14:29:42.555'
console.log(vv.dateFormat(vv.dateAdd(DDD, 'second', -1), '126'))	//'1977-11-16T14:30:41.555'
```
### toString
convert variable to string
```typescript
const DDD = new Date(1977, 10, 16, 14, 30, 42, 555)
console.log(vv.toString(undefined))	//''
console.log(vv.toString('aa'))		//'aa'
console.log(vv.toString(100.34))	//'100.34'
console.log(vv.toString(true))		//'true'
console.log(vv.toString(DDD) )		//'1977-11-16T14:30:42.555'
```
### toInt
convert variable to integer value
```typescript
console.log(vv.toInt('aa'))				//undefined
console.log(vv.toInt(100.34))			//undefined
console.log(vv.toInt(true))				//1
console.log(vv.toInt(false))			//0
console.log(vv.toInt(new Date()))		//undefined
console.log(vv.toInt('42'))				//42
console.log(vv.toInt('-42'))			//-42
```
### toIntPositive
convert variable to positive integer value
```typescript
console.log(vv.toInt('aa'))				//undefined
console.log(vv.toInt(100.34))			//undefined
console.log(vv.toInt(true))				//1
console.log(vv.toInt(new Date()))		//undefined
console.log(vv.toInt('42'))				//42
console.log(vv.toInt('-42'))			//undefined
```
### toFloat
convert variable to float value
```typescript
console.log(vv.toFloat('aa'))			//undefined
console.log(vv.toFloat(100.34))			//100.34
console.log(vv.toFloat(true))			//1
console.log(vv.toFloat(false))			//0
console.log(vv.toFloat(new Date()))		//undefined
console.log(vv.toFloat('42'))			//42
console.log(vv.toFloat('-42'))			//-42
console.log(vv.toFloat('42.11'))		//42.11
console.log(vv.toFloat('-42.22'))		//-42.22
console.log(vv.toFloat('42,11'))		//42.11
console.log(vv.toFloat('-42,22'))		//-42.22
```
### toBool
convert variable to boolean value
```typescript
console.log(vv.toBool('aa'))			//undefined
console.log(vv.toBool(100.34))			//undefined
console.log(vv.toBool(true))			//true
console.log(vv.toBool(false))			//false
console.log(vv.toBool(new Date()))		//undefined
console.log(vv.toBool('true'))			//true
console.log(vv.toBool('1'))				//true
console.log(vv.toBool(1))				//true
console.log(vv.toBool('false'))			//false
console.log(vv.toBool('0'))				//false
console.log(vv.toBool(0))				//false
console.log(vv.toBool('yes'))			//true
console.log(vv.toBool('no'))			//false
```
### toDate
convert variable to date value
```typescript
const DDD = new Date(1977, 10, 16, 14, 30, 42, 555)
console.log(vv.toDate('aa'))			//undefined
console.log(vv.toDate(1))				//undefined
console.log(vv.toDate(true))			//undefined
console.log(vv.dateFormat(vv.toDate(DDD), '126'))						//'1977-11-16T14:30:42.555'
console.log(vv.dateFormat(vv.toDate('1977-11-16T14:30:42.555'), '126'))	//'1977-11-16T14:30:42.555'
console.log(vv.dateFormat(vv.toDate('1977.11.16'), '126'))				//'1977-11-16T00:00:00.000'
console.log(vv.dateFormat(vv.toDate('1977-11-16'), '126'))				//'1977-11-16T00:00:00.000'
```
### toArray
convert variable to array
```typescript
console.log(vv.toArray('aa'))		//undefined
console.log(vv.toArray(100.34))		//undefined
console.log(vv.toArray([]))			//[]
console.log(vv.toArray([1,2]))		//[1,2]
```
### equal
compare two variables
```typescript
const DDD1 = new Date(1977, 10, 16, 14, 30, 42, 555)
const DDD2 = new Date(1977, 10, 16, 14, 30, 42, 555)
console.log(vv.equal(' AA ', 'aa'))					//true
console.log(vv.equal(DDD1,DDD2))					//true
console.log(vv.equal(DDD1,new Date()))				//false
console.log(vv.equal(undefined, undefined))			//true
console.log(vv.equal(4, undefined))					//false
console.log(vv.equal('a', 'b'))						//false
console.log(vv.equal(10,10))						//true
console.log(vv.equal(undefined, null))				//true
console.log(vv.equal(undefined, NaN))				//true
console.log(vv.equal(null, NaN))					//true
console.log(vv.equal(undefined, ''))				//true
console.log(vv.equal('', null))						//true
```
### prop
return property from object
```typescript
const OBJ = {
    aaa: 5,
    bbb: '1',
    arr: [1, 2, 3]
}
console.log(vv.prop(OBJ, 'AAA'))		//5
console.log(vv.prop(OBJ, 'bbb'))		//'1'
console.log(vv.prop(OBJ, 'Arr'))		//[1,2,3]
console.log(vv.prop(OBJ, 'yyy'))		//undefined
```
### guid
very simple gererator non-uniq guid
```typescript
console.log(vv.guid())					//388CEC00-34C3-45F0-8542-C61187BA2B6B
console.log(vv.guid())					//C38FDE41-1086-4B30-CBB1-DC5CDF18E1D6
```
### PackajeJsonParse
return package.json as object
```typescript
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
console.log(pp.name)						//'vv-common'
console.log(pp.version)						//'0.0.5'
console.log(pp.devDependencies.length)		//9
```