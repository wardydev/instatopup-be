const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.js')
const packageRouter = require('./routes/packages.js')
const tokoRouter = require('./routes/toko.js')
const transactionRouter = require('./routes/transaction.js')
const infoUserRouter = require('./routes/info.js')
const depositRouter = require('./routes/deposit.js')
const productRouter = require('./routes/products.js')
const netflixRouter = require('./routes/admin/netflix.js')
const netflixProfileRouter = require('./routes/admin/netflixByProfile.js')
const voucherRouter = require('./routes/admin/voucher.js')
const adminTokoRouter = require('./routes/admin/adminToko.js')
const adminDepositRouter = require('./routes/admin/depositAdmin.js')
const productAdminRouter = require('./routes/admin/productsAdmin.js')
const userAdminRouter = require('./routes/admin/userAdmin.js')
const authCustomerRouter = require('./routes/customer/auth.js')
const userCustomerRouter = require('./routes/customer/user.js')
const productCustomerRouter = require('./routes/customer/products.js')
const orderCustomerRouter = require('./routes/customer/order.js')
const dashboardAdmin = require('./routes/admin/dashboard.js')
const orderAdmin = require('./routes/admin/order.js')
const debtRouter = require('./routes/premium/debt.js')
const bookkeppingRouter = require('./routes/premium/bookkepping.js')
const sellPriceRouter = require('./routes/premium/sellPrice.js')
const landingRouter = require('./routes/landing.js')
const netflixCustomerRouter = require('./routes/netflix/netflix.js')

const app = express()
const corsOptions = {
  origin: [
    'https://mitra.tokoflix.id',
    'https://admin.tokoflix.id',
    'https://tokoflix.id',
    'https://wardyflix.my.id',
    'https://wardy.wardyflix.my.id',
    'http://localhost:5173',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
  optionsSuccessStatus: 204,
}

dotenv.config()
app.use(cors(corsOptions))
app.use(express.json())

app.use('/auth', userRouter)
app.use('/packages', packageRouter)
app.use('/toko', tokoRouter)
app.use('/transaction', transactionRouter)
app.use('/user', infoUserRouter)
app.use('/deposit', depositRouter)
app.use('/products', productRouter)
app.use('/admin/netflix', netflixRouter)
app.use('/admin/netflix-profile', netflixProfileRouter)
app.use('/admin/voucher', voucherRouter)
app.use('/admin/toko', adminTokoRouter)
app.use('/admin/deposit', adminDepositRouter)
app.use('/admin/products', productAdminRouter)
app.use('/admin/user', userAdminRouter)
app.use('/customer/auth', authCustomerRouter)
app.use('/customer/user', userCustomerRouter)
app.use('/customer/product', productCustomerRouter)
app.use('/customer/order', orderCustomerRouter)
app.use('/dashboard', dashboardAdmin)
app.use('/admin/order', orderAdmin)
app.use('/debt', debtRouter)
app.use('/bookkepping', bookkeppingRouter)
app.use('/sell-price', sellPriceRouter)
app.use('/landing', landingRouter)
app.use('/netflix', netflixCustomerRouter)

app.get('/', (req, res) => {
  res.send('Hello world 2!')
})
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
