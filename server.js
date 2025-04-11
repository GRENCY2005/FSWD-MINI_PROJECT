const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDb = require("./config/connectDb");

// Load env variables
dotenv.config();

// Database connection
connectDb();

// App instance
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/users", require("./routes/userRoute"));
app.use("/api/v1/transections", require("./routes/transectionRoutes"));

// Default Route
app.get("/", (req, res) => {
  res.send("API Running Successfully");
});

// Port
const PORT = process.env.PORT || 8080;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgCyan.white);
});
