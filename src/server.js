const express = require('express')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const memberRouter = require('./routes/member.js')
const userRouter = require('./routes/user.js')
const packagesRouter = require('./routes/packages.js')
const bankRouter = require('./routes/bank.js')
const orderRouter = require('./routes/order.js')
const mediaRouter = require('./routes/user-media.js')
const withdrawalRouter = require('./routes/withdrawal.js')
const balanceRouter = require('./routes/balance.js')
const productRouter = require('./routes/product.js')
const categoryRouter = require('./routes/category.js')
const flashSaleRouter = require('./routes/flashSales.js')
const userProductRouter = require('./routes/userProduct.js')
const depositRouter = require('./routes/deposit.js')
// rest api
const restApiRouter = require('./routes/restApi/index.js')
const adminRouter = require('./routes/admin/index.js')

const app = express()
app.set('trust proxy', 1)
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5500',
    'https://wardyflix.my.id',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
  optionsSuccessStatus: 204,
}
app.use(cors(corsOptions))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

dotenv.config()
app.use(cors(corsOptions))
app.use(express.json())

app.use('/member', memberRouter)
app.use('/user', userRouter)
app.use('/packages', packagesRouter)
app.use('/bank', bankRouter)
app.use('/order', orderRouter)
// middleware express static

app.use('/media', mediaRouter)
app.use('/withdrawal', withdrawalRouter)
app.use('/balance', balanceRouter)
app.use('/products', productRouter)
app.use('/category', categoryRouter)
app.use('/flash-sale', flashSaleRouter)
app.use('/user-product', userProductRouter)
app.use('/deposit', depositRouter)
// rest api
app.use('/api/v1', restApiRouter)
// admin
app.use('/admin', adminRouter)

app.get('/', (req, res) => {
  res.send('Hello world!')
})
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
