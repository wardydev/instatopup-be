const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.js");

const app = express();
const corsOptions = {
  // origin: "http://localhost:5174",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

dotenv.config();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
