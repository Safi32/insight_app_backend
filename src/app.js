const express = require("express");
const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS
const app = express();
const authRoutes = require("./routes/auth.routes");
const departmentRoutes = require("./routes/department.routes");
const profileRoutes = require("./routes/profile.routes");
const logRoutes = require("./routes/logs.routes");
const branchRoutes = require("./routes/branch.routes");
const adminRoutes = require("./routes/admin.routes");
const apiRouter = express.Router();

app.use(cors());
// Increase payload limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
apiRouter.use('/auth', authRoutes);
apiRouter.use('/department', departmentRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/logs', logRoutes);
apiRouter.use('/branch', branchRoutes);
apiRouter.use('/admin', adminRoutes);
app.use('/api', apiRouter);

module.exports = { app };