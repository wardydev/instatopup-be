const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  getUserByEmailQuery,
  createUserQuery,
  updateUserPasswordQuery,
  getUserById,
  getUserByEmailAuthorizationQuery,
} = require("../model/user.js");
const {
  saveOtpQuery,
  getOtpByEmailQuery,
  deleteOtpQuery,
} = require("../model/otp.js");
const { generateOtp, userAuthorization } = require("../helper/functions.js");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password harus diisi.",
      });
    }

    // Ambil pengguna dari database berdasarkan email
    const [user] = await getUserByEmailQuery(email);

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    const userRecord = user[0];

    // Periksa apakah password cocok
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    // Buat OTP
    const otp = generateOtp();

    // Tentukan waktu kadaluwarsa OTP (misalnya 5 menit)
    const expirationTime = new Date(Date.now() + 5 * 60000); // 5 menit dari sekarang

    // Simpan OTP ke database
    await saveOtpQuery(
      userRecord.email,
      userRecord.phoneNumber,
      otp,
      expirationTime
    );

    // Kirim OTP melalui WhatsApp
    const formData = new URLSearchParams();
    formData.append("appkey", process.env.WAZOID_APP_KEY);
    formData.append("authkey", process.env.WAZOID_AUTH_KEY);
    formData.append("to", userRecord.phoneNumber);
    formData.append("message", `Your OTP code is ${otp}`);

    const response = await fetch(process.env.WAZOID_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to send OTP via WhatsApp");
    }

    // Kembalikan respons bahwa OTP telah dikirim
    res.status(200).json({
      success: true,
      message: "OTP telah dikirim ke nomor WhatsApp Anda.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;

    // Validasi input
    if (!username || !email || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua kolom harus diisi.",
      });
    }

    // Check if user with the same email already exists
    const [existingUser] = await getUserByEmailQuery(email);
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar. Silakan gunakan email lain.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    await createUserQuery({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: "Registrasi berhasil.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

const validateOtp = async (req, res) => {
  try {
    const { otp, email, username, phoneNumber } = req.body;

    const [user] = await getUserByEmailQuery(email);
    const userRecord = user[0];

    // Ambil OTP terbaru berdasarkan userId
    const [latestOtp] = await getOtpByEmailQuery(email);

    if (!latestOtp || latestOtp.length === 0) {
      return res.status(404).json({
        success: false,
        message: "OTP tidak ditemukan atau sudah kadaluarsa.",
      });
    }

    // Validasi OTP
    if (latestOtp[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "OTP tidak valid.",
      });
    }

    // Hapus OTP dari database setelah validasi berhasil
    await deleteOtpQuery(email);

    // Buat JWT token
    const payload = {
      id: userRecord.id,
      email,
      username,
      phoneNumber,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
    });

    // Kembalikan token JWT
    res.status(200).json({
      success: true,
      message: "Validasi OTP berhasil.",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const userSelected = userAuthorization(authorization);

    // Ambil data pengguna dari database
    const [user] = await getUserByEmailAuthorizationQuery(userSelected.email);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan.",
      });
    }

    const userInfo = user[0];

    res.status(200).json({
      success: true,
      data: userInfo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const userSelected = userAuthorization(authorization);
    const { oldPassword, newPassword } = req.body;

    // Validasi input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Password lama dan password baru harus diisi.",
      });
    }

    // Ambil data pengguna dari database
    const [user] = await getUserById(userSelected.id);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan.",
      });
    }

    const userRecord = user[0];

    // Periksa apakah password lama cocok
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userRecord.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Password lama salah.",
      });
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Perbarui password di database
    await updateUserPasswordQuery(userSelected.id, hashedPassword);

    res.status(200).json({
      success: true,
      message: "Password berhasil diubah.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  validateOtp,
  getUserInfo,
  changePassword,
};
