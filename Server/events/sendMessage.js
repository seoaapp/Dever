const responseTypes = require('../types/responseTypes')

module.exports = (ws, data, client) => {
  ws.clients.forEach((otherClient) => {
    otherClient.send(
      JSON.stringify({
        type: responseTypes.SEND_MESSAGE,
        data: {
          message: {
            message: data.message
          },
          user: {
            username: 'Test'
          }
        }
      })
    )
  })
}
