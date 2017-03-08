import id3 from 'id3-reader'
import path from 'path'
import walk from 'walk'

import { SocketRequest } from '../types'

import db from '../db'

export default async (req: SocketRequest) => (
    db.allDocs(req.data || {})
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
