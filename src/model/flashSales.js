const dbPool = require('../config/db.js')

const getFlashSalesQuery = (apikey) => {
  const SQLQuery =
    'SELECT id, price, discount_rate, item_key, variation_name, brand_name, product_code, start_time, end_time, status, created_at, image_url, forms FROM `flash_sale` WHERE user_id = ? AND status = ?'
  return dbPool.execute(SQLQuery, [apikey, 'active'])
}

const createNewFlashSalesQuery = ({
  discount,
  price,
  itemKey,
  variation,
  brandName,
  productCode,
  startTime,
  endTime,
  userId,
  imageUrl,
  forms,
}) => {
  const SQLQuery =
    'INSERT INTO `flash_sale` (discount_rate,price, item_key, variation_name, brand_name, product_code, start_time, end_time, status, user_id, image_url, forms) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
  return dbPool.execute(SQLQuery, [
    discount,
    price,
    itemKey,
    variation,
    brandName,
    productCode,
    startTime,
    endTime,
    'active',
    userId,
    imageUrl,
    forms,
  ])
}

const updateFlashSalesQuery = ({
  discount,
  itemKey,
  variation,
  brandName,
  productCode,
  startTime,
  endTime,
  userId,
  flashSaleId,
}) => {
  const SQLQuery =
    'UPDATE `flash_sale` SET discount_rate=?,item_key=?,variation_name=?,brand_name=?,product_code=?,start_time=?,end_time=?,user_id=? WHERE id = ?'
  return dbPool.execute(SQLQuery, [
    discount,
    itemKey,
    variation,
    brandName,
    productCode,
    startTime,
    endTime,
    userId,
    flashSaleId,
  ])
}

const updateStatusFlashSaleQuery = ({ flashSaleId, status, userId }) => {
  const SQLQuery =
    'UPDATE `flash_sale` SET status = ? WHERE id = ? AND user_id = ?'
  return dbPool.execute(SQLQuery, [status, flashSaleId, userId])
}

const deleteFlashSalesQuery = ({ flashSaleId, userId }) => {
  const SQLQuery = 'DELETE FROM `flash_sale` WHERE id =  ? AND user_id = ?'
  return dbPool.execute(SQLQuery, [flashSaleId, userId])
}

module.exports = {
  deleteFlashSalesQuery,
  createNewFlashSalesQuery,
  updateFlashSalesQuery,
  getFlashSalesQuery,
  updateStatusFlashSaleQuery,
}
