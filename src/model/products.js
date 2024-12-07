const dbPool = require('../config/db.js')

const getProductsQuery = (q) => {
  if (q) {
    const SQLQuery = `SELECT id, brand_key, name, image_url, category, is_fire, forms FROM product WHERE name LIKE "%${q}%" ORDER BY is_fire DESC`
    return dbPool.execute(SQLQuery)
  } else {
    const SQLQuery =
      'SELECT id, brand_key, name, image_url, category, is_fire, forms FROM product ORDER BY is_fire DESC'
    return dbPool.execute(SQLQuery)
  }
}
const getProductsLandingQuery = () => {
  const SQLQuery =
    'SELECT id, brand_key, name FROM product ORDER BY is_fire DESC'
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

const userProductQuery = (userId) => {
  const SQLQuery = 'SELECT * FROM user_product_price WHERE userId = ?'
  return dbPool.execute(SQLQuery, [userId])
}

const createProductPriceQuery = ({
  userId,
  key,
  variationName,
  brandName,
  price,
  brandKey,
}) => {
  const SQLQuery =
    'INSERT INTO `user_product_price` (userId, product_item_key, brand_key, variation_name, brand_name, price) VALUES (?, ?,?,?,?,?)'
  return dbPool.execute(SQLQuery, [
    userId,
    key,
    brandKey,
    variationName,
    brandName,
    price,
  ])
}

const updateUserProductQuery = ({ price, userId, productId }) => {
  const SQLQuery =
    'UPDATE `user_product_price` SET price = ? WHERE userId = ? AND id = ?'
  return dbPool.execute(SQLQuery, [price, userId, productId])
}

const deleteUserProductPriceQuery = ({ userId, productId }) => {
  const SQLQuery =
    'DELETE FROM `user_product_price` WHERE id = ? AND userId = ?'
  return dbPool.execute(SQLQuery, [userId, productId])
}

module.exports = {
  getProductsQuery,
  getProductByBrandKeyQuery,
  getProfitQuery,
  userProductQuery,
  createProductPriceQuery,
  updateUserProductQuery,
  deleteUserProductPriceQuery,
  getProductsLandingQuery,
}
