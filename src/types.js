export type SocketRequest = {
    emit: (eventName: string, data: any) => void,
    data: any
}
