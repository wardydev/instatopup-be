const crypto = require('crypto')

// Fungsi untuk generate secret key
const generateSecretKey = () => {
  // Menggunakan crypto untuk menghasilkan key acak sepanjang 32 byte
  const secretKey = crypto.randomBytes(32).toString('hex')
  return secretKey
}

// Generate secret key
const secretKey = generateSecretKey()
console.log('Generated Secret Key:', secretKey)
