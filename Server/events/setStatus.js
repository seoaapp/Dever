const responseTypes = require('../types/responseTypes')

module.exports = (ws, data, client) => {
  ws.clients.forEach((otherClient) => {
    otherClient.send(
      JSON.stringify({
        type: responseTypes.CHANGE_STATUS,
        data: {
          status: data.status,
          target: client.id // nothing assignmented
        }
      })
    )
  })
}
