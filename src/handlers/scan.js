import id3 from 'id3-reader'
import path from 'path'
import walk from 'walk'

import { SocketRequest } from '../types'

import db from '../db'

const homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE

const insertInLibrary = filePath =>
    id3(filePath)
    .catch((err) => {
        console.error(err)
        return {}
    })
    .then(tags => db.put(
        Object.assign({}, tags, { _id: filePath, path: filePath })
    ))

const scan = (dir = homePath) => (
    new Promise((resolve, reject) => {
        const walker = walk.walk(dir, { followLinks: false })

        walker.on('file', (root, fileStat, next) => {
            const filePath = path.resolve(root, fileStat.name)
            if (path.extname(fileStat.name) === '.mp3') {
                process.stdin.write(`${filePath}\n`)
                insertInLibrary(filePath)
                    .then(() => next())
                    .catch(err => reject(err))
            } else {
                next()
            }
        })

        walker.on('errors', (root, nodeStatsArray, next) => {
            const errs = nodeStatsArray.map(n => (
                process.stderr.write(`[ERROR] ${n.name}\n`),
                process.stderr.write(`${n.error.message || (`${n.error.code}: ${n.error.path}`)}\n`),
                Object.assign(new Error(n.error.message), {
                    code: n.error.code,
                    path: n.error.path
                })
            ))
            reject(errs)
        })

        walker.on('end', () => resolve())
    })
)

export default async (req: SocketRequest) => (
    scan(req.data && req.data.dir)
    .then(res => req.emit('scan', {
        error: false,
        payload: res,
        pending: false
    }))
    .catch(err => req.emit('scan', {
        error: err,
        pending: false
    }))
)
