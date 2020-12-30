import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

export enum MessageLevel {
  Error,
  Warning,
  Info,
  Success
}

export interface Message {
  level?: MessageLevel
  message: string
  date?: number
}

@Module({
  namespaced: true
})
export default class MessageModule extends VuexModule {
  messages: Message[] = []

  get allMessages () {
    return this.messages
  }

  get filteredMessages () {
    return (visibleLevels: [MessageLevel]) => { this.messages.find(message => message.level && message.level in visibleLevels) }
  }

  @Mutation
  add (message: Message) {
    if (!message.date) {
      message.date = new Date().getTime() / 1000
    }

    if (!message.level) {
      message.level = MessageLevel.Info
    }

    this.messages.push(message)
  }

  @Action
  addMessage (message: Message) {
    this.context.commit('add', message)
  }
}
