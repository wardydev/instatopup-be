const { getUsersQuery } = require("../model/user");

const getUsers = async (req, res) => {
  const dataUsers = await getUsersQuery();

  console.log(dataUsers, "DATA USEROS");

  return res.status(200).json({
    success: true,
    message: "Get users",
    data: dataUsers[0],
  });
};

module.exports = {
  getUsers,
};
