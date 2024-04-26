/**
 * Used to maintain chat history across all pages
 */
export default class Chat {
  constructor () {
    this.chat_history = [
      {
        role: 'assistant',
        message: 'Hi! Please feel free to ask any questions. Some responses may take around 8 seconds or longer to load.'
      }
    ]
  }

  addMessage (message) {
    this.chat_history.push(message)
  }

  getChatHistory () {
    return this.chat_history
  }
}
