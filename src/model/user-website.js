const dbPool = require('../config/db.js')

const getWebsiteByDomainQuery = (domain) => {
  const SQLQuery = 'SELECT domain FROM `user_website` WHERE domain = ?'
  return dbPool.execute(SQLQuery, [domain])
}

module.exports = {
  getWebsiteByDomainQuery,
}
