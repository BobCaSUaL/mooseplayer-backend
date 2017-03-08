import fs from 'fs'
import path from 'path'
import PouchDB from 'pouchdb'


// TODO get correct AppDir!
const homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const appPath = path.join(homePath, '.mooseplayer')

if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath)
}
export default new PouchDB(path.resolve(appPath, 'library.ldb'))
