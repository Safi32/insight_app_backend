const express = require("express");
const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS
const app = express();
const authRoutes = require("./routes/auth.routes");
const apiRouter = express.Router();

app.use(cors({ 
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));
app.use(express.json());

// routes
apiRouter.use('/auth', authRoutes);
app.use('/api', apiRouter);

module.exports = { app };