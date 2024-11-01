const dbPool = require('../config/db.js')

const getProductsQuery = () => {
  const SQLQuery =
    'SELECT id, brand_key, name, image_url, category, forms FROM product'
  return dbPool.execute(SQLQuery)
}

const getProductByBrandKeyQuery = (brandKey) => {
  const SQLQuery = 'SELECT * FROM `product` WHERE brand_key = ?'
  return dbPool.execute(SQLQuery, [brandKey])
}

const getProfitQuery = () => {
  const SQLQuery = 'SELECT profit FROM profit'
  return dbPool.execute(SQLQuery)
}

module.exports = {
  getProductsQuery,
  getProductByBrandKeyQuery,
  getProfitQuery,
}
