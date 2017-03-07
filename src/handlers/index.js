export default {
    play: require('./play').default,
    pause: require('./pause').default,
    loopback: require('./loopback').default,
    disconnect: require('./disconnect').default,
    ready: (req: SocketRequest) => req.emit('done', { works: true })
}
