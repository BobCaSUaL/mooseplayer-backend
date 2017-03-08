import _ from 'lodash'
import readline from 'readline'

import { SocketRequest } from './types'

import db from './db'
import handlers from './handlers'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const emitEvent = async (answer) => {
    const [command, ...commandData] = _.split(answer, ' ')
    if (_.has(handlers, command)) {
        await new Promise((res, rej) => (
            handlers[command]({
                emit: (eventName: string, data: any) => (
                    process.stdout.write(`('${eventName}', ${JSON.stringify(data)})\n`),
                    res([eventName, data])
                ),
                data: commandData.length > 0 ? (
                    JSON.parse(commandData.join(' '))
                ) : undefined
            })
        ))
    } else
    if (command === '') {
        process.stdout.write('')
    } else
    if (command === 'help') {
        process.stdout.write(`${_.map(handlers, (v, k) => k).join(', ')}\n`)
    } else {
        process.stdout.write('Command not recognised, type "help" for a list of avaiable command\n')
    }
}

const waitCommand = () => rl.question('> ', (answer) => {
    emitEvent(answer)
    .then(waitCommand)
})
waitCommand()
