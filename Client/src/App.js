import React from 'react'
import {
  Container,
  Header,
  Segment,
  Input,
  Form,
  Button,
  Divider
} from 'semantic-ui-react'
import Head from './components/header'
import MessageRow from './components/messageRow'
import responseTypes from './types/responseTypes'
import requestTypes from './types/requestTypes'
import Setting from './setting'
import 'semantic-ui-css/semantic.min.css'
import './App.css'

// eslint-disable-next-line
const ws = new WebSocket(`ws://${Setting.ws.host}:${Setting.ws.port}`)

const App = () => {
  const [connected, setConnected] = React.useState(false)
  const [messages, setMessages] = React.useState([])
  const [message, setMessage] = React.useState('')

  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data)
    if (data.type === responseTypes.SEND_MESSAGE) {
      setMessages([data.data, ...messages])
    }
  }

  ws.onopen = () => {
    setConnected(true)
  }

  ws.onclose = () => {
    setConnected(false)
  }

  return (
    <>
      <Head />
      <Divider hidden />
      {connected ? (
        <Container className='connected'>
          <div className='message'>
            <div className='messages'>
              {messages.map((msg) => (
                <MessageRow
                  message={msg.message.message}
                  username={msg.user.username}
                />
              ))}
            </div>
            <Segment className='message-field'>
              <Form
                onSubmit={() => {
                  ws.send(
                    JSON.stringify({
                      type: requestTypes.SEND_MESSAGE,
                      data: {
                        message
                      }
                    })
                  )

                  setMessage('')
                }}>
                <Input
                  fluid
                  value={message}
                  onChange={(_, data) => setMessage(data.value)}
                  action={<Button color='green'>Send</Button>}
                />
              </Form>
            </Segment>
            <Divider hidden />
          </div>
        </Container>
      ) : (
        <Container className='waiting'>
          <Header as='h1'>Connecting...</Header>
        </Container>
      )}
    </>
  )
}

export default App
