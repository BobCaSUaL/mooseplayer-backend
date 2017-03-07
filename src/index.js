import _ from 'lodash'
import argumentParser from 'node-argument-parser'
import path from 'path'
import pueblo from 'pueblo'
import socketIO from 'socket.io'

import { SocketRequest } from './types'

import db from './db'
import handlers from './handlers'

pueblo.createCategory('logger')
const { info, verbose, debug } = pueblo.get('logger')
const args = argumentParser.parse(
    path.resolve(__dirname, 'arguments.json'), process
)
if (args.help) exit()

db.info().then(res => info('Database info', res))


if (args.interactive) {
    info('enter in interactive mode')
    require('./shell')
}

const io = socketIO()
io.on('connection', socket => (
    _.forEach(handlers, (handler, key) => (
        socket.on(key, (data) => {
            const request: SocketRequest = Object.assign({}, socket, data)
            handler(request)
        }
    )))
))

io.listen(9876)
