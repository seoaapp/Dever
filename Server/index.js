const WS = require('ws')
const types = require('./types')
const responseTypes = types.response
const requestTypes = types.request
const errorTypes = types.error
const events = require('./events')
const settings = require('./settings.js')

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
  client.user = new User()
  client.on('message', (res) => {
    try {
      const data = JSON.parse(res)
      if (!checkObjKeys(data, ['type', 'data'])) {
        client.send(
          JSON.stringify({
            type: responseTypes.ERROR,
            data: {
              error: errorTypes.JSON,
              message: "There's no any needed args."
            }
          })
        )
        return
      }

      if (data.type === requestTypes.SEND_MESSAGE) {
        events.sendMessage(ws, data.data, client)
      } else if (data.type === requestTypes.CHANGE_STATUS) {
        events.setStatus(ws, data.data, client)
      } else {
        JSON.stringify({
          type: responseTypes.ERROR,
          data: {
            error: errorTypes.EVENT,
            message: 'You called undefined requestType Code.'
          }
        })
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
      }
    }
  })

  client.on('disconnection', () => {
    // Something'
  })
})

// 임시적으로 여기에 둠
class Seoaflake {
  constructor () {
    this.createData = new Date().getTime()
    let temp = `${Math.floor(Math.random() * 89999 + 10000).toString(2)}`
    for (let i = 0; i < 17 - temp.toString(2).length; i++) temp = `0${temp}`
    this.id = parseInt(this.createData.toString(2) + temp, 2)
    this.rand = parseInt(temp, 2)
  }
}

class User {
  constructor (id, nick) {
    this.id = id || new Seoaflake()
    this.username = nick || `guest_${this.id.rand}`
  }
}
