const { getUserByEmail } = require("../model/user");

const login = async (req, res) => {
  const { email } = req.query;

  console.log(email, "EMAILOSS123123");

  const dataUsers = await getUserByEmail(email);
  console.log(dataUsers, "DATA USEROS");

  return res.status(200).json({
    success: true,
    message: "Get users",
    data: dataUsers[0],
  });
};

module.exports = {
  login,
};
