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
let hash = require('hash.js')


// eslint-disable-next-line
const ws = new WebSocket(`ws://${Setting.ws.host}:${Setting.ws.port}`)

const App = () => {
  const [connected, setConnected] = React.useState(false)
  const [logined, setLogined] = React.useState(false)
  const [messages, setMessages] = React.useState([])
  const [message, setMessage] = React.useState('')
  //TODO: Move under states to variables (like 'let')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data)
    if (data.type === responseTypes.SEND_MESSAGE) {
      setMessages([data.data, ...messages])
    } else if(data.type === responseTypes.LOGINED) {
      setLogined(true)
    }
  }

  //let password = ''

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
	  {logined ? (
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
          ) : (
	    <Segment raised>
	      <Form
	      onSubmit={() => {
                ws.send(
		  JSON.stringify(
		    {
		      type: requestTypes.CONNECT,
		      data: {
			username: username.value,
			password: hash.sha256().update(password.value).digest('hex')
		      }
		    }
		  )
		)
	      }}>
		<Input
		  fluid
		  placeholder="Username"
		  onChange={(_, data) => setUsername(data)}
		  />
		<Input
		  fluid
		  placeholder="Password"
		  type="password"
		  onChange={(_, data) => setPassword(data)}
		/>
		<Button action="submit">Log in</Button>
	      </Form>
	    </Segment>
	  )}
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
