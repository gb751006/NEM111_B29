const express = require("express");
const { userRouter } = require("./routes/userRoutes");
const { postRouter } = require("./routes/postRoutes");
const cors = require("cors");
const { connection } = require("./db");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Server is running on port ${process.env.PORT}`);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
});
