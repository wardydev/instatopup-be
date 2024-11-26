const dbPool = require('../config/db.js')

const createUserProductQuery = ({
  userKey,
  brandKey,
  itemKey,
  name,
  brandName,
  price,
}) => {
  const SQLQuery =
    'INSERT INTO `user_product_price` (userId, brand_key, product_item_key, variation_name, brand_name, price) VALUES (?,?,?,?,?,?)'
  return dbPool.execute(SQLQuery, [
    userKey,
    brandKey,
    itemKey,
    name,
    brandName,
    price,
  ])
}

const updateUserProductQuery = ({ price, userKey, itemKey }) => {
  const SQLQuery =
    'UPDATE `user_product_price` SET price =? WHERE userId = ? AND product_item_key = ?'
  return dbPool.execute(SQLQuery, [price, userKey, itemKey])
}

const resetUserProductQuery = ({ userKey, itemKey }) => {
  const SQLQuery =
    'DELETE FROM `user_product_price` WHERE userId = ? AND product_item_key = ?'
  return dbPool.execute(SQLQuery, [userKey, itemKey])
}

const hideProductByUserQuery = ({ userKey, productId, brandKey }) => {
  const SQLQuery =
    'INSERT INTO `user_product` (productId, userId, brand_key) VALUES (?,?,?)'
  return dbPool.execute(SQLQuery, [productId, userKey, brandKey])
}

const showProductByUserQuery = ({ userKey, productId, brandKey }) => {
  const SQLQuery =
    'DELETE FROM `user_product` WHERE productId = ? AND userId = ? AND brand_key = ?'
  return dbPool.execute(SQLQuery, [productId, userKey, brandKey])
}

const getUserProductHideQuery = (userKey) => {
  const SQLQuery = 'SELECT * FROM `user_product` WHERE userId = ?'
  return dbPool.execute(SQLQuery, [userKey])
}

module.exports = {
  createUserProductQuery,
  updateUserProductQuery,
  resetUserProductQuery,
  showProductByUserQuery,
  hideProductByUserQuery,
  getUserProductHideQuery,
}
