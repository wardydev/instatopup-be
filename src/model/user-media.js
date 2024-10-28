const dbPool = require('../config/db.js')

const getWebsiteIdQuery = (userId) => {
  const SQLQuery = 'SELECT id FROM `user_website` WHERE user_id = ?'
  return dbPool.execute(SQLQuery, [userId])
}
const createLogoQuery = ({ userId, userWebsiteId, imageUrl }) => {
  const SQLQuery =
    'INSERT INTO `user_media` (userId, userWebsiteId, image_url, type) VALUES (?,?,?,?)'
  return dbPool.execute(SQLQuery, [userId, userWebsiteId, imageUrl, 'logo'])
}
const deleteMediaByIdQuery = ({ userMediaId, userId }) => {
  const SQLQuery = 'DELETE FROM `user_media` WHERE id = ? AND userId = ?'
  return dbPool.execute(SQLQuery, [userMediaId, userId])
}

const createSliderQuery = ({ userId, userWebsiteId, imageUrl }) => {
  const SQLQuery =
    'INSERT INTO `user_media` (userId, userWebsiteId, image_url, type) VALUES (?,?,?,?)'
  return dbPool.execute(SQLQuery, [userId, userWebsiteId, imageUrl, 'banner'])
}

module.exports = {
  createLogoQuery,
  deleteMediaByIdQuery,
  createSliderQuery,
  getWebsiteIdQuery,
}
