const { userAuthorization } = require('../helper/functions')
const { successResponse, errorResponse } = require('../helper/http')
const {
  createLogoQuery,
  getWebsiteIdQuery,
  createSliderQuery,
  deleteMediaByIdQuery,
  getUserMediaQuery,
} = require('../model/user-media')

const uploadLogo = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })
    const userLogin = userAuthorization(authorization)

    const [websiteSelected] = await getWebsiteIdQuery(userLogin.id)

    if (!req.file)
      return errorResponse({
        res,
        message: 'File tidak ditemukan',
        statusCode: 400,
      })
    const maxSize = 200 * 1024
    if (req.file.size > maxSize)
      return errorResponse({
        res,
        message: 'Ukuran file maksimal adalah 200KB',
        statusCode: 400,
      })

    if (req.file.mimetype !== 'image/png')
      return errorResponse({
        res,
        message: 'Hanya file PNG yang diperbolehkan',
        statusCode: 400,
      })

    const fileLocation = `/uploads/${req.file.filename}`

    await createLogoQuery({
      imageUrl: fileLocation,
      userId: userLogin.id,
      userWebsiteId: websiteSelected[0].id,
    })

    successResponse({
      res,
      message: 'Berhasil upload logo',
      statusCode: 200,
      data: {
        location: fileLocation,
      },
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi Kesalahan di server',
      statusCode: 500,
    })
  }
}

const uploadBanner = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })
    const userLogin = userAuthorization(authorization)

    const [websiteSelected] = await getWebsiteIdQuery(userLogin.id)

    if (!req.file)
      return errorResponse({
        res,
        message: 'File tidak ditemukan',
        statusCode: 400,
      })
    const maxSize = 200 * 1024
    if (req.file.size > maxSize)
      return errorResponse({
        res,
        message: 'Ukuran file maksimal adalah 200KB',
        statusCode: 400,
      })

    if (req.file.mimetype !== 'image/png')
      return errorResponse({
        res,
        message: 'Hanya file PNG yang diperbolehkan',
        statusCode: 400,
      })

    const fileLocation = `/uploads/${req.file.filename}`

    await createSliderQuery({
      imageUrl: fileLocation,
      userId: userLogin.id,
      userWebsiteId: websiteSelected[0].id,
    })

    successResponse({
      res,
      message: 'Berhasil upload banner',
      statusCode: 200,
      data: {
        location: fileLocation,
      },
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi Kesalahan di server',
      statusCode: 500,
    })
  }
}

const deleteLogo = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const { id } = req.params

    if (!id)
      return errorResponse({
        res,
        message: 'Media tidak ditemukan',
        statusCode: 400,
      })

    await deleteMediaByIdQuery({
      userId: userLogin.id,
      userMediaId: id,
    })

    successResponse({
      res,
      message: 'Berhasil menghapus media',
      statusCode: 200,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi Kesalahan di server',
      statusCode: 500,
    })
  }
}

const getUserLogo = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const [logoSelected] = await getUserMediaQuery({
      userId: userLogin.id,
      type: 'logo',
    })

    successResponse({
      res,
      message: 'Berhasil mengambil logo',
      statusCode: 200,
      data: logoSelected,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi Kesalahan di server',
      statusCode: 500,
    })
  }
}
const getUserBanner = async (req, res) => {
  try {
    const { authorization } = req.headers

    if (!authorization)
      return errorResponse({
        res,
        message: 'Unauthorized',
        statusCode: 401,
      })

    const userLogin = userAuthorization(authorization)

    const [bannerSelected] = await getUserMediaQuery({
      userId: userLogin.id,
      type: 'banner',
    })

    successResponse({
      res,
      message: 'Berhasil mengambil gambar banner',
      statusCode: 200,
      data: bannerSelected,
    })
  } catch (err) {
    console.log(err)
    return errorResponse({
      res,
      message: 'Terjadi Kesalahan di server',
      statusCode: 500,
    })
  }
}

module.exports = {
  uploadLogo,
  uploadBanner,
  deleteLogo,
  getUserLogo,
  getUserBanner,
}
