const crypto = require('crypto')

// key
const algorithm = 'aes-256-cbc'
const key = crypto.randomBytes(32) // Kunci enkripsi 32-byte
const ivLength = 16 // Panjang IV untuk AES (16 byte)

// fungsi enkripsi
function encryptObject(object) {
  const iv = crypto.randomBytes(ivLength) // Buat IV acak
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  const payload = JSON.stringify(object) // Konversi object menjadi string
  let encrypted = cipher.update(payload, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // Gabungkan IV dan hasil enkripsi dalam satu string (hex)
  return iv.toString('hex') + encrypted
}

// Fungsi untuk dekripsi
function decryptObject(encryptedString) {
  // Pisahkan IV dan encrypted data
  const iv = Buffer.from(encryptedString.slice(0, ivLength * 2), 'hex') // Ambil bagian IV (hex -> buffer)
  const encryptedData = encryptedString.slice(ivLength * 2) // Ambil bagian data yang terenkripsi

  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return JSON.parse(decrypted) // Parse kembali menjadi object
}

const payloadObject = {
  packageId: 1,
  packageName: 'Paket ENTREPRENEUR',
  price: 25000,
}
const encryptedPayload = encryptObject(payloadObject)
console.log('Encrypted (String):', encryptedPayload)

const decryptedPayload = decryptObject(encryptedPayload)
console.log('Decrypted:', decryptedPayload)
