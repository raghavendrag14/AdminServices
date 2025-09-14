require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes")
const app = express();

// // Security + parsing
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "200kb" })); // replace body-parser

//Basic rate limit (tune for your needs)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// DB connect
mongoose.connect(process.env.MONGODB_URI, {
  autoIndex: true, // for unique indexes in dev; consider disabling in prod once indexes are built
})
.then(() => console.log("MongoDB connected"))
.catch((e) => {
  console.error("MongoDB connection error:", e.message);
  process.exit(1);
});

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/roles",roleRoutes );

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Not found route" }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

// Start
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
