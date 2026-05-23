const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ROUTES */

app.use("/", require("./routes/authRoutes"));

app.use("/", require("./routes/caseRoutes"));

app.use("/", require("./routes/summaryRoutes"));

app.use("/", require("./routes/argumentRoutes"));

app.use("/", require("./routes/timelineRoutes"));

app.use("/", require("./routes/dashboardRoutes"));

// app.use("/", require("./routes/chatRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});