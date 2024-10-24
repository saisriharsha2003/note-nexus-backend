const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const userRouter = require("./routes/Routes");

const mongoURI = process.env.MONGODB_URL;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB Atlas!");
})
.catch((error) => {
  console.error("Error connecting to MongoDB Atlas:", error);
});

app.use("/api/user", userRouter);

const server = app.listen(8080, () => {
  console.log("Server started on port 8080");
});
