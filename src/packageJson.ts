import { toString, prop, isEmpty } from './index'

export type TPackajeJsonDependency = {
    package: string,
    version: string
}

export type TPackajeJsonScript = {
    name: string,
    cmd: string
}

export type TPackajeJson = {
    name: string,
    version: string,
    description: string,
    main: string,
    bin: string,
    scripts: TPackajeJsonScript[],
    author: string,
    license: string,
    homepage: string,
    devDependencies: TPackajeJsonDependency[],
    dependencies: TPackajeJsonDependency[]
}

export function PackajeJsonParse(text: string) : TPackajeJson {
    const res: TPackajeJson = {
        name: '',
        version: '',
        description: '',
        main: '',
        bin: '',
        scripts: [],
        author: '',
        license: '',
        homepage: '',
        devDependencies: [],
        dependencies: []
    }
    try {
        const json = JSON.parse(text)
        res.name = Str(json, 'name')
        res.version = Str(json, 'version')
        res.description = Str(json, 'description')
        res.main = Str(json, 'main')
        res.bin = Str(json, 'bin')
        res.scripts = Scr(prop(json, 'scripts'))
        res.author = Str(json, 'author')
        res.license = Str(json, 'license')
        res.homepage = Str(json, 'homepage')
        res.devDependencies = Dep(prop(json, 'devDependencies'))
        res.dependencies = Dep(prop(json, 'dependencies'))
    // eslint-disable-next-line no-empty
    } catch (error) {
    }
    return res
}

function Str (json: any, param: string) : string {
    const s = toString(prop(json, param))
    return isEmpty(s) ? '' : s
}

function Scr (obj: any): TPackajeJsonScript[] {
    if (!obj && typeof obj !== 'object') return []
    const res = [] as TPackajeJsonScript[]
    for (const prop in obj) {
        const cmd = toString(obj[prop])
        if (isEmpty(cmd)) continue
        res.push({name: prop, cmd: cmd})
    }
    return res
}

function Dep (obj: any): TPackajeJsonDependency[] {
    if (!obj && typeof obj !== 'object') return []
    const res = [] as TPackajeJsonDependency[]
    for (const prop in obj) {
        let ver = toString(obj[prop])
        if (isEmpty(ver)) continue
        if (ver.substring(0, 1) === '^') {
            ver = ver.substring(1, ver.length)
        }
        res.push({package: prop, version: ver})
    }
    return res
}