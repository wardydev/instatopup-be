const dbPool = require('../config/db.js')

const getIpWhitelistUserQuery = ({ userId, ipAddress }) => {
  const SQLQuery =
    'SELECT ip_address FROM api_whitelist WHERE user_id = ? AND ip_address = ?'
  return dbPool.execute(SQLQuery, [userId, ipAddress])
}

module.exports = {
  getIpWhitelistUserQuery,
}
