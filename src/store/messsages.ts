import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

export enum MessageLevel {
    Error,
    Warning,
    Info,
    Success
}

interface Message {
    level: MessageLevel
    message: string
}

@Module
export default class MessageModule extends VuexModule {
    messages: Message[] = []

    get allMessages () {
        return this.messages
    }

    get filteredMessages () {
        return (visibleLevels: [MessageLevel]) => { this.messages.find(message => message.level in visibleLevels) }
    }

    @Mutation
    add (message: Message) {
        this.messages.push(message)
    }

    @Action
    async addMessage (level: MessageLevel, message: string) {
        this.context.commit('add', { level, message })
    }
}
