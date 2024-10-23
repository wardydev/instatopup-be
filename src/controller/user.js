const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {
  errorResponse,
  successResponse,
  httpCreateMessage,
} = require('../helper/http.js')
const {
  getUserByEmailQuery,
  resetOtpQuery,
  saveOtpQuery,
  getUserByPhoneQuery,
  getOtpByPhoneNumberQuery,
  deleteOtpByPhoneNumberQuery,
  getUserInfoQuery,
  updatePasswordQuery,
} = require('../model/user.js')
const {
  generateOtp,
  isPhoneNumberFormatValid,
  userAuthorization,
} = require('../helper/functions.js')
const { getOtpByPhoneQuery } = require('../model/otp.js')

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email)
      return errorResponse({
        res,
        message: 'Kolom email wajib diisi',
        statusCode: 400,
      })

    if (!password)
      return errorResponse({
        res,
        message: 'Kolom password wajib diisi',
        statusCode: 400,
      })

    const [userSelected] = await getUserByEmailQuery(email)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message:
          'Email atau password salah, Pastikan Kamu sudah buat akun sebelumnya',
        statusCode: 400,
      })

    const userRecord = userSelected[0]

    if (!isPhoneNumberFormatValid(userRecord.phone_number))
      return errorResponse({
        res,
        message:
          'Format nomor HP Kamu salah, Pastikan nomor HP dimulai dari 62xxxxxxxxxxx',
        statusCode: 400,
      })

    await resetOtpQuery({
      email: userRecord.email,
      phoneNumber: userRecord.phone_number,
    })

    const isPasswordValid = await bcrypt.compare(password, userRecord.password)

    if (!isPasswordValid)
      return errorResponse({
        res,
        message:
          'Password Kamu salah, Silahkan coba lagi dengan password yang benar',
        statusCode: 400,
      })

    const otp = generateOtp()
    const expirationTime = new Date(Date.now() + 5 * 60000)

    await saveOtpQuery(
      userRecord.email,
      userRecord.phone_number,
      otp,
      expirationTime
    )

    const message = `*Reseller Tokoflix*\n\nKode OTP Anda adalah: *${otp}*\n\nSilakan gunakan kode ini untuk menyelesaikan proses verifikasi akun. \n\nJika Anda tidak meminta kode ini, abaikan pesan ini dan jangan berikan kode ini kepada siapapun.`
    await httpCreateMessage({
      message: message,
      phone: userRecord.phone_number,
    })

    successResponse({
      res,
      message: 'OTP telah dikirim ke nomor WhatsApp Anda.',
      statusCode: 200,
      data: {
        phoneNumber: userRecord.phone_number,
      },
    })
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body

    if (!phoneNumber)
      return errorResponse({
        res,
        message: 'Nomor HP Tidak ditemukan',
        statusCode: 400,
      })

    if (!otp)
      return errorResponse({
        res,
        message: 'Kolom OTP wajib diisi',
        statusCode: 400,
      })

    if (typeof otp !== 'string')
      return errorResponse({
        res,
        message: 'OTP Harus berupa string',
        statusCode: 400,
      })

    const [userSelected] = await getUserByPhoneQuery(phoneNumber)
    const userRecord = userSelected[0]

    const [latestOtp] = await getOtpByPhoneNumberQuery(phoneNumber)

    if (latestOtp.length === 0)
      return errorResponse({
        res,
        message: 'OTP tidak ditemukan atau sudah kadaluarsa.',
        statusCode: 400,
      })

    if (latestOtp[0].otp !== otp)
      return errorResponse({
        res,
        message: 'OTP tidak valid, Pastikan Kamu input kode OTP yang benar.',
        statusCode: 400,
      })

    await deleteOtpByPhoneNumberQuery(phoneNumber)

    const payload = {
      id: userRecord.id,
      phoneNumber: userRecord.phone_number,
      email: userRecord.email,
      fullName: userRecord.full_name,
      phoneNumber: userRecord.phone_number,
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '30d',
    })

    successResponse({
      res,
      message: 'Validasi OTP berhasil.',
      statusCode: 200,
      data: {
        token,
      },
    })
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const getUserInfo = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const [userSelected] = await getUserInfoQuery(userLogin.id)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message: 'User tidak ditemukan',
        statusCode: 404,
      })

    successResponse({
      res,
      message: 'Berhasil mengambil data user',
      statusCode: 200,
      data: userSelected[0],
    })
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const sendOTPResetPassword = async (req, res) => {
  try {
    const { phoneNumber } = req.body

    if (!phoneNumber)
      return errorResponse({
        res,
        message: 'Nomor HP wajib diisi',
        statusCode: 400,
      })

    if (!isPhoneNumberFormatValid(phoneNumber))
      return errorResponse({
        res,
        message:
          'Format nomor HP Kamu salah, Pastikan nomor HP dimulai dari 62xxxxxxxxxxx',
        statusCode: 400,
      })

    const [userSelected] = await getUserByPhoneQuery(phoneNumber)

    if (userSelected.length === 0)
      return errorResponse({
        res,
        message: 'User tidak ditemukan',
        statusCode: 400,
      })

    const otp = generateOtp()

    await httpCreateMessage({
      message: `*Tokoflix*\n\nKode OTP Anda untuk reset password adalah: *${otp}*\n\nGunakan kode ini untuk mengatur ulang kata sandi akun Anda. \n\nJika Anda tidak meminta reset password, abaikan pesan ini dan jangan berikan kode ini kepada siapapun.`,
      phone: phoneNumber,
    })

    const expirationTime = new Date(Date.now() + 5 * 60000)

    await saveOtpQuery(
      userSelected[0].email,
      userSelected[0].phone_number,
      otp,
      expirationTime
    )

    successResponse({
      res,
      statusCode: 200,
      message: 'Berhasil reset password!',
    })
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword, otp, phoneNumber } = req.body

    // OTP Harus berupa string

    if (!newPassword || !confirmNewPassword || !otp || !phoneNumber)
      return errorResponse({
        res,
        message: 'Semua kolom wajib diisi',
        statusCode: 400,
      })

    if (newPassword !== confirmNewPassword)
      return errorResponse({
        res,
        message: 'Password baru harus sama dengan nilai konfirmasi password!',
        statusCode: 400,
      })

    if (typeof otp !== 'string')
      return errorResponse({
        res,
        message: 'OTP Harus berupa string',
        statusCode: 400,
      })

    const [latestOtp] = await getOtpByPhoneQuery(phoneNumber)

    //

    if (latestOtp.length === 0)
      return errorResponse({
        res,
        message: 'OTP tidak ditemukan atau sudah kadaluarsa.',
        statusCode: 400,
      })

    if (latestOtp[0].otp !== otp)
      return errorResponse({
        res,
        message: 'OTP tidak valid.',
        statusCode: 400,
      })

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    // update password by phone number
    await updatePasswordQuery({
      password: hashedPassword,
      phoneNumber,
    })
    await deleteOtpByPhoneNumberQuery(phoneNumber)
    successResponse({
      res,
      statusCode: 200,
      message:
        'Berhasil reset password silahkan login dengan password baru Kamu.',
    })
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

module.exports = {
  loginUser,
  verifyOtp,
  getUserInfo,
  sendOTPResetPassword,
  resetPassword,
}
