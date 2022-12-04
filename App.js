const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./Routes/user.Route");
dotenv.config();
app.use(cors());

const port = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("connecter à Mongo Db"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use("/user", userRouter);

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
