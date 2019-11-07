/**
 * Class for **Seoaflake**
 */
class Seoaflake {
  /**
   * @param {number} id The number of id.
   */
  constructor (id) {
    if (id) {
      this.id = id
      this.createdDate = parseInt(id.toString(2).slice(0, -17), 2)
      this.rand = parseInt(id.toString(2).slice(-17), 2)
    } else {
      this.createdDate = new Date().getTime()
      let temp = ''
      for (let i = 0; i < 17; i++) temp += `${Math.round(Math.random())}`
      this.id = parseInt(this.createdDate.toString(2) + temp, 2)
      this.rand = parseInt(temp, 2)
    }
  }

  toString () {
    return this.id
  }
}

module.exports = Seoaflake
