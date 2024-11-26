const successResponse = ({ res, statusCode, message, data, meta }) => {
  const response = {
    success: true,
    message,
  }

  if (data !== null) {
    response.data = data
  }

  if (meta !== null) {
    response.meta = meta
  }

  return res.status(statusCode).json(response)
}

const errorResponse = ({ res, statusCode, message }) => {
  return res.status(statusCode).json({
    success: false,
    message,
  })
}

const httpCreateTransaction = async (body) => {
  try {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow',
    }
    const response = await fetch(
      'https://passport.duitku.com/webapi/api/merchant/v2/inquiry', //sandbox
      requestOptions
    )
    return response.json()
  } catch (err) {
    console.log(err)
    throw new Error()
  }
}

const httpCheckTransaction = async (body) => {
  try {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(body),
      redirect: 'follow',
    }
    const response = await fetch(
      'https://passport.duitku.com/webapi/api/merchant/transactionStatus',
      requestOptions
    )
    return await response.json()
  } catch (err) {
    throw new Error()
  }
}

const httpCreateMessage = async ({ message, phone }) => {
  const formData = new URLSearchParams()
  formData.append('appkey', process.env.WAZOID_APP_KEY)
  formData.append('authkey', process.env.WAZOID_AUTH_KEY)
  formData.append('to', phone)
  formData.append('message', message)

  const response = await fetch(process.env.WAZOID_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  })

  return response
}

const httpVcGamer = async (url) => {
  try {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${process.env.VCGAMERS_TOKEN}`)
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
    const response = await fetch(url, requestOptions)
    return response.json()
  } catch (err) {
    throw new Error()
  }
}

const httpVcGamerCreateOrder = async (url, formData) => {
  try {
    var myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${process.env.VCGAMERS_TOKEN}`)
    myHeaders.append('Content-Type', 'application/json')

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formData,
      redirect: 'follow',
    }

    const res = await fetch(url, requestOptions)
    return await res.json()
  } catch (err) {
    throw new Error()
  }
}

module.exports = {
  successResponse,
  errorResponse,
  httpCreateTransaction,
  httpCreateMessage,
  httpCheckTransaction,
  httpVcGamer,
  httpVcGamerCreateOrder,
}
