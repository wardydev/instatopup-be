const dbPool = require('../config/db.js')

const getCategoryQuery = () => {
  const SQLQuery = 'SELECT * FROM `product_category`'
  return dbPool.execute(SQLQuery)
}

module.exports = {
  getCategoryQuery,
}
