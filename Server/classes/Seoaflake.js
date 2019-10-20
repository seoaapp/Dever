// 임시적으로 여기에 둠
/**
 * Class for **Seoaflake**
 */
class Seoaflake {
  constructor () {
    this.createData = new Date().getTime()
    let temp = `${Math.floor(Math.random() * 89999 + 10000).toString(2)}`
    for (let i = 0; i < 17 - temp.toString(2).length; i++) temp = `0${temp}`
    this.id = parseInt(this.createData.toString(2) + temp, 2)
    this.rand = parseInt(temp, 2)
  }
}

module.exports = Seoaflake
