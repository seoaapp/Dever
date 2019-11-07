/**
 * Represents a User.
 */
class User {
  /**
   * @param {Seoaflake} id id of the user
   * @param {string} username username of the user
   */
  constructor (id, username) {
    this.id = id
    this.username = username
  }
}

module.exports = User
