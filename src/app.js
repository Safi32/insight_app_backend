const express = require("express");
const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS
const app = express();
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));

module.exports = { app };