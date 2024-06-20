const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getUserByEmailQuery, createUserQuery } = require("../model/user.js");
const {
  saveOtpQuery,
  getOtpByEmailQuery,
  deleteOtpQuery,
} = require("../model/otp.js");
const { generateOtp } = require("../helper/functions.js");

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
    formData.append("appkey", "81ad1d11-093c-4c5b-99f9-ae32eec05090");
    formData.append(
      "authkey",
      "pW1vbOQVTm0pLOoLyxjKKC4BcTePqi4ZLbNKGYzJBUAXmSy6fv"
    );
    formData.append("to", userRecord.phoneNumber);
    formData.append("message", `Your OTP code is ${otp}`);

    const response = await fetch("https://wazoid.com/api/create-message", {
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

module.exports = {
  loginUser,
  registerUser,
  validateOtp,
};
