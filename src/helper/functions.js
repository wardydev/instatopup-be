const jwt = require('jsonwebtoken')
const QRCode = require('qrcode')
const moment = require('moment')
const CryptoJS = require('crypto-js')
const crypto = require('crypto')

const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const userAuthorization = (authorization) => {
  const token = authorization.split(' ')[1]
  const tokenVerify = jwt.verify(token, process.env.SECRET_KEY)
  return tokenVerify
}

const generateHashWithTimestamp = (amount) => {
  const merchantOrderId = moment().format('x')

  const hashText =
    process.env.DUITKU_KODE_MERCHANT +
    merchantOrderId +
    String(amount) +
    process.env.DUITKU_APIKEY

  const hash = crypto.createHash('md5').update(hashText).digest('hex')

  return {
    merchantOrderId,
    signature: hash,
  }
}

const generateQRCode = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text)
    return qrCodeDataURL
  } catch (err) {
    console.error(err)
    throw new Error('Failed to generate QR code')
  }
}

function generateOrderId() {
  const prefix = 'TKFLX-'
  const randomPart = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, '0')
  return prefix + randomPart
}

function generateInvoiceId() {
  const prefix = 'INVC-'
  const randomPart = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, '0')
  return prefix + randomPart
}

const isPhoneNumberFormatValid = (phoneNumber) => {
  return phoneNumber.startsWith('62')
}

const generateSignatureCheckTranasction = (merchantOrderId) => {
  const hashText =
    process.env.DUITKU_KODE_MERCHANT +
    merchantOrderId +
    process.env.DUITKU_APIKEY
  const hash = crypto.createHash('md5').update(hashText).digest('hex')
  process.env.SIGNATURE = hash
  return hash
}

const generateApiKey = () => {
  const crypto = require('crypto')
  const apiKey = crypto.randomBytes(32).toString('hex')

  return apiKey
}

module.exports = {
  generateOtp,
  userAuthorization,
  generateHashWithTimestamp,
  generateQRCode,
  generateOrderId,
  generateInvoiceId,
  isPhoneNumberFormatValid,
  generateSignatureCheckTranasction,
  generateApiKey,
}
