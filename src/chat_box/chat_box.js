// Chatbox.js
import React, { useState, useRef, useEffect } from 'react'
import './chat_box.css'
// import axios from 'axios'
import ReactMarkdown from 'react-markdown'
const OpenAI = require('openai')
function Chatbox ({ data, selectedState, selectedCounty }) {
  const [isOpen, setIsOpen] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      message: 'Please be aware that as we make improvements to our application, ' +
      'long responses may take approximately 20 seconds or longer to load. ' +
      'If loading exceeds 60 seconds, you may experience a timeout response. ' +
      'We apologize for any inconvenience caused and appreciate your patience. ' +
      'Thank you for understanding.'
    }
  ])
  const [threadID, setThreadId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const chatBodyRef = useRef(null)
  const toggleChatbox = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    // Scroll down to the bottom when messages change
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }, [messages])

  async function getMessage (threadID) {
    const openai = new OpenAI({ apiKey: process.env.REACT_APP_KEY, dangerouslyAllowBrowser: true })
    const assistant = await openai.beta.assistants.retrieve(
      'asst_TstxGaQ2JzEwoy0wKY6tPEGY'
    )
    let createMessage = { role: 'System Status', message: 'Creating user message to send to the server' }
    setMessages(prevMessages => [...prevMessages, createMessage])
    await openai.beta.threads.messages.create(
      threadID,
      {
        role: 'user',
        content: userInput +
      `\n****Provided pollution data: ${(data !== undefined && data !== null)
        ? JSON.stringify(data)
        : 'No data available. You are to tell the user there is no data available at the selected location.'}` +
        `\nUser's selected state is ${selectedState.length > 0 ? selectedState : 'none'} ` +
        `and the selected county is ${selectedCounty.length > 0 ? selectedCounty : 'none'}****`
      }
    )
    createMessage = { role: 'System Status', message: 'User message created. Beginning to generate response.' }
    setMessages(prevMessages => [...prevMessages, createMessage])
    const run = await openai.beta.threads.runs.create(
      threadID,
      { assistant_id: assistant.id }
    )
    const timeoutDuration = 60000 // 60 seconds in milliseconds
    const startTime = Date.now()

    while (true) {
      try {
        const getRun = await openai.beta.threads.runs.retrieve(threadID, run.id)

        if (getRun.status === 'completed') {
          break
        } else {
          createMessage = { role: 'System Status', message: `Current response status: ${getRun.status}. \nElapsed time: ${(Date.now() - startTime) / 1000} seconds` }
          setMessages((prevMessages) => [...prevMessages, createMessage])
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error.message)
        setThreadId(null)
        return { role: 'assistant', message: 'An unexpected server error occured. Please try again or use a different prompt.' }
      }
      await new Promise(resolve => setTimeout(resolve, 2500))
      const elapsedTime = Date.now() - startTime

      if (elapsedTime >= timeoutDuration) {
        console.error('Timeout reached. The operation took too long.')
        setThreadId(null)
        return { role: 'assistant', message: 'Your request has timed out and we kindly request you to try again or use an alternative prompt. As our application is still in development, there may be occasional slowness with our chat bot. Rest assured, we are actively working towards enhancing our response times as we continue to refine the application. Thank you for your understanding and patience.' }
      }
    }
    const getMessages = await openai.beta.threads.messages.list(
      threadID
    )
    const message = await openai.beta.threads.messages.retrieve(
      threadID,
      getMessages.data[0].id
    )
    const systemMessage = { role: 'assistant', message: message.content[0].text.value }
    return systemMessage
  }

  async function assistantMessage () {
    setIsLoading(true)
    const openai = new OpenAI({ apiKey: process.env.REACT_APP_KEY, dangerouslyAllowBrowser: true })
    let message = ''
    if (threadID === null) {
      let createMessage = { role: 'System Status', message: 'Creating a new conversation thread.' }
      setMessages(prevMessages => [...prevMessages, createMessage])
      const emptyThread = await openai.beta.threads.create()
      createMessage = { role: 'System Status', message: 'New conversation thread created.' }
      setMessages(prevMessages => [...prevMessages, createMessage])
      message = await getMessage(emptyThread.id)
      setThreadId(emptyThread.id)
    } else {
      message = await getMessage(threadID, userInput)
    }
    return message
  }

  async function handleKeyDown (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (isLoading || userInput.length === 0) {
        return
      }
      const userMessage = { role: 'user', message: userInput }
      setMessages([...messages, userMessage])
      setUserInput('')

      try {
        const response = await assistantMessage()
        setIsLoading(false)
        setMessages(prevMessages => [...(prevMessages.filter(message => message.role !== 'System Status')), response])
      } catch (error) {
        console.error('Error sending userInput to server:', error)
      }
    }
  }

  return (
    <>
      {isOpen
        ? (
          <div className="chat-box">
            <div className='chat-header'>
            <button className="close-btn" onClick={() => toggleChatbox()}>
              X
            </button>
            </div>
            <div className='chat-body' ref={chatBodyRef}>
                <div className='chat-messages'>
                {messages.map((message, index) => (
                  <div key={index} className="message">
                    <h2>
                      {message.role}
                      {' '}
                    </h2>
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                  </div>
                ))}
                </div>
                {isLoading && (
                  <div key="typing" className="message">
                    <h2>assistant</h2>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
            </div>
            <div className="userInput">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                autoFocus={false}
              />
            </div>
          </div>
          )
        : (
          <button className='chat-icon' onClick={() => toggleChatbox()}>
            <img src="chat.png" /> <h3>   Ask a question</h3>
          </button>
          )}
    </>
  )
}

export default Chatbox