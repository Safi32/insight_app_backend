const express = require("express");
const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS
const app = express();
const authRoutes = require("./routes/auth.routes");
const departmentRoutes = require("./routes/department.routes");
const profileRoutes = require("./routes/profile.routes");
const logRoutes = require("./routes/logs.routes");
const apiRouter = express.Router();

app.use(cors());
app.use(express.json());
apiRouter.use('/auth', authRoutes);
apiRouter.use('/department', departmentRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/logs', logRoutes);
app.use('/api', apiRouter);

module.exports = { app };