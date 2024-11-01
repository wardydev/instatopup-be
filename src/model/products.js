const dbPool = require('../config/db.js')

const getProductsQuery = () => {
  const SQLQuery =
    'SELECT id, brand_key, name, image_url, category, forms FROM product'
  return dbPool.execute(SQLQuery)
}

module.exports = {
  getProductsQuery,
}
