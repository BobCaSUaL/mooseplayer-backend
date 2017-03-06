import PouchDB from 'pouchdb'
import path from 'path'


// TODO get correct AppDir!
const homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
const libraryDb = new PouchDB(
    path.join(homePath, '.mooseca-dev', 'library.ldb')
)
export default libraryDb
