export default {
    disconnect: require('./disconnect').default,
    loopback: require('./loopback').default,
    pause: require('./pause').default,
    play: require('./play').default,
    scan: require('./scan').default,
    ready: (req: SocketRequest) => req.emit('done', { works: true })
}
