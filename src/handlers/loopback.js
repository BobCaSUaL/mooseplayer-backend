import { SocketRequest } from '../types'

export default (req: SocketRequest) => req.emit('loopback', req.data)
