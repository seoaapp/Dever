const WS = require('ws')
const types = require('./types')
const responseTypes = types.response
const requestTypes = types.request
const errorTypes = types.error

const events = require('./events')
const settings = require('./settings')
const ws = new WS.Server(settings.ws)

const checkObjKeys = (obj, keys) => {
  const objKeys = Object.keys(obj)
  for (const key of keys) {
    if (!objKeys.includes(key)) {
      return false
    }
  }
  return true
}

ws.on('connection', (client) => {
  console.log('client connected')

  client.on('message', (res) => {
    try {
      const data = JSON.parse(res)

      // Check needed args: type, data
      if (!checkObjKeys(data, ['type', 'data'])) {
        client.send(
          JSON.stringify({
            type: responseTypes.ERROR,
            data: {
              error: errorTypes.JSON,
              message: "There's no any needed args.\n\tat [main]"
            }
          })
        )
        console.log('[Client] Error: There\'s no any needed args.\n\tat [main]')
        // console.log(res)
        client.close()
        return
      }

      // Check if requestType is vaild
      if (!Object.values(requestTypes).includes(data.type)) {
        JSON.stringify({
          type: responseTypes.ERROR,
          data: {
            error: errorTypes.EVENT,
            message: 'You called undefined requestType Code.'
          }
        })
        console.log('[Client] Error: You called undefined requestType Code.')
        client.close()
        return
      }

      // 'connection' or 'send_msg' or 'change_status'
      if (data.type === requestTypes.CONNECT) {
        console.log('[Client] requestTypes.CONNECT')
        events.connect(
          ws,
          data.data,
          client
        )
      } else if (data.type === requestTypes.SEND_MESSAGE) {
        console.log('[Client] requestTypes.SEND_MESSAGE')
        events.sendMessage(ws, data.data, client)
      } else if (data.type === requestTypes.CHANGE_STATUS) {
        console.log('[Client] requestTypes.CHANGE_STATUS')
        events.setStatus(ws, data.data, client)
      }
    } catch (err) {
      if (err) {
        client.send(
          JSON.stringify({
            type: responseTypes.ERROR,
            data: {
              error: errorTypes.JSON,
              message: 'An unexpected error happened during parsing JSON.'
            }
          })
        )
        console.error('[Server] ERROR: An unexpected error happened during parsing JSON.\nreceived data: ' + res + '\nStacktrace: ' + console.trace(err))
      }
    }
  })

  client.on('disconnection', () => {
    // Something'
    console.log('client disconnected')
  })
})
