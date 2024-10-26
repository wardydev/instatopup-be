const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

const {
  errorResponse,
  successResponse,
  httpCreateTransaction,
  httpCreateMessage,
  httpCheckTransaction,
} = require('../helper/http.js')
const {
  getWebsiteByDomainQuery,
  getTransactionByInvoiceQuery,
  updateStatusTrxQuery,
  updateStatusUserWebsiteQuery,
  getDomainByUserIdQuery,
  getPhoneByidQuery,
} = require('../model/user-website.js')
const {
  createUserQuery,
  createUserWebsiteQuery,
  createTransactionQuery,
  getUserByEmailQuery,
  getUserByPhoneQuery,
} = require('../model/user.js')
const {
  generateHashWithTimestamp,
  generateQRCode,
  generateInvoiceId,
  isPhoneNumberFormatValid,
  generateSignatureCheckTranasction,
  generateApiKey,
} = require('../helper/functions.js')
const { formatRupiah, formatDate } = require('../helper/formatted.js')

const checkIsDomainAvalaible = async (req, res) => {
  try {
    const { domain } = req.body

    if (!domain)
      return errorResponse({
        res,
        message: 'Masukan domain terlebih dahulu',
        statusCode: 400,
      })

    const [domainLists] = await getWebsiteByDomainQuery(domain)

    if (domainLists.length === 0)
      return successResponse({
        res,
        message: `Domain ${domain} tersedia! , Mulai sekarang untuk membangun website top-up game milikmu sendiri.`,
        statusCode: 200,
      })

    return errorResponse({
      res,
      message: `Domain ${domain} sudah digunakan, silahkan pilih domain yang lain dan buat topup gamemu segera`,
      statusCode: 400,
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

const createWebsite = async (req, res) => {
  try {
    const userId = uuidv4()
    // get body
    const {
      email,
      fullName,
      phoneNumber,
      password,
      packageId,
      domain,
      amount,
      packageName,
    } = req.body

    if (!isPhoneNumberFormatValid(phoneNumber))
      return errorResponse({
        res,
        message:
          'Format nomor HP Kamu salah, Pastikan nomor HP dimulai dari 62xxxxxxxxxxx',
        statusCode: 400,
      })

    if (!email || !fullName || !phoneNumber || !password)
      return errorResponse({
        res,
        message:
          'Pastikan semua kolom (email, nama lengkap, nomor telepon, dan kata sandi) terisi.',
        statusCode: 400,
      })

    if (!packageId || !amount || !packageName)
      return errorResponse({
        res,
        message:
          'Sepertinya Kamu belum memilih paket, Pilih paket terlebih dahulu.',
        statusCode: 400,
      })

    if (!domain)
      return errorResponse({
        res,
        message: 'Kolom domain wajib diisi',
        statusCode: 400,
      })

    // user
    const [userWithEmailSelected] = await getUserByEmailQuery(email)
    const [userWithPhoneSelected] = await getUserByPhoneQuery(phoneNumber)

    if (userWithEmailSelected.length !== 0)
      return errorResponse({
        res,
        message: 'Email sudah terdaftar, Gunakan email yang berbeda',
        statusCode: 400,
      })

    if (userWithPhoneSelected.length !== 0)
      return errorResponse({
        res,
        message: 'Nomor HP sudah digunakan, Gunakan Nomor HP yang berbeda',
        statusCode: 400,
      })

    const apiKey = generateApiKey()
    const hashedPassword = await bcrypt.hash(password, 10)
    await createUserQuery({
      email,
      fullName,
      phoneNumber,
      userId,
      password: hashedPassword,
      apiKey: apiKey,
    })

    // website
    await createUserWebsiteQuery({
      domain,
      packageId,
      userId,
    })

    // transaction
    const signatureKey = generateHashWithTimestamp(amount)

    const bodyTransactions = {
      merchantCode: process.env.DUITKU_KODE_MERCHANT,
      paymentAmount: Number(amount),
      paymentMethod: 'SP',
      merchantOrderId: signatureKey.merchantOrderId,
      productDetails: `Pembayaran pembuatan website topup dengan id ${userId}`,
      customerVaName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      itemDetails: [
        {
          name: packageName,
          price: Number(amount),
          quantity: 1,
        },
      ],
      customerDetail: {
        firstName: fullName,
        lastName: '',
        email: email,
        phoneNumber: phoneNumber,
      },
      callbackUrl: 'https://resellertokoflix.com',
      returnUrl: 'https://resellertokoflix.com',
      signature: signatureKey.signature,
      expiryPeriod: 15,
    }

    const responseTransaction = await httpCreateTransaction(bodyTransactions)
    const invoiceId = generateInvoiceId()

    if (responseTransaction.statusCode === '00') {
      const qrCodeDataURL = await generateQRCode(responseTransaction.qrString)
      await createTransactionQuery({
        amount,
        invoice: invoiceId,
        orderId: signatureKey.merchantOrderId,
        packageId,
        qrCode: qrCodeDataURL,
        userId,
      })

      // send notif payment wa api
      const message = `*Pemberitahuan Penyelesaian Pembayaran* 🛒✨

Halo *${fullName}* 👋,
Terima kasih telah membuat website top-up di platform kami! 🎉

Berikut detail toko Anda:
- *Nama*: ${fullName}
- *Domain*: ${domain}

Mohon segera menyelesaikan pembayaran untuk mengaktifkan layanan website Anda.
Link Pembayaran: https://localhost:5173/payment?invoice=${invoiceId} 💳\n

Terima kasih! 🙏
*Tim Tokoflix* 💙`

      await httpCreateMessage({ message: message, phone: phoneNumber })

      successResponse({
        res,
        message:
          'Berhasil membuat website, Silahkan selesaikan pembayaran Kamu',
        statusCode: 201,
        data: {
          qrCode: qrCodeDataURL,
          invoice: invoiceId,
        },
      })
    }
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const checkTransaction = async (req, res) => {
  try {
    const { invoice } = req.body

    if (!invoice)
      return errorResponse({
        res,
        message: 'Invoice tidak ditemukan',
        statusCode: 400,
      })

    const [transactionSelected] = await getTransactionByInvoiceQuery(invoice)
    const transactionRecord = transactionSelected[0]

    const [userSelected] = await getPhoneByidQuery(transactionRecord.user_id)
    const userRecord = userSelected[0]

    const signatureKey = generateSignatureCheckTranasction(
      transactionRecord.orderId
    )
    const checkResponse = await httpCheckTransaction({
      merchantCode: process.env.DUITKU_KODE_MERCHANT,
      merchantOrderId: transactionRecord.orderId,
      signature: signatureKey,
    })

    if (checkResponse.statusCode === '00') {
      await updateStatusTrxQuery({
        invoice,
        status: 'success',
      })
      await updateStatusUserWebsiteQuery({
        userId: transactionRecord.user_id,
        status: 'paid',
      })

      const [userDomain] = await getDomainByUserIdQuery(
        transactionRecord.user_id
      )

      const message = `✨ Terima kasih telah bergabung sebagai reseller di Tokoflix! ✨

🌐 Detail Website Anda:

Domain: ${userDomain[0].domain}
Status: paid
Total Harga: ${formatRupiah(Number(transactionRecord.amount))}
Tanggal Pembuatan:  ${formatDate(transactionRecord.created_at)}📅
Invoice: ${invoice}
Website Anda sedang dalam proses pembuatan dan akan selesai dalam waktu 1x24 jam. Silakan login ke panel kami untuk mengecek status website Anda.

💬 Jika ada pertanyaan, jangan ragu untuk menghubungi kami!

Terima kasih atas kepercayaan Anda kepada Tokoflix 💙 Selamat mengelola website Anda dan semoga sukses selalu! 😊`

      await httpCreateMessage({
        message: message,
        phone: userRecord.phone_number,
      })

      successResponse({
        res,
        message: 'Selamat, Pembayaranmu berhasil.',
        statusCode: 200,
        data: {
          status: 'success',
        },
      })
    } else if (checkResponse.statusCode === '02') {
      await updateStatusTrxQuery({
        invoice,
        status: 'cancel',
      })
      await updateStatusUserWebsiteQuery({
        userId: transactionRecord.user_id,
        status: 'cancel',
      })
      errorResponse({
        res,
        message: 'Pembayaran expired',
        statusCode: 400,
      })
    } else {
      successResponse({
        res,
        message: 'Silahkan Selesaikan pembayaranmu',
        statusCode: 200,
        data: {
          status: 'pending',
        },
      })
    }
  } catch (err) {
    console.log(err)
    errorResponse({
      res,
      message: 'Terjadi kesalahan di server',
      statusCode: 500,
    })
  }
}

const getTransaction = async (req, res) => {
  try {
    const { invoice } = req.query

    if (!invoice)
      return errorResponse({
        res,
        message: 'Invoice tidak ditemukan',
        statusCode: 400,
      })

    const [transactionSelected] = await getTransactionByInvoiceQuery(
      invoice.replace(/\?$/, '')
    )

    if (transactionSelected.length === 0)
      return errorResponse({
        res,
        message: 'Transaksi tidak ditemukan',
        statusCode: 400,
      })

    successResponse({
      res,
      message: 'Silahkan Selesaikan pembayaranmu',
      statusCode: 200,
      data: transactionSelected[0],
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
  checkIsDomainAvalaible,
  createWebsite,
  checkTransaction,
  getTransaction,
}
