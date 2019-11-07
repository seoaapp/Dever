const responseTypes = require('../types/responseTypes')
const errorTypes = require('../types/errorTypes')
const db = require('../test_db.json')
const classes = require('../classes')

const checkObjKeys = (obj, keys) => {
  const objKeys = Object.keys(obj)
  for (const key of keys) {
    if (!objKeys.includes(key)) {
      return false
    }
  }
  return true
}

module.exports = (ws, data, client) => {
  if (!checkObjKeys(data, ['id', 'username', 'password'])) {
    client.send(
      JSON.stringify({
        type: responseTypes.ERROR,
        data: {
          error: errorTypes.JSON,
          message: "There's no any needed args."
        }
      })
    )
    client.close()
    return
  }

  const user = db.users[data.id.toString()]
  if (data.username !== user.username || data.password !== user.password) {
    client.send(
      JSON.stringify({
        type: responseTypes.ERROR,
        data: {
          error: errorTypes.INCORRECT,
          message: "Username or password doesn't match."
        }
      })
    )
    client.close()
    return
  }

  delete user.password
  client.send(
    JSON.stringify({
      type: responseTypes.LOGINED,
      data: user
    })
  )
  client.user = new classes.User(new classes.Seoaflake(user.id), user.username)
}
