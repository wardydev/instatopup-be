const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const memberRouter = require('./routes/member.js')
const userRouter = require('./routes/user.js')
const packagesRouter = require('./routes/packages.js')
const bankRouter = require('./routes/bank.js')
const orderRouter = require('./routes/order.js')
const mediaRouter = require('./routes/user-media.js')
const withdrawalRouter = require('./routes/withdrawal.js')
const balanceRouter = require('./routes/balance.js')

const app = express()
const corsOptions = {
  // origin: "http://localhost:5174",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}

dotenv.config()
app.use(cors(corsOptions))
app.use(express.json())

app.use('/member', memberRouter)
app.use('/user', userRouter)
app.use('/packages', packagesRouter)
app.use('/bank', bankRouter)
app.use('/order', orderRouter)
app.use('/media', mediaRouter)
app.use('/withdrawal', withdrawalRouter)
app.use('/balance', balanceRouter)

app.get('/', (req, res) => {
  res.send('Hello world!')
})
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
