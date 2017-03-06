import _ from 'lodash'
import argumentParser from 'node-argument-parser'
import pueblo from 'pueblo'
import socketIO from 'socket.io'
import db from './db'

pueblo.createCategory('logger')
const { info, verbose, debug } = pueblo.get('logger')
const argv = argumentParser.parse('./arguments.json', process)

db.info().then(res => info('Database info', res))

if (argv.interactive) {
    console.log('//TODO interactive')
}

type SocketRequest = {
    emit: (eventName: string, data: any) => void,
    data: any
}

const routes = {
    play: require('./handlers/play'),
    pause: require('./handlers/pause'),
    disconnect: require('./handlers/disconnect'),
    ready: (req: SocketRequest) => req.emit('done', { works: true })
}

const io = socketIO()
io.on('connection', socket => (
    _.forEach(routes, (handler, key) => (
        socket.on(key, (data) => {
            const request: SocketRequest = Object.assign({}, socket, data)
            handler(request)
        }
    )))
))

io.listen(9876)
