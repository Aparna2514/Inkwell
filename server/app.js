const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const diaryRoutes = require("./routes/diaryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/entries", diaryRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Inkwell API is running ");
});

module.exports = app;

