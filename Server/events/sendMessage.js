const responseTypes = require('../types/responseTypes')
const errorTypes = require('../types/errorTypes')
const db = require('../test_db.json')

module.exports = (ws, data, client) => {
  if (
    typeof client.id === 'undefined' ||
    typeof db.users[client.id.toString()] === 'undefined'
  ) {
    client.send(
      JSON.stringify({
        type: responseTypes.ERROR,
        data: {
          error: errorTypes.JSON,
          message: "There's no any needed args."
        }
      })
    )
    console.log('[Client] Error: There\'s no any needed args.\n\tat [sendMessage]')
    client.close()
    return
  }

  ws.clients.forEach((otherClient) => {
    otherClient.send(
      JSON.stringify({
        type: responseTypes.SEND_MESSAGE,
        data: {
          message: {
            message: data.message
          },
          user: client.user
        }
      })
    )
  })
}
