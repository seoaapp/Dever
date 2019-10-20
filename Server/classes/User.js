const Seoa = require('../events/index')

/**
 * Represents a User.
 */
class User {
  /**
   * @param {Seoaflake} id id of the user
   * @param {string} nick username of the user
   */
  constructor (id, nick) {
    this.id = id || new Seoa.Seoaflake()
    this.username = nick || `guest_${this.id.rand}`
  }
}

module.exports = User
