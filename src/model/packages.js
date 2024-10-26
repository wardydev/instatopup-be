const dbPool = require('../config/db.js')

const getPackagesQuery = () => {
  const SQLQuery =
    'SELECT id, name, description, price, features FROM `packages`'
  return dbPool.execute(SQLQuery)
}

module.exports = { getPackagesQuery }
